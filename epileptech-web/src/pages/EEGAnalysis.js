import React, { useState } from "react";
import styled from "styled-components";
import { FaBrain, FaDownload, FaSearch, FaFilter, FaTrashAlt } from "react-icons/fa";
import { useEEGData } from "../context/EEGDataContext"; // Import the context hook

const EEGAnalysis = () => {
  const { eegData, deleteEEGCase } = useEEGData(); // Use the shared context
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: "all",
    result: "all"
  });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter data based on active tab, search term, and filters
  const filteredData = eegData.filter(item => {
    // Filter by tab
    if (activeTab === "pending" && item.status !== "pending") return false;
    if (activeTab === "completed" && item.status !== "completed") return false;
    
    // Filter by search term
    const searchLower = searchTerm.toLowerCase();
    const patientNameLower = `${item.patient.firstName} ${item.patient.lastName}`.toLowerCase();
    const idLower = item.id.toLowerCase();
    
    if (searchTerm && !patientNameLower.includes(searchLower) && !idLower.includes(searchLower)) {
      return false;
    }
    
    // Filter by date range
    if (filters.dateRange !== "all") {
      const now = new Date();
      const itemDate = new Date(item.date);
      const daysDiff = Math.floor((now - itemDate) / (1000 * 60 * 60 * 24));
      
      if (filters.dateRange === "today" && daysDiff > 0) return false;
      if (filters.dateRange === "week" && daysDiff > 7) return false;
      if (filters.dateRange === "month" && daysDiff > 30) return false;
    }
    
    // Filter by result
    if (filters.result !== "all" && item.result !== filters.result) return false;
    
    return true;
  });

  // Handle view report
  const handleViewReport = (id) => {
    // For now just log the action
    console.log(`Viewing report ${id}`);
    // In the future, you can add navigation here:
    // navigate(`/doctor/report/${id}`);
    alert(`Viewing report ${id} - Feature coming soon`);
  };

  // Handle download report
  const handleDownloadReport = (id) => {
    // For now just log the action
    console.log(`Downloading report ${id}`);
    // In the future, you can implement actual download functionality
    alert(`Downloading report ${id} - Feature coming soon`);
  };

  // Handle delete report
  const handleDeleteReport = (id) => {
    if (window.confirm(`Are you sure you want to delete report ${id}?`)) {
      // Delete the report using the context function
      deleteEEGCase(id);
      console.log(`Deleted report ${id}`);
    }
  };

  return (
    <AnalysisContainer>
      <AnalysisHeader>
        <h1>EEG Analysis Reports</h1>
        <p>Review and manage AI-generated EEG analysis for your patients</p>
      </AnalysisHeader>

      <ControlsContainer>
        <SearchFilterRow>
          <SearchContainer>
            <SearchIcon><FaSearch /></SearchIcon>
            <SearchInput 
              placeholder="Search by patient name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          
          <FilterButtons>
            <FilterButton onClick={() => setShowFilters(!showFilters)}>
              <FaFilter />
              <span>Filters</span>
            </FilterButton>
          </FilterButtons>
        </SearchFilterRow>
        
        {showFilters && (
          <FiltersContainer>
            <FilterGroup>
              <FilterLabel>Date Range</FilterLabel>
              <FilterSelect 
                name="dateRange" 
                value={filters.dateRange}
                onChange={handleFilterChange}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </FilterSelect>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Result</FilterLabel>
              <FilterSelect 
                name="result" 
                value={filters.result}
                onChange={handleFilterChange}
              >
                <option value="all">All Results</option>
                <option value="epileptic">Epileptic</option>
                <option value="non-epileptic">Non-Epileptic</option>
                <option value="Psychogenic">Psychogenic</option>
              </FilterSelect>
            </FilterGroup>
            
            <ApplyFilterButton onClick={() => setShowFilters(false)}>
              Apply Filters
            </ApplyFilterButton>
          </FiltersContainer>
        )}
        
        <TabsContainer>
          <Tab 
            active={activeTab === "all"} 
            onClick={() => setActiveTab("all")}
          >
            All Reports
          </Tab>
          <Tab 
            active={activeTab === "pending"} 
            onClick={() => setActiveTab("pending")}
          >
            Pending
            <TabBadge>{eegData.filter(item => item.status === "pending").length}</TabBadge>
          </Tab>
          <Tab 
            active={activeTab === "completed"} 
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </Tab>
        </TabsContainer>
      </ControlsContainer>

      <AnalysisTable>
        <TableHeader>
          <TableHeaderCell width="20%">Patient</TableHeaderCell>
          <TableHeaderCell width="15%">Date</TableHeaderCell>
          <TableHeaderCell width="10%">ID</TableHeaderCell>
          <TableHeaderCell width="15%">Status</TableHeaderCell>
          <TableHeaderCell width="15%">Result</TableHeaderCell>
          <TableHeaderCell width="25%">Actions</TableHeaderCell>
        </TableHeader>

        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <TableRow key={index}>
                <TableCell width="20%">
                  <PatientInfo>
                    <PatientName>{item.patient.firstName} {item.patient.lastName}</PatientName>
                    <PatientDetails>{item.patient.age} y/o, {item.patient.gender}</PatientDetails>
                  </PatientInfo>
                </TableCell>
                <TableCell width="15%">{formatDate(item.date)}</TableCell>
                <TableCell width="10%">{item.id}</TableCell>
                <TableCell width="15%">
                  <StatusBadge status={item.status}>
                    {item.status === "pending" ? "Pending" : "Completed"}
                  </StatusBadge>
                </TableCell>
                <TableCell width="15%">
                  {item.status === "completed" ? (
                    <ResultBadge result={item.result}>
                      {capitalizeFirst(item.result)}
                      {item.confidence && (
                        <ConfidenceLabel>
                          {Math.round(item.confidence * 100)}% confidence
                        </ConfidenceLabel>
                      )}
                    </ResultBadge>
                  ) : (
                    <PendingLabel>Processing...</PendingLabel>
                  )}
                </TableCell>
                <TableCell width="25%">
                  <ActionButtons>
                    <ActionButton 
                      primary 
                      disabled={item.status === "pending"}
                      onClick={() => handleViewReport(item.id)}
                    >
                      View Report
                    </ActionButton>
                    <ActionButton 
                      disabled={item.status === "pending"}
                      onClick={() => handleDownloadReport(item.id)}
                    >
                      <FaDownload size={14} />
                    </ActionButton>
                    <ActionButton 
                      danger
                      onClick={() => handleDeleteReport(item.id)}
                    >
                      <FaTrashAlt size={14} />
                    </ActionButton>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <EmptyState>
              <FaBrain size={40} />
              <EmptyStateText>No analysis reports match your filters</EmptyStateText>
              <EmptyStateSubtext>Try adjusting your search or filters</EmptyStateSubtext>
            </EmptyState>
          )}
        </TableBody>
      </AnalysisTable>
      
      {filteredData.length > 0 && (
        <TableFooter>
          <TableInfo>Showing {filteredData.length} of {eegData.length} reports</TableInfo>
        </TableFooter>
      )}
    </AnalysisContainer>
  );
};

// Helper Functions
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Styled Components
const AnalysisContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  padding: 30px;
  margin-bottom: 30px;
`;

const AnalysisHeader = styled.div`
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

const ControlsContainer = styled.div`
  margin-bottom: 20px;
`;

const SearchFilterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 350px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #7B8794;
  display: flex;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 10px 10px 40px;
  border: 1px solid #E0E6F5;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #7091E6;
    box-shadow: 0 0 0 2px rgba(112, 145, 230, 0.2);
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 15px;
  background: #F6F8FD;
  border: 1px solid #E0E6F5;
  border-radius: 8px;
  font-size: 14px;
  color: #2A3B75;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #E0E6F5;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: flex-end;
  background: #F6F8FD;
  border: 1px solid #E0E6F5;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 160px;
`;

const FilterLabel = styled.label`
  font-size: 12px;
  margin-bottom: 5px;
  color: #7B8794;
`;

const FilterSelect = styled.select`
  padding: 8px 10px;
  background: white;
  border: 1px solid #E0E6F5;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #7091E6;
  }
`;

const ApplyFilterButton = styled.button`
  padding: 8px 15px;
  background: #3D52A0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
  align-self: flex-end;
  
  &:hover {
    background: #2A3B75;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #E0E6F5;
  margin-bottom: 20px;
`;

const Tab = styled.div`
  padding: 12px 20px;
  margin-right: 10px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.active ? '#3D52A0' : '#7B8794'};
  border-bottom: 2px solid ${props => props.active ? '#3D52A0' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #3D52A0;
  }
`;

const TabBadge = styled.span`
  background: #3D52A0;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  margin-left: 8px;
`;

const AnalysisTable = styled.div`
  border: 1px solid #E0E6F5;
  border-radius: 8px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: flex;
  background: #F6F8FD;
  padding: 15px 20px;
  font-weight: 600;
  color: #2A3B75;
  font-size: 14px;
`;

const TableHeaderCell = styled.div`
  width: ${props => props.width || 'auto'};
`;

const TableBody = styled.div`
  max-height: 500px;
  overflow-y: auto;
`;

const TableRow = styled.div`
  display: flex;
  padding: 15px 20px;
  border-bottom: 1px solid #E0E6F5;
  transition: background 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #F6F8FD;
  }
`;

const TableCell = styled.div`
  width: ${props => props.width || 'auto'};
  display: flex;
  align-items: center;
  color: #333;
  font-size: 14px;
`;

const PatientInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PatientName = styled.div`
  font-weight: 500;
  color: #2A3B75;
`;

const PatientDetails = styled.div`
  font-size: 12px;
  color: #7B8794;
  margin-top: 3px;
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  
  ${props => props.status === "pending" ? `
    background-color: rgba(247, 185, 85, 0.15);
    color: #F7B955;
  ` : `
    background-color: rgba(66, 186, 150, 0.15);
    color: #42BA96;
  `}
`;

const ResultBadge = styled.div`
  display: flex;
  flex-direction: column;
  
  ${props => {
    if (props.result === "epileptic") {
      return `color: #E74C3C;`;
    } else if (props.result === "non-epileptic") {
      return `color: #42BA96;`;
    } else if (props.result === "psychogenic") {
      return `color: #F7B955;`;
    } else {
      return `color: #7B8794;`;
    }
  }}
  
  font-weight: 500;
`;

const ConfidenceLabel = styled.span`
  font-size: 11px;
  color: #7B8794;
  font-weight: normal;
  margin-top: 3px;
`;

const PendingLabel = styled.span`
  color: #7B8794;
  font-style: italic;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: ${props => props.primary ? '6px 12px' : '6px'};
  background: ${props => {
    if (props.primary) return '#3D52A0';
    if (props.danger) return '#fff0f0';
    return 'white';
  }};
  color: ${props => {
    if (props.primary) return 'white';
    if (props.danger) return '#E74C3C';
    return '#3D52A0';
  }};
  border: 1px solid ${props => {
    if (props.primary) return 'transparent';
    if (props.danger) return '#ffcdd2';
    return '#E0E6F5';
  }};
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover:not(:disabled) {
    background: ${props => {
      if (props.primary) return '#2A3B75';
      if (props.danger) return '#ffebee';
      return '#F6F8FD';
    }};
    ${props => props.danger && 'color: #c0392b;'}
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #7B8794;
  
  svg {
    color: #E0E6F5;
    margin-bottom: 20px;
  }
`;

const EmptyStateText = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 5px;
`;

const EmptyStateSubtext = styled.div`
  font-size: 14px;
`;

const TableFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  margin-top: 15px;
`;

const TableInfo = styled.div`
  font-size: 13px;
  color: #7B8794;
`;

export default EEGAnalysis;