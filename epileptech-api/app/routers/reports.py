from flask import Blueprint, request, jsonify, send_file, g
import logging
from datetime import datetime
from app.database.database import eeg_reports_collection
from app.utils.auth import login_required, doctor_required
from app.models.llm_report_generator import generate_pdf_report as regenerate_report
import json
import os
from bson import ObjectId

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create blueprint
router = Blueprint('reports', __name__, url_prefix='/api/reports')

@router.route('/', methods=['GET'])
@login_required
def get_all_reports():
    """Get all reports for the current user"""
    try:
        current_user = g.current_user
        
        # Check if user is a doctor
        if not current_user.get("is_doctor", False):
            # For patients, only return their own reports
            reports = list(eeg_reports_collection.find({"patient_id": str(current_user["_id"])}).limit(100))
        else:
            # For doctors, return all reports they created
            reports = list(eeg_reports_collection.find({"doctor_id": current_user["_id"]}).limit(100))
            
        # Process for JSON serialization
        for report in reports:
            report["_id"] = str(report["_id"])
            # Only include completed reports with results
            if "result" not in report:
                report["result"] = "pending"
                report["confidence"] = 0
                
        return jsonify(reports)
    except Exception as e:
        logger.error(f"Error fetching reports: {str(e)}")
        return jsonify({"error": f"Error fetching reports: {str(e)}"}), 500

@router.route('/<eeg_id>', methods=['GET'])
@login_required
def get_report(eeg_id):
    """Get a specific report by EEG ID"""
    try:
        current_user = g.current_user
        
        report = eeg_reports_collection.find_one({"eeg_id": eeg_id})
        
        if not report:
            return jsonify({"error": "Report not found"}), 404
            
        # Check access permissions
        if current_user.get("is_doctor", False):
            # Doctors can access reports they created
            if str(report["doctor_id"]) != str(current_user["_id"]):
                return jsonify({"error": "Access denied"}), 403
        else:
            # Patients can only access their own reports
            if str(report["patient_id"]) != str(current_user["_id"]):
                return jsonify({"error": "Access denied"}), 403
                
        # Process for JSON serialization
        report["_id"] = str(report["_id"])
        
        return jsonify(report)
    except Exception as e:
        logger.error(f"Error fetching report {eeg_id}: {str(e)}")
        return jsonify({"error": f"Error fetching report: {str(e)}"}), 500

@router.route('/regenerate', methods=['POST'])
@login_required
def regenerate_eeg_report():
    """Regenerate a report with custom prompting"""
    try:
        current_user = g.current_user
        data = request.get_json()
        
        # Check if user is a doctor
        if not current_user.get("is_doctor", False):
            return jsonify({"error": "Only doctors can regenerate reports"}), 403
            
        # Get the EEG record
        eeg_record = eeg_reports_collection.find_one({"eeg_id": data["eeg_id"]})
        
        if not eeg_record:
            return jsonify({"error": "EEG record not found"}), 404
            
        # Check if report is completed
        if eeg_record.get("status") != "completed":
            return jsonify({"error": "Cannot regenerate report for unprocessed EEG"}), 400
            
        # Check permissions
        if str(eeg_record["doctor_id"]) != str(current_user["_id"]):
            return jsonify({"error": "Access denied"}), 403
            
        # Regenerate the report
        new_report = regenerate_report(
            eeg_data=None,  # We'll pull this from the file
            result=eeg_record["result"],
            confidence=eeg_record["confidence"],
            custom_prompt=data.get("customPrompt")
        )
        
        # Update the record with the new report
        eeg_reports_collection.update_one(
            {"eeg_id": data["eeg_id"]},
            {"$set": {
                "report": new_report,
                "last_updated": datetime.now()
            }}
        )
        
        return jsonify({
            "eeg_id": data["eeg_id"],
            "report": new_report
        })
        
    except Exception as e:
        logger.error(f"Error regenerating report: {str(e)}")
        return jsonify({"error": f"Error regenerating report: {str(e)}"}), 500

@router.route('/<eeg_id>/download', methods=['GET'])
@login_required
def download_report(eeg_id):
    """Download a report as PDF or JSON"""
    try:
        current_user = g.current_user
        
        report = eeg_reports_collection.find_one({"eeg_id": eeg_id})
        
        if not report:
            return jsonify({"error": "Report not found"}), 404
            
        # Check access permissions (same as get_report)
        if current_user.get("is_doctor", False):
            if str(report["doctor_id"]) != str(current_user["_id"]):
                return jsonify({"error": "Access denied"}), 403
        else:
            if str(report["patient_id"]) != str(current_user["_id"]):
                return jsonify({"error": "Access denied"}), 403
                
        # Check if report is completed
        if report.get("status") != "completed":
            return jsonify({"error": "Cannot download report for unprocessed EEG"}), 400
            
        # Create a temporary JSON file
        temp_dir = "temp_reports"
        os.makedirs(temp_dir, exist_ok=True)
        
        file_path = f"{temp_dir}/{eeg_id}_report.json"
        
        # Prepare report data
        report_data = {
            "eeg_id": report["eeg_id"],
            "patient": report["patient"],
            "result": report["result"],
            "confidence": report["confidence"],
            "report_text": report.get("report", "No report available"),
            "record_date": report["record_date"],
            "processed_at": report.get("processed_at", datetime.now()).isoformat(),
        }
        
        # Write to file
        with open(file_path, "w") as f:
            json.dump(report_data, f, indent=2)
            
        # Return the file
        return send_file(
            file_path,
            mimetype='application/json',
            as_attachment=True,
            download_name=f"EEG_Report_{eeg_id}.json"
        )
        
    except Exception as e:
        logger.error(f"Error downloading report {eeg_id}: {str(e)}")
        return jsonify({"error": f"Error downloading report: {str(e)}"}), 500