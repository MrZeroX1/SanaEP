import React, { useState } from "react";
import styled from "styled-components";
import { FaUpload, FaFile, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";
import { useEEGData } from "../context/EEGDataContext"; // Import the context hook

const UploadCase = () => {
  const { addEEGCase } = useEEGData(); // Use the context to add new cases
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  
  // Generate a default EEG ID
  const generateEEGID = () => {
    return `EEG-${Math.floor(1000 + Math.random() * 9000)}`;
  };
  
  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  
  const [patientInfo, setPatientInfo] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    notes: "",
    eegID: generateEEGID(),
    recordDate: today
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setUploadError(true);
      return;
    }

    setUploading(true);
    setUploadError(false);

    // Simulate upload delay
    setTimeout(() => {
      setUploading(false);
      setUploadComplete(true);
      
      // Create a new case entry for the EEG Analysis table
      const newCase = {
        id: patientInfo.eegID,
        patient: {
          firstName: patientInfo.firstName,
          lastName: patientInfo.lastName,
          age: parseInt(patientInfo.age),
          gender: patientInfo.gender
        },
        date: new Date(patientInfo.recordDate).toISOString(),
        status: "pending",
        notes: patientInfo.notes
      };

      // Add the new case to the shared context
      addEEGCase(newCase);
      
      // Display confirmation to user
      alert(`Case ${newCase.id} for ${patientInfo.firstName} ${patientInfo.lastName} has been added to the analysis queue.`);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setUploadComplete(false);
        setFiles([]);
        setPatientInfo({
          firstName: "",
          lastName: "",
          age: "",
          gender: "",
          notes: "",
          eegID: generateEEGID(),
          recordDate: today
        });
      }, 3000);
    }, 2000);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <UploadContainer>
      <UploadHeader>
        <h1>Upload New EEG Case</h1>
        <p>Upload EEG files for AI-powered analysis and diagnosis assistance</p>
      </UploadHeader>

      <UploadForm onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>Case Information</SectionTitle>
          <InputGrid>
            <InputGroup>
              <Label htmlFor="eegID">EEG ID</Label>
              <Input 
                type="text" 
                id="eegID" 
                name="eegID"
                value={patientInfo.eegID}
                onChange={handleInputChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="recordDate">Record Date</Label>
              <Input 
                type="date" 
                id="recordDate" 
                name="recordDate"
                value={patientInfo.recordDate}
                onChange={handleInputChange}
                required
              />
            </InputGroup>
          </InputGrid>
        </FormSection>

        <FormSection>
          <SectionTitle>Patient Information</SectionTitle>
          <InputGrid>
            <InputGroup>
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                type="text" 
                id="firstName" 
                name="firstName"
                value={patientInfo.firstName}
                onChange={handleInputChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                type="text" 
                id="lastName" 
                name="lastName"
                value={patientInfo.lastName}
                onChange={handleInputChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="age">Age</Label>
              <Input 
                type="number" 
                id="age" 
                name="age"
                value={patientInfo.age}
                onChange={handleInputChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="gender">Gender</Label>
              <Select 
                id="gender" 
                name="gender"
                value={patientInfo.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </InputGroup>
          </InputGrid>
          <InputGroup style={{ marginTop: "20px" }}>
            <Label htmlFor="notes">Clinical Notes (optional)</Label>
            <TextArea 
              id="notes" 
              name="notes"
              value={patientInfo.notes}
              onChange={handleInputChange}
              placeholder="Enter any relevant medical history or symptoms..."
              rows={4}
            />
          </InputGroup>
        </FormSection>

        <FormSection>
          <SectionTitle>EEG Files</SectionTitle>
          <FileUploadArea>
            <FileInputLabel htmlFor="eegFiles">
              <FaUpload size={30} />
              <span>Drop EEG files here or click to browse</span>
              <SubText>Supports .edf, .bdf, and compressed EEG formats</SubText>
              <FileInput 
                type="file" 
                id="eegFiles" 
                multiple 
                onChange={handleFileChange}
                accept=".edf,.bdf,.zip,.gz"
              />
            </FileInputLabel>
          </FileUploadArea>

          {files.length > 0 && (
            <FileList>
              <FileListTitle>Selected Files ({files.length})</FileListTitle>
              {files.map((file, index) => (
                <FileItem key={index}>
                  <FileIcon><FaFile /></FileIcon>
                  <FileName>{file.name}</FileName>
                  <FileSize>{formatFileSize(file.size)}</FileSize>
                  <RemoveButton onClick={() => removeFile(index)}>
                    <FaTimesCircle />
                  </RemoveButton>
                </FileItem>
              ))}
            </FileList>
          )}

          {uploadError && (
            <ErrorMessage>
              <FaExclamationTriangle />
              Please select at least one EEG file to upload
            </ErrorMessage>
          )}
        </FormSection>

        <SubmitButtonContainer>
          <SubmitButton type="submit" disabled={uploading || uploadComplete}>
            {uploading ? "Uploading..." : uploadComplete ? "Upload Complete" : "Upload Files"}
            {uploadComplete && <FaCheckCircle style={{ marginLeft: '8px' }} />}
          </SubmitButton>
        </SubmitButtonContainer>
      </UploadForm>
    </UploadContainer>
  );
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

// Styled Components
const UploadContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  padding: 30px;
  margin-bottom: 30px;
`;

const UploadHeader = styled.div`
  margin-bottom: 30px;
  
  h1 {
    font-size: 24px;
    color: #2A3B75;
    margin: 0 0 10px 0;
  }
  
  p {
    color: #7B8794;
    margin: 0;
  }
`;

const UploadForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const FormSection = styled.div`
  border: 1px solid #E0E6F5;
  border-radius: 10px;
  padding: 25px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  color: #2A3B75;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #E0E6F5;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 6px;
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #E0E6F5;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #7091E6;
    box-shadow: 0 0 0 2px rgba(112, 145, 230, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #E0E6F5;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #7091E6;
    box-shadow: 0 0 0 2px rgba(112, 145, 230, 0.2);
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #E0E6F5;
  border-radius: 6px;
  font-size: 14px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  
  &:focus {
    outline: none;
    border-color: #7091E6;
    box-shadow: 0 0 0 2px rgba(112, 145, 230, 0.2);
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed #E0E6F5;
  border-radius: 10px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #7091E6;
    background-color: rgba(112, 145, 230, 0.05);
  }
`;

const FileInputLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #7B8794;
  cursor: pointer;
  height: 100%;
  text-align: center;
  
  svg {
    color: #3D52A0;
    margin-bottom: 15px;
  }
  
  span {
    font-size: 16px;
    margin-bottom: 5px;
  }
`;

const SubText = styled.p`
  font-size: 13px;
  opacity: 0.7;
  margin: 5px 0 0 0;
`;

const FileInput = styled.input`
  display: none;
`;

const FileList = styled.div`
  margin-top: 20px;
`;

const FileListTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2A3B75;
  margin-bottom: 10px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #F6F8FD;
  border-radius: 6px;
  margin-bottom: 10px;
`;

const FileIcon = styled.div`
  color: #3D52A0;
  margin-right: 12px;
`;

const FileName = styled.div`
  flex-grow: 1;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileSize = styled.div`
  font-size: 12px;
  color: #7B8794;
  margin: 0 12px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #FF6B6B;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    color: #e74c3c;
    transform: scale(1.1);
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  color: #FF6B6B;
  margin-top: 15px;
  font-size: 14px;
  
  svg {
    margin-right: 8px;
  }
`;

const SubmitButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3D52A0;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 180px;
  
  &:hover:not(:disabled) {
    background: #2A3B75;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(42, 59, 117, 0.2);
  }
  
  &:disabled {
    background: ${props => props.uploadComplete ? '#42BA96' : '#A0A9B8'};
    cursor: ${props => props.uploadComplete ? 'default' : 'not-allowed'};
  }
`;

export default UploadCase;