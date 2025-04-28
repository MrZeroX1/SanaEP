import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { 
  FaBars, 
  FaBrain, 
  FaCalendarAlt, 
  FaUpload, 
  FaSearch,
  FaBell,
  FaSignOutAlt,
  FaFileMedical,
  FaRobot
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = ({ title, children, isDoctor }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Add this to track current route
  const { doctorLogout, patientLogout } = useAuth();
  
  // Determine active route
  const isActive = (path) => {
    return location.pathname.includes(path);
  };
  
  // Handle sign out
  const handleSignOut = () => {
    if (isDoctor) {
      doctorLogout();
      navigate("/doctor-login");
    } else {
      patientLogout();
      navigate("/patient-login");
    }
  };
  
  return (
    <Container>
      {/* Sidebar */}
      <Sidebar collapsed={isCollapsed}>
        <SidebarHeader onClick={() => setIsCollapsed(!isCollapsed)}>
          <FaBrain size={24} />
          {!isCollapsed && <LogoText>EpilepTech</LogoText>}
        </SidebarHeader>
        
        <UserInfo collapsed={isCollapsed}>
          <Avatar src="https://via.placeholder.com/50" alt={isDoctor ? "Doctor" : "Patient"} />
          {!isCollapsed && (
            <UserDetails>
              {isDoctor ? (
                <>
                  <UserName>Dr. Sana Araj</UserName>
                  <UserRole>Neurologist</UserRole>
                </>
              ) : (
                <>
                  <UserName>Mark John</UserName>
                  <UserRole>Patient</UserRole>
                </>
              )}
            </UserDetails>
          )}
        </UserInfo>
        
        <NavLinks>
          {isDoctor ? (
            <>
              <StyledLink 
                to="/doctor/dashboard" 
                collapsed={isCollapsed}
                className={isActive("/doctor/dashboard") ? "active" : ""}
              >
                <FaBrain size={20} />
                {!isCollapsed && "Dashboard"}
              </StyledLink>
              <StyledLink 
                to="/doctor/analysis" 
                collapsed={isCollapsed}
                className={isActive("/doctor/analysis") ? "active" : ""}
              >
                <FaBrain size={20} />
                {!isCollapsed && "EEG Analysis"}
              </StyledLink>
              <StyledLink 
                to="/doctor/upload" 
                collapsed={isCollapsed}
                className={isActive("/doctor/upload") ? "active" : ""}
              >
                <FaUpload size={20} />
                {!isCollapsed && "Upload New Case"}
              </StyledLink>
            </>
          ) : (
            <>
              <StyledLink 
                to="/patient/dashboard" 
                collapsed={isCollapsed}
                className={isActive("/patient/dashboard") ? "active" : ""}
              >
                <FaBrain size={20} />
                {!isCollapsed && "Dashboard"}
              </StyledLink>
              <StyledLink 
                to="/patient/eeg-reports" 
                collapsed={isCollapsed}
                className={isActive("/patient/eeg-reports") ? "active" : ""}
              >
                <FaFileMedical size={20} />
                {!isCollapsed && "EEG Reports"}
              </StyledLink>
              <StyledLink 
                to="/patient/appointments" 
                collapsed={isCollapsed}
                className={isActive("/patient/appointments") ? "active" : ""}
              >
                <FaCalendarAlt size={20} />
                {!isCollapsed && "Appointments"}
              </StyledLink>
              <StyledLink 
                to="/patient/chatbot" 
                collapsed={isCollapsed}
                className={isActive("/patient/chatbot") ? "active" : ""}
              >
                <FaRobot size={20} />
                {!isCollapsed && "AI Assistant"}
              </StyledLink>
            </>
          )}
        </NavLinks>
        
        <BottomLinks>
          <SignOutButton onClick={handleSignOut} collapsed={isCollapsed}>
            <FaSignOutAlt size={20} />
            {!isCollapsed && "Sign Out"}
          </SignOutButton>
        </BottomLinks>
      </Sidebar>

      {/* Main Content */}
      <Content>
        <TopBar>
          <ToggleButton onClick={() => setIsCollapsed(!isCollapsed)}>
            <FaBars />
          </ToggleButton>
          
          <PageTitle>{title}</PageTitle>
          
          <TopBarControls>
            <SearchContainer>
              <SearchIcon><FaSearch /></SearchIcon>
              <SearchInput 
                placeholder={isDoctor ? "Search patients, reports..." : "Search reports, appointments..."} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>
            
            <NotificationBell>
              <FaBell />
              {notifications > 0 && <NotificationBadge>{notifications}</NotificationBadge>}
            </NotificationBell>
          </TopBarControls>
        </TopBar>
        
        <MainContentArea>
          {children}
        </MainContentArea>
      </Content>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
  font-family: 'Poppins', sans-serif;
`;

const Sidebar = styled.div`
  width: ${({ collapsed }) => (collapsed ? "80px" : "250px")};
  background: linear-gradient(180deg, #3D52A0 0%, #2A3B75 100%);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  transition: width 0.3s ease-in-out;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  height: 100vh;
  overflow-y: auto; /* Allow scrolling if needed */
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px;
  cursor: pointer;
  margin-bottom: 30px;
  
  svg {
    margin-right: 10px;
    color: #7091E6;
  }
`;

const LogoText = styled.span`
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 30px;
  justify-content: ${({ collapsed }) => (collapsed ? "center" : "flex-start")};
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #7091E6;
`;

const UserDetails = styled.div`
  margin-left: 10px;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const UserRole = styled.div`
  font-size: 12px;
  color: #B8C7FA;
`;

const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const BottomLinks = styled.div`
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  text-decoration: none;
  color: white;
  font-size: 16px;
  transition: 0.2s ease;
  margin: 2px 0;
  justify-content: ${({ collapsed }) => (collapsed ? "center" : "flex-start")};
  
  &:hover, &.active {
    background: rgba(112, 145, 230, 0.2);
    color: #7091E6;
    border-left: 4px solid #7091E6;
  }
  
  svg {
    margin-right: ${({ collapsed }) => (collapsed ? "0" : "10px")};
    min-width: 20px;
  }
`;

const SignOutButton = styled.button`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: none;
  border: none;
  text-decoration: none;
  color: white;
  font-size: 16px;
  transition: 0.2s ease;
  margin: 2px 0;
  cursor: pointer;
  width: 100%;
  text-align: left;
  justify-content: ${({ collapsed }) => (collapsed ? "center" : "flex-start")};
  
  &:hover {
    background: rgba(112, 145, 230, 0.2);
    color: #7091E6;
    border-left: 4px solid #7091E6;
  }
  
  svg {
    margin-right: ${({ collapsed }) => (collapsed ? "0" : "10px")};
    min-width: 20px;
  }
`;

const Content = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #F6F8FD;
  overflow-y: auto;
`;

const TopBar = styled.div`
  height: 70px;
  background: white;
  display: flex;
  align-items: center;
  padding: 0 30px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 5;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #3D52A0;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  margin-right: 20px;
  
  &:hover {
    color: #7091E6;
  }
`;

const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #2A3B75;
  margin: 0;
`;

const TopBarControls = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 20px;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 15px 10px 40px;
  border-radius: 20px;
  border: 1px solid #E0E6F5;
  background: #F6F8FD;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #7091E6;
    box-shadow: 0 0 0 2px rgba(112, 145, 230, 0.2);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 15px;
  color: #7091E6;
`;

const NotificationBell = styled.div`
  position: relative;
  cursor: pointer;
  font-size: 18px;
  color: #3D52A0;
  
  &:hover {
    color: #7091E6;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #FF6B6B;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MainContentArea = styled.div`
  padding: 30px;
  flex-grow: 1;
`;

export default DashboardLayout;