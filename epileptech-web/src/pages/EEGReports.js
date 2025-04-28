import React, { useState } from "react";
import styled from "styled-components";
import { FaDownload, FaSearch, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EEGReports = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Mock EEG reports data
  const eegReports = [
    { 
      id: "EEG-2845", 
      date: "March 1, 2025", 
      doctor: "Dr. Sarah Johnson",
      status: "Completed",
      result: "Non-Epileptic",
      confidence: 92
    },
    { 
      id: "EEG-2562", 
      date: "January 15, 2025", 
      doctor: "Dr. Sarah Johnson",
      status: "Completed",
      result: "Non-Epileptic",
      confidence: 88
    },
    { 
      id: "EEG-2134", 
      date: "October 12, 2024", 
      doctor: "Dr. Michael Lee",
      status: "Completed",
      result: "Epileptic",
      confidence: 95
    }
  ];

  // Filter and search reports
  const filteredReports = eegReports.filter(report => {
    // Filter by result type
    if (filter !== "all" && report.result.toLowerCase() !== filter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        report.id.toLowerCase().includes(searchLower) ||
        report.doctor.toLowerCase().includes(searchLower) ||
        report.date.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Handle view report
  const handleViewReport = (reportId) => {
    navigate(`/patient/eeg-report/${reportId}`);
  };

  return (
    <Container>
      <Header>
        <h1>Your EEG Reports</h1>
        <p>View and manage your past EEG analysis reports</p>
      </Header>

      <SearchFilterBar>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Search reports..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        <FilterContainer>
          <FilterIcon>
            <FaFilter />
          </FilterIcon>
          <FilterSelect 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Results</option>
            <option value="epileptic">Epileptic</option>
            <option value="non-epileptic">Non-Epileptic</option>
          </FilterSelect>
        </FilterContainer>
      </SearchFilterBar>

      <ReportsContainer>
        {filteredReports.length > 0 ? (
          filteredReports.map(report => (
            <ReportCard key={report.id}>
              <ReportHeader>
                <ReportID>{report.id}</ReportID>
                <ReportDate>{report.date}</ReportDate>
              </ReportHeader>
              <ReportDoctor>{report.doctor}</ReportDoctor>
              <ResultContainer>
                <ResultBadge result={report.result}>
                  {report.result}
                </ResultBadge>
                <ConfidenceIndicator>
                  <ConfidenceLabel>{report.confidence}% confidence</ConfidenceLabel>
                  <ConfidenceBar>
                    <ConfidenceFill 
                      confidence={report.confidence} 
                      result={report.result}
                    />
                  </ConfidenceBar>
                </ConfidenceIndicator>
              </ResultContainer>
              <ReportActions>
                <ViewButton onClick={() => handleViewReport(report.id)}>
                  View Details
                </ViewButton>
                <DownloadButton>
                  <FaDownload />
                </DownloadButton>
              </ReportActions>
            </ReportCard>
          ))
        ) : (
          <EmptyState>
            <h3>No reports found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </EmptyState>
        )}
      </ReportsContainer>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  margin-bottom: 8px;
  
  h1 {
    font-size: 24px;
    color: #2A3B75;
    margin: 0 0 8px 0;
  }
  
  p {
    color: #7B8794;
    margin: 0;
  }
`;

const SearchFilterBar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #7B8794;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 42px;
  border-radius: 8px;
  border: 1px solid #E0E6F5;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3D52A0;
    box-shadow: 0 0 0 2px rgba(61, 82, 160, 0.1);
  }
`;

const FilterContainer = styled.div`
  position: relative;
  width: 180px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #7B8794;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 12px 12px 12px 42px;
  border-radius: 8px;
  border: 1px solid #E0E6F5;
  font-size: 14px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237B8794' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  
  &:focus {
    outline: none;
    border-color: #3D52A0;
    box-shadow: 0 0 0 2px rgba(61, 82, 160, 0.1);
  }
`;

const ReportsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

const ReportCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.08);
  }
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ReportID = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #2A3B75;
`;

const ReportDate = styled.div`
  font-size: 14px;
  color: #7B8794;
`;

const ReportDoctor = styled.div`
  font-size: 14px;
  color: #2c3e50;
  margin-bottom: 16px;
`;

const ResultContainer = styled.div`
  margin-bottom: 20px;
`;

const ResultBadge = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
  
  ${props => {
    if (props.result === "Epileptic") {
      return `
        background-color: rgba(231, 76, 60, 0.1);
        color: #E74C3C;
      `;
    } else if (props.result === "Non-Epileptic") {
      return `
        background-color: rgba(46, 204, 113, 0.1);
        color: #2ECC71;
      `;
    } else {
      return `
        background-color: rgba(241, 196, 15, 0.1);
        color: #F1C40F;
      `;
    }
  }}
`;

const ConfidenceIndicator = styled.div``;

const ConfidenceLabel = styled.div`
  font-size: 12px;
  color: #7B8794;
  margin-bottom: 4px;
`;

const ConfidenceBar = styled.div`
  height: 4px;
  background: #f1f2f6;
  border-radius: 2px;
  overflow: hidden;
`;

const ConfidenceFill = styled.div`
  height: 100%;
  width: ${props => props.confidence}%;
  border-radius: 2px;
  
  ${props => {
    if (props.result === "Epileptic") {
      return `background-color: #E74C3C;`;
    } else if (props.result === "Non-Epileptic") {
      return `background-color: #2ECC71;`;
    } else {
      return `background-color: #F1C40F;`;
    }
  }}
`;

const ReportActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ViewButton = styled.button`
  flex: 1;
  padding: 10px;
  background: #3D52A0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #2A3B75;
  }
`;

const DownloadButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F0F4FD;
  color: #3D52A0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #E0E6F5;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  background: #f8f9fa;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  
  h3 {
    margin: 0 0 8px 0;
    color: #2A3B75;
  }
  
  p {
    margin: 0;
    color: #7B8794;
  }
`;

export default EEGReports;