import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardLayout from "./components/DashboardLayout"; // Make sure this import is correct
import LandingPage from "./pages/LandingPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import UploadCase from "./pages/UploadCase";
import EEGAnalysis from "./pages/EEGAnalysis";
import PatientDashboard from "./pages/PatientDashboard";
import EEGReports from "./pages/EEGReports";
import PatientAppointments from "./pages/Appointments";
import AIAssistant from "./pages/AIAssistant";
import ServicesPage from "./pages/ServicesPage";
import AIPage from "./pages/AIPage";
import ResourcesPage from "./pages/ResourcesPage";
import ContactPage from "./pages/ContactPage";
import DoctorLogin from "./pages/DoctorLogin";
import PatientLogin from "./pages/PatientLogin";
import { AuthProvider } from "./context/AuthContext";
import { EEGDataProvider } from "./context/EEGDataContext"; // Import the EEGDataProvider
import { useAuth } from "./context/AuthContext";
import styled from "styled-components";

// AppContent component to use auth context
function AppContent() {
  const { doctorAuth, patientAuth } = useAuth();
  
  // Wrap doctor components with DashboardLayout
  const DoctorDashboardWithLayout = () => (
    <DashboardLayout title="Doctor Dashboard" isDoctor={true}>
      <DoctorDashboard />
    </DashboardLayout>
  );
  
  const UploadCaseWithLayout = () => (
    <DashboardLayout title="Upload New Case" isDoctor={true}>
      <UploadCase />
    </DashboardLayout>
  );
  
  const EEGAnalysisWithLayout = () => (
    <DashboardLayout title="EEG Analysis" isDoctor={true}>
      <EEGAnalysis />
    </DashboardLayout>
  );
  
  // Wrap patient components with DashboardLayout
  const PatientDashboardWithLayout = () => (
    <DashboardLayout title="Patient Dashboard" isDoctor={false}>
      <PatientDashboard />
    </DashboardLayout>
  );
  
  const EEGReportsWithLayout = () => (
    <DashboardLayout title="EEG Reports" isDoctor={false}>
      <EEGReports />
    </DashboardLayout>
  );
  
  const AppointmentsWithLayout = () => (
    <DashboardLayout title="Appointments" isDoctor={false}>
      <PatientAppointments />
    </DashboardLayout>
  );
  
  const AIAssistantWithLayout = () => (
    <DashboardLayout title="AI Assistant" isDoctor={false}>
      <AIAssistant />
    </DashboardLayout>
  );
  
  return (
    <Router>
      <Navbar />
      <MainContainer>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Login routes */}
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/patient-login" element={<PatientLogin />} />
          
          {/* Doctor Portal Entry */}
          <Route path="/doctor" element={
            doctorAuth.isAuthenticated ? 
              <Navigate to="/doctor/dashboard" /> : 
              <Navigate to="/doctor-login" />
          } />
          
          {/* Doctor Dashboard routes - now using the wrapped components */}
          <Route path="/doctor/dashboard" element={
            doctorAuth.isAuthenticated ? 
              <DoctorDashboardWithLayout /> : 
              <Navigate to="/doctor-login" />
          } />
          <Route path="/doctor/upload" element={
            doctorAuth.isAuthenticated ? 
              <UploadCaseWithLayout /> : 
              <Navigate to="/doctor-login" />
          } />
          <Route path="/doctor/analysis" element={
            doctorAuth.isAuthenticated ? 
              <EEGAnalysisWithLayout /> : 
              <Navigate to="/doctor-login" />
          } />
          
          {/* Patient Portal Entry */}
          <Route path="/patient" element={
            patientAuth.isAuthenticated ? 
              <Navigate to="/patient/dashboard" /> : 
              <Navigate to="/patient-login" />
          } />
          
          {/* Patient Dashboard routes - now using the wrapped components */}
          <Route path="/patient/dashboard" element={
            patientAuth.isAuthenticated ? 
              <PatientDashboardWithLayout /> : 
              <Navigate to="/patient-login" />
          } />
          <Route path="/patient/eeg-reports" element={
            patientAuth.isAuthenticated ? 
              <EEGReportsWithLayout /> : 
              <Navigate to="/patient-login" />
          } />
          <Route path="/patient/appointments" element={
            patientAuth.isAuthenticated ? 
              <AppointmentsWithLayout /> : 
              <Navigate to="/patient-login" />
          } />
          <Route path="/patient/chatbot" element={
            patientAuth.isAuthenticated ? 
              <AIAssistantWithLayout /> : 
              <Navigate to="/patient-login" />
          } />
        </Routes>
      </MainContainer>
    </Router>
  );
}

// Main App component with AuthProvider and EEGDataProvider
function App() {
  return (
    <AuthProvider>
      <EEGDataProvider>
        <AppContent />
      </EEGDataProvider>
    </AuthProvider>
  );
}

// Styled Components
const MainContainer = styled.div`
  min-height: 100vh;
`;

export default App;