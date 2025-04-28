import React, { useState } from "react";
import styled from "styled-components";

const EEGUploader = () => {
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (file) {
      alert("EEG file uploaded successfully!");
      setFile(null); // Clear the file after upload
    }
  };

  return (
    <UploadContainer>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <UploadButton onClick={handleUpload}>Upload EEG Data</UploadButton>
    </UploadContainer>
  );
};

// Styled Components
const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const UploadButton = styled.button`
  padding: 10px;
  background: #3D52A0;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s ease;

  &:hover {
    background: #7091E6;
  }
`;

export default EEGUploader;