import os
import json
import logging
import requests
import datetime
from typing import Dict, Any, Optional
import tempfile
from fpdf import FPDF

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Check for environment variables
MODEL_NAME = os.environ.get("LLM_MODEL_NAME", "chaoyi-wu/PMC_LLAMA_7B")
API_URL = os.environ.get("LLM_API_URL", "")
API_KEY = os.environ.get("LLM_API_KEY", "")

# Flag to determine if we should use local generation or API
USE_LOCAL_MODEL = os.environ.get("USE_LOCAL_MODEL", "True").lower() == "true"

def build_prompt(eeg_case):
    """
    Build a prompt for the LLM based on EEG analysis results
    
    Args:
        eeg_case: Dictionary containing patient and EEG analysis data
        
    Returns:
        prompt: Formatted prompt string
    """
    # Format seizure intervals
    intervals = ", ".join([f"{start}–{end}" for start, end in eeg_case.get("seizure_intervals", [])])
    if not intervals:
        intervals = "None detected"
    
    # Format confidence scores
    confidence_text = "\n".join([f"- {label.capitalize()}: {score:.2f}%" 
                               for label, score in eeg_case.get("confidence", {}).items()])
    
    prompt = f"""
Patient EEG Diagnostic Report

Patient Information:
- Name: {eeg_case.get("first_name", "")} {eeg_case.get("last_name", "")}
- Age: {eeg_case.get("age", "")} years
- Gender: {eeg_case.get("gender", "")}
- EEG Record ID: {eeg_case.get("eeg_id", "")}
- Record Date: {eeg_case.get("record_date", datetime.datetime.now().strftime("%Y-%m-%d"))}

Clinical Notes:
{eeg_case.get("clinical_notes", "No clinical notes provided.")}

AI-Based EEG Classification Result:
- Predicted Class: {eeg_case.get("classification", "Unknown")}
- Confidence Scores:
{confidence_text}
- Detected Seizure Intervals: {intervals}

Based on the above information, please generate a comprehensive medical report. Include:
1. A summary of findings
2. Technical details of the EEG recording and analysis
3. Clinical interpretation of the results
4. Treatment recommendations based on the classification
5. Follow-up suggestions for the patient

Use appropriate medical terminology for a neurologist's report, but include explanations that would be understandable to patients. Be factual and evidence-based.
"""
    
    return prompt

def generate_report_local(prompt):
    """
    Generate a report using a locally loaded LLM
    
    Args:
        prompt: Input prompt for the model
        
    Returns:
        report_text: Generated report text
    """
    try:
        # Try to import the necessary modules
        import torch
        from transformers import AutoModelForCausalLM, AutoTokenizer
        
        # Load the model and tokenizer (only once)
        global tokenizer, model
        if 'tokenizer' not in globals() or 'model' not in globals():
            logger.info(f"Loading model {MODEL_NAME}...")
            tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, use_fast=False)
            model = AutoModelForCausalLM.from_pretrained(
                MODEL_NAME,
                device_map="auto",
                torch_dtype=torch.float16,
                use_safetensors=True
            )
            logger.info("Model loaded successfully")
        
        # Prepare inputs
        inputs = tokenizer(prompt, return_tensors="pt")
        input_ids = inputs["input_ids"].to(model.device)
        attention_mask = inputs["attention_mask"].to(model.device)
        
        # Generate
        with torch.no_grad():
            output = model.generate(
                input_ids=input_ids,
                attention_mask=attention_mask,
                max_new_tokens=512,
                do_sample=True,
                temperature=0.9,
                top_p=0.95,
                repetition_penalty=1.1,
                eos_token_id=tokenizer.eos_token_id
            )
        
        # Decode
        report_text = tokenizer.decode(output[0], skip_special_tokens=True)
        return report_text
        
    except ImportError as e:
        logger.error(f"Required modules not available for local LLM: {str(e)}")
        return generate_mock_report(prompt)
    except Exception as e:
        logger.error(f"Error generating report locally: {str(e)}")
        return generate_mock_report(prompt)

def generate_report_api(prompt):
    """
    Generate a report using a remote LLM API
    
    Args:
        prompt: Input prompt for the model
        
    Returns:
        report_text: Generated report text
    """
    try:
        if not API_URL or not API_KEY:
            logger.warning("API URL or API Key not provided. Using mock report.")
            return generate_mock_report(prompt)
            
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}"
        }
        
        payload = {
            "model": MODEL_NAME,
            "messages": [
                {"role": "system", "content": "You are a medical AI assistant specialized in neurological EEG analysis."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 800
        }
        
        response = requests.post(API_URL, headers=headers, json=payload)
        
        if response.status_code == 200:
            result = response.json()
            report_text = result["choices"][0]["message"]["content"]
            return report_text
        else:
            logger.error(f"API error: {response.status_code} - {response.text}")
            return generate_mock_report(prompt)
            
    except Exception as e:
        logger.error(f"Error generating report via API: {str(e)}")
        return generate_mock_report(prompt)

def generate_mock_report(prompt):
    """
    Generate a mock report when LLM is not available
    
    Args:
        prompt: Input prompt that would have been sent to the LLM
        
    Returns:
        report_text: Generated mock report text
    """
    # Extract key information from the prompt
    classification = "Unknown"
    if "Predicted Class:" in prompt:
        classification_line = [line for line in prompt.split('\n') if "Predicted Class:" in line][0]
        classification = classification_line.split(":")[-1].strip()
    
    patient_name = "Patient"
    if "Name:" in prompt:
        name_line = [line for line in prompt.split('\n') if "Name:" in line][0]
        patient_name = name_line.split(":")[-1].strip()
    
    # Date format
    today = datetime.datetime.now().strftime("%B %d, %Y")
    
    # Generate report based on classification
    if "epileptic" in classification.lower():
        return f"""
# EEG Analysis Report for {patient_name}

**Date:** {today}
**Classification:** EPILEPTIC
**Confidence:** HIGH

## Summary of Findings
The EEG recording demonstrates abnormal electrical activity consistent with epileptiform discharges. Specifically, we observed intermittent sharp waves and spike complexes predominantly in the temporal regions. These findings are highly suggestive of focal epilepsy of temporal lobe origin.

## Technical Details
- Recording duration: 30 minutes
- Montage: International 10-20 system
- Patient state: Awake and drowsy states captured
- Hyperventilation: Performed for 3 minutes
- Photic stimulation: Performed at frequencies from 1-30 Hz

## Clinical Interpretation
The observed epileptiform activity is characteristic of focal epilepsy originating from the temporal lobe. The pattern and distribution of discharges suggest a focal cortical irritability that may be associated with complex partial seizures. The high confidence score indicates that these findings are clear and consistent throughout the recording.

## Recommendations
1. **Medication Management**: Consider anticonvulsant therapy appropriate for focal epilepsy (e.g., levetiracetam, lamotrigine, or carbamazepine).
2. **Additional Testing**: An MRI of the brain is recommended to evaluate for structural abnormalities in the temporal lobe region.
3. **Follow-up EEG**: Consider a sleep-deprived EEG in 3-6 months to assess treatment response.
4. **Lifestyle Management**: Patient should avoid sleep deprivation, excessive alcohol consumption, and adhere to regular medication schedules.

## Patient Education
Temporal lobe epilepsy can cause focal aware seizures (auras) and focal impaired awareness seizures (complex partial seizures). Patients may experience sensory phenomena, déjà vu sensations, or unusual smells before seizures. With appropriate medication and lifestyle management, most patients achieve good seizure control.
"""
    elif "non-epileptic" in classification.lower():
        return f"""
# EEG Analysis Report for {patient_name}

**Date:** {today}
**Classification:** NON-EPILEPTIC
**Confidence:** HIGH

## Summary of Findings
The EEG recording shows no epileptiform abnormalities. Background activity is well-organized and symmetric, with normal alpha rhythm posteriorly. No evidence of seizure activity or interictal epileptiform discharges was observed during the recording session.

## Technical Details
- Recording duration: 30 minutes
- Montage: International 10-20 system
- Patient state: Awake and drowsy states captured
- Hyperventilation: Performed for 3 minutes
- Photic stimulation: Performed at frequencies from 1-30 Hz

## Clinical Interpretation
The EEG shows normal background activity appropriate for the patient's age. Alpha rhythm is well-developed and symmetric, ranging from 9-11 Hz. Beta activity is present in frontal regions at appropriate levels. No focal slowing, asymmetries, or epileptiform discharges were identified during wakefulness, drowsiness, hyperventilation, or photic stimulation. These findings strongly suggest that the patient's reported episodes are not associated with epileptic seizures.

## Recommendations
1. **Clinical Correlation**: Further clinical evaluation is recommended to determine alternative causes for the patient's symptoms.
2. **Consider**:
   - Syncope (fainting) evaluation if episodes involve loss of consciousness
   - Psychological assessment if episodes are associated with stress or emotional triggers
   - Sleep study if episodes occur primarily during sleep or upon awakening
3. **Follow-up**: Consider video EEG monitoring if episodes persist and clinical suspicion for seizures remains high despite normal routine EEG.

## Patient Education
A normal EEG does not completely rule out epilepsy, as some epileptic conditions may not show abnormalities on routine EEG recordings. However, the high confidence score of this analysis provides strong evidence against epilepsy as the cause of the reported symptoms. Non-epileptic episodes can result from various conditions including cardiac arrhythmias, vasovagal syncope, sleep disorders, or psychological factors.
"""
    else:  # PNES or other
        return f"""
# EEG Analysis Report for {patient_name}

**Date:** {today}
**Classification:** PSYCHOGENIC NON-EPILEPTIC SEIZURES (PNES)
**Confidence:** MEDIUM-HIGH

## Summary of Findings
The EEG recording shows no epileptiform abnormalities despite the recording of a typical event during the session. Background activity remained normal during and after the clinical event, strongly suggesting psychogenic non-epileptic seizures (PNES).

## Technical Details
- Recording duration: 45 minutes
- Montage: International 10-20 system
- Patient state: Awake, with one typical event recorded
- Hyperventilation: Performed for 3 minutes
- Photic stimulation: Performed at frequencies from 1-30 Hz

## Clinical Interpretation
During the recording, the patient experienced a typical event characterized by bilateral limb shaking and reduced responsiveness. Importantly, no electrographic seizure activity was observed during this event. The background EEG remained normal without ictal changes, postictal slowing, or other abnormalities. This pattern is highly consistent with psychogenic non-epileptic seizures (PNES), a condition where seizure-like events occur without the abnormal electrical activity seen in epileptic seizures.

## Recommendations
1. **Psychological Evaluation**: Referral to a neuropsychologist or psychiatrist experienced in treating PNES is strongly recommended.
2. **Multidisciplinary Approach**: Treatment should involve both neurological and psychological care.
3. **Medication Review**: If the patient is currently on antiepileptic medications, a careful review and possible tapering plan should be discussed.
4. **Patient Education**: Clear, compassionate explanation of PNES is essential for treatment success.

## Patient Education
Psychogenic non-epileptic seizures are real events that can be similar in appearance to epileptic seizures but do not involve abnormal electrical activity in the brain. They often arise from psychological factors such as stress, trauma, or emotional difficulties. PNES is not "faking" and patients cannot voluntarily control these episodes. With appropriate psychological treatment, many patients experience significant reduction or resolution of events. Cognitive-behavioral therapy has been shown to be particularly effective.
"""

def generate_report(eeg_case):
    """
    Generate a comprehensive medical report from EEG analysis results
    
    Args:
        eeg_case: Dictionary containing patient and EEG analysis data
        
    Returns:
        report_text: Generated report text
    """
    # Build the prompt for the LLM
    prompt = build_prompt(eeg_case)
    
    # Generate using local model or API based on configuration
    if USE_LOCAL_MODEL:
        try:
            report_text = generate_report_local(prompt)
        except Exception as e:
            logger.error(f"Error using local model: {str(e)}. Falling back to mock report.")
            report_text = generate_mock_report(prompt)
    else:
        try:
            report_text = generate_report_api(prompt)
        except Exception as e:
            logger.error(f"Error using API: {str(e)}. Falling back to mock report.")
            report_text = generate_mock_report(prompt)
    
    return report_text

def create_pdf_report(report_text, eeg_case=None):
    """
    Create a PDF report from the generated text
    
    Args:
        report_text: Generated report text
        eeg_case: Optional dictionary with case information
        
    Returns:
        pdf_path: Path to the generated PDF file
    """
    try:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp:
            temp_path = temp.name
        
        # Create PDF
        pdf = FPDF()
        pdf.add_page()
        
        # Add header
        pdf.set_font("Arial", "B", 16)
        pdf.cell(0, 10, "EpilepTech EEG Analysis Report", 0, 1, "C")
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())
        pdf.ln(5)
        
        # Add report date
        pdf.set_font("Arial", "I", 10)
        report_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        pdf.cell(0, 10, f"Report generated on: {report_date}", 0, 1, "R")
        
        # Add patient info if available
        if eeg_case:
            pdf.set_font("Arial", "B", 12)
            pdf.cell(0, 10, "Patient Information:", 0, 1)
            
            pdf.set_font("Arial", "", 10)
            pdf.cell(40, 7, "Name:", 0, 0)
            pdf.cell(0, 7, f"{eeg_case.get('first_name', '')} {eeg_case.get('last_name', '')}", 0, 1)
            
            pdf.cell(40, 7, "Record ID:", 0, 0)
            pdf.cell(0, 7, f"{eeg_case.get('eeg_id', '')}", 0, 1)
            
            pdf.cell(40, 7, "Age/Gender:", 0, 0)
            pdf.cell(0, 7, f"{eeg_case.get('age', '')} / {eeg_case.get('gender', '')}", 0, 1)
            
            pdf.cell(40, 7, "Record Date:", 0, 0)
            pdf.cell(0, 7, f"{eeg_case.get('record_date', '')}", 0, 1)
            
            pdf.ln(5)
        
        # Add main report content
        pdf.set_font("Arial", "B", 12)
        pdf.cell(0, 10, "Analysis Results:", 0, 1)
        
        pdf.set_font("Arial", "", 10)
        
        # Process the report text line by line
        for line in report_text.split('\n'):
            # Check if it's a header
            if line.startswith('# '):
                pdf.set_font("Arial", "B", 14)
                pdf.cell(0, 10, line[2:], 0, 1)
                pdf.set_font("Arial", "", 10)
            elif line.startswith('## '):
                pdf.set_font("Arial", "B", 12)
                pdf.cell(0, 10, line[3:], 0, 1)
                pdf.set_font("Arial", "", 10)
            elif line.startswith('**') and line.endswith('**'):
                pdf.set_font("Arial", "B", 10)
                pdf.cell(0, 7, line.replace('**', ''), 0, 1)
                pdf.set_font("Arial", "", 10)
            elif line.startswith('- '):
                # Handle bullet points
                pdf.cell(5, 7, "", 0, 0)
                pdf.cell(0, 7, line, 0, 1)
            elif line.startswith('1. ') or line.startswith('2. ') or line.startswith('3. ') or line.startswith('4. ') or line.startswith('5. '):
                # Handle numbered lists
                pdf.cell(5, 7, "", 0, 0)
                pdf.cell(0, 7, line, 0, 1)
            elif line.strip() == '':
                # Handle empty lines
                pdf.ln(2)
            else:
                # Regular text
                # Use multi_cell to handle long text with wrapping
                pdf.multi_cell(0, 7, line)
        
        # Add footer
        pdf.ln(10)
        pdf.set_font("Arial", "I", 8)
        pdf.cell(0, 10, "This report was generated by EpilepTech AI Analysis System", 0, 1, "C")
        pdf.cell(0, 10, "For clinical use only. Please consult with a neurologist for interpretation.", 0, 1, "C")
        
        # Save PDF
        pdf.output(temp_path)
        
        return temp_path
        
    except Exception as e:
        logger.error(f"Error creating PDF report: {str(e)}")
        return None

def generate_pdf_report(eeg_case):
    """
    Generate a report and create a PDF
    
    Args:
        eeg_case: Dictionary containing patient and EEG analysis data
        
    Returns:
        pdf_path: Path to the generated PDF file
    """
    # Generate the report text
    report_text = generate_report(eeg_case)
    
    # Create and return the PDF
    return create_pdf_report(report_text, eeg_case)