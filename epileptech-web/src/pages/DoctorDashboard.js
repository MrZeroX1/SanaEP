import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { 
  FaUpload, 
  FaBrain
} from "react-icons/fa";

// Define these icons since they might not be imported
const FaChartLine = FaBrain; // Using FaBrain as a substitute for analytics icon

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingAnalysis: 12,
    completedToday: 8
  });
  
  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeMessage>
          <h1>Welcome back, Dr. Araj</h1>
          <p>Here's an overview of your EEG analysis activity</p>
        </WelcomeMessage>
        <DateDisplay>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</DateDisplay>
      </WelcomeSection>
      
      <StatsContainer>
        <StatCard>
          <StatIcon className="pending">
            <FaUpload size={24} />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats.pendingAnalysis}</StatValue>
            <StatLabel>Pending Analyses</StatLabel>
          </StatInfo>
        </StatCard>
        
        <StatCard>
          <StatIcon className="completed">
            <FaChartLine size={24} />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats.completedToday}</StatValue>
            <StatLabel>Completed Today</StatLabel>
          </StatInfo>
        </StatCard>
      </StatsContainer>
      
      <SectionTitle>Quick Actions</SectionTitle>
      
      <CardContainer>
        <ActionCard onClick={() => navigate("/doctor/upload")}>
          <CardIcon className="upload">
            <FaUpload size={32} />
          </CardIcon>
          <CardTitle>Upload New Case</CardTitle>
          <CardDescription>
            Submit EEG files for AI analysis and get instant diagnostic assistance
          </CardDescription>
          <CardButton>Upload Files</CardButton>
        </ActionCard>
        
        <ActionCard onClick={() => navigate("/doctor/analysis")}>
          <CardIcon className="analysis">
            <FaChartLine size={32} />
          </CardIcon>
          <CardTitle>EEG Analysis</CardTitle>
          <CardDescription>
            Review AI-generated EEG analysis reports with precision insights
          </CardDescription>
          <CardButton>View Reports</CardButton>
        </ActionCard>
      </CardContainer>
      
      <SectionDivider />
      
      <SectionTitle>Recent Activity</SectionTitle>
      <RecentActivityContainer>
        <ActivityItem>
          <ActivityTime>10:30 AM</ActivityTime>
          <ActivityContent>
            <ActivityTitle>AI Analysis Complete</ActivityTitle>
            <ActivityDescription>EEG analysis for patient #2845 (John Davis) is ready for review</ActivityDescription>
          </ActivityContent>
          <ActivityAction>Review</ActivityAction>
        </ActivityItem>
        
        <ActivityItem>
          <ActivityTime>09:15 AM</ActivityTime>
          <ActivityContent>
            <ActivityTitle>New Case Uploaded</ActivityTitle>
            <ActivityDescription>New EEG data for patient #3102 (Emma Wilson) has been uploaded</ActivityDescription>
          </ActivityContent>
          <ActivityAction>Process</ActivityAction>
        </ActivityItem>
      </RecentActivityContainer>
    </DashboardContainer>
  );
};

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const WelcomeSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const WelcomeMessage = styled.div`
  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #2A3B75;
    margin: 0;
  }
  
  p {
    color: #7B8794;
    margin: 5px 0 0 0;
  }
`;

const DateDisplay = styled.div`
  font-size: 14px;
  color: #7B8794;
  background: white;
  padding: 8px 15px;
  border-radius: 20px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05);
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  
  &.pending {
    background: rgba(112, 145, 230, 0.1);
    color: #3D52A0;
  }
  
  &.completed {
    background: rgba(66, 186, 150, 0.1);
    color: #42BA96;
  }
`;

const StatInfo = styled.div``;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #2A3B75;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #7B8794;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #2A3B75;
  margin: 0 0 15px 0;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const ActionCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CardIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  
  &.upload {
    background: rgba(112, 145, 230, 0.1);
    color: #3D52A0;
  }
  
  &.analysis {
    background: rgba(66, 186, 150, 0.1);
    color: #42BA96;
  }
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2A3B75;
  margin: 0 0 10px 0;
`;

const CardDescription = styled.p`
  color: #7B8794;
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

const CardButton = styled.button`
  background: #3D52A0;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-top: auto;
  
  &:hover {
    background: #2A3B75;
  }
`;

const SectionDivider = styled.hr`
  border: none;
  height: 1px;
  background: #E0E6F5;
  margin: 10px 0;
`;

const RecentActivityContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 25px;
  border-bottom: 1px solid #E0E6F5;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #F6F8FD;
  }
`;

const ActivityTime = styled.div`
  min-width: 80px;
  font-size: 14px;
  color: #7B8794;
`;

const ActivityContent = styled.div`
  flex-grow: 1;
  margin: 0 15px;
`;

const ActivityTitle = styled.div`
  font-weight: 600;
  color: #2A3B75;
  margin-bottom: 3px;
`;

const ActivityDescription = styled.div`
  font-size: 14px;
  color: #7B8794;
`;

const ActivityAction = styled.button`
  background: #F0F4FD;
  color: #3D52A0;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #E0E6F5;
  }
`;

export default DoctorDashboard;