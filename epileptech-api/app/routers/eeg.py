from flask import Blueprint, request, jsonify, send_file
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import uuid
import shutil
import logging
from bson import ObjectId
from app.database.database import eeg_reports_collection, patients_collection
from app.models.gnn_classifier import classify_eeg, preprocess_eeg_to_graph
from app.models.llm_report_generator import generate_report, generate_pdf_report
from app.utils.auth import login_required, doctor_required
from app.utils.file_handlers import process_eeg_file, validate_eeg_file

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create blueprint
router = Blueprint('eeg', __name__, url_prefix='/api/eeg')

@router.route('/upload', methods=['POST'])
@login_required
def upload_eeg():
    """
    Upload and process an EEG file
    
    - Validates the file format
    - Saves the file to a temporary location
    - Creates a patient record if not exists
    - Creates an EEG report record with pending status
    - Returns the EEG ID for tracking
    """
    try:
        # Get current user from Flask g object
        current_user = g.current_user
        
        # Get form data
        file = request.files['file']
        eeg_id = request.form['eeg_id']
        record_date = request.form['record_date']
        patient_info = request.form['patient_info']
        
        # Validate file format
        if not validate_eeg_file(file):
            return jsonify({"error": "Invalid file format. Supported formats: .edf, .bdf, .zip, .gz"}), 400
            
        # Create unique file path
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"{eeg_id}_{timestamp}_{secure_filename(file.filename)}"
        file_path = f"temp_uploads/{filename}"
        
        # Create directory if it doesn't exist
        os.makedirs("temp_uploads", exist_ok=True)
        
        # Save file temporarily
        file.save(file_path)
        
        # Parse patient info from form
        import json
        patient_data = json.loads(patient_info)
        
        # Check if patient exists, create if not
        patient_query = {
            "firstName": patient_data["firstName"],
            "lastName": patient_data["lastName"]
        }
        
        existing_patient = patients_collection.find_one(patient_query)
        
        if not existing_patient:
            # Create a new patient record
            patient_id = str(ObjectId())
            patient_to_insert = {
                "patient_id": patient_id,
                "firstName": patient_data["firstName"],
                "lastName": patient_data["lastName"],
                "age": patient_data["age"],
                "gender": patient_data["gender"],
                "created_at": datetime.now()
            }
            patients_collection.insert_one(patient_to_insert)
        else:
            patient_id = existing_patient["patient_id"]
        
        # Create EEG report record
        eeg_record = {
            "eeg_id": eeg_id,
            "patient_id": patient_id,
            "doctor_id": current_user["_id"],
            "file_path": file_path,
            "record_date": record_date,
            "upload_date": datetime.now(),
            "status": "pending",
            "notes": patient_data.get("notes", ""),
            "patient": {
                "firstName": patient_data["firstName"],
                "lastName": patient_data["lastName"],
                "age": patient_data["age"],
                "gender": patient_data["gender"]
            }
        }
        
        # Insert into database
        eeg_reports_collection.insert_one(eeg_record)
        
        logger.info(f"File {file_path} uploaded and ready for processing")
        
        return jsonify({
            "eeg_id": eeg_id,
            "message": f"EEG file uploaded successfully. Processing will begin shortly.",
            "status": "pending"
        })
        
    except Exception as e:
        logger.error(f"Error processing EEG upload: {str(e)}")
        return jsonify({"error": f"Error processing upload: {str(e)}"}), 500

@router.route('/reports', methods=['GET'])
@login_required
def get_eeg_reports():
    """Get all EEG reports for the current doctor"""
    try:
        # Get current user from Flask g object
        current_user = g.current_user
        
        # Query reports for the current doctor
        reports = list(eeg_reports_collection.find({"doctor_id": current_user["_id"]}).limit(100))
        
        # Convert ObjectId to string for JSON serialization
        for report in reports:
            report["_id"] = str(report["_id"])
        
        return jsonify(reports)
    except Exception as e:
        logger.error(f"Error fetching EEG reports: {str(e)}")
        return jsonify({"error": f"Error fetching reports: {str(e)}"}), 500

@router.route('/reports/<eeg_id>', methods=['GET'])
@login_required
def get_eeg_report(eeg_id):
    """Get a specific EEG report by ID"""
    try:
        # Get current user from Flask g object
        current_user = g.current_user
        
        report = eeg_reports_collection.find_one({"eeg_id": eeg_id})
        
        if not report:
            return jsonify({"error": "Report not found"}), 404
            
        # Check if user has access
        if str(report["doctor_id"]) != str(current_user["_id"]):
            return jsonify({"error": "You don't have access to this report"}), 403
            
        # Convert ObjectId to string
        report["_id"] = str(report["_id"])
        
        return jsonify(report)
    except Exception as e:
        logger.error(f"Error fetching EEG report {eeg_id}: {str(e)}")
        return jsonify({"error": f"Error fetching report: {str(e)}"}), 500

@router.route('/process/<eeg_id>', methods=['POST'])
@login_required
def process_eeg(eeg_id):
    """
    Process an EEG file to classify and generate a report
    """
    try:
        # Get current user from Flask g object
        current_user = g.current_user
        
        # Find the EEG record
        eeg_record = eeg_reports_collection.find_one({"eeg_id": eeg_id})
        
        if not eeg_record:
            return jsonify({"error": "EEG record not found"}), 404
            
        # Check if user has access
        if str(eeg_record["doctor_id"]) != str(current_user["_id"]):
            return jsonify({"error": "You don't have access to this report"}), 403
            
        # Check if already processed
        if eeg_record["status"] == "completed":
            return jsonify({"message": "This EEG has already been processed"})
            
        # Process the EEG file
        file_path = eeg_record["file_path"]
        
        # Extract the raw EEG data
        eeg_data = process_eeg_file(file_path)
        
        # Run the GNN classification model
        classification, confidence_scores, seizure_intervals = classify_eeg(eeg_data)
        
        # Prepare case info for report generation
        eeg_case = {
            "eeg_id": eeg_id,
            "first_name": eeg_record["patient"]["firstName"],
            "last_name": eeg_record["patient"]["lastName"],
            "age": eeg_record["patient"]["age"],
            "gender": eeg_record["patient"]["gender"],
            "record_date": eeg_record["record_date"],
            "clinical_notes": eeg_record["notes"],
            "classification": classification,
            "confidence": confidence_scores,
            "seizure_intervals": seizure_intervals
        }
        
        # Generate LLM report
        report_text = generate_report(eeg_case)
        
        # Generate PDF report and get the file path
        pdf_path = generate_pdf_report(eeg_case)
        
        # Update the record with the results
        update_data = {
            "status": "completed",
            "result": classification,
            "confidence": confidence_scores,
            "seizure_intervals": seizure_intervals,
            "report": report_text,
            "report_file": pdf_path,
            "processed_at": datetime.now()
        }
        
        eeg_reports_collection.update_one(
            {"eeg_id": eeg_id},
            {"$set": update_data}
        )
        
        return jsonify({
            "message": "EEG processed successfully",
            "eeg_id": eeg_id,
            "classification": classification,
            "confidence": confidence_scores
        })
        
    except Exception as e:
        logger.error(f"Error processing EEG {eeg_id}: {str(e)}")
        return jsonify({"error": f"Error processing EEG: {str(e)}"}), 500

@router.route('/reports/<eeg_id>/download', methods=['GET'])
@login_required
def download_report(eeg_id):
    """Download the PDF report for a specific EEG"""
    try:
        # Get current user from Flask g object
        current_user = g.current_user
        
        report = eeg_reports_collection.find_one({"eeg_id": eeg_id})
        
        if not report:
            return jsonify({"error": "Report not found"}), 404
            
        # Check if user has access
        if str(report["doctor_id"]) != str(current_user["_id"]):
            return jsonify({"error": "You don't have access to this report"}), 403
            
        # Check if report exists
        if "report_file" not in report:
            return jsonify({"error": "Report file not found"}), 404
            
        pdf_path = report["report_file"]
        
        if not os.path.exists(pdf_path):
            return jsonify({"error": "Report file not found on server"}), 404
            
        return send_file(
            pdf_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"EEG_Report_{eeg_id}.pdf"
        )
        
    except Exception as e:
        logger.error(f"Error downloading report {eeg_id}: {str(e)}")
        return jsonify({"error": f"Error downloading report: {str(e)}"}), 500

@router.route('/reports/<eeg_id>', methods=['DELETE'])
@login_required
def delete_eeg_report(eeg_id):
    """Delete an EEG report and its associated files"""
    try:
        # Get current user from Flask g object
        current_user = g.current_user
        
        report = eeg_reports_collection.find_one({"eeg_id": eeg_id})
        
        if not report:
            return jsonify({"error": "Report not found"}), 404
            
        # Check if user has access
        if str(report["doctor_id"]) != str(current_user["_id"]):
            return jsonify({"error": "You don't have access to this report"}), 403
            
        # Delete associated files
        if "file_path" in report and os.path.exists(report["file_path"]):
            os.remove(report["file_path"])
            
        if "report_file" in report and os.path.exists(report["report_file"]):
            os.remove(report["report_file"])
            
        # Delete from database
        eeg_reports_collection.delete_one({"eeg_id": eeg_id})
        
        return jsonify({"message": "Report deleted successfully"})
        
    except Exception as e:
        logger.error(f"Error deleting report {eeg_id}: {str(e)}")
        return jsonify({"error": f"Error deleting report: {str(e)}"}), 500