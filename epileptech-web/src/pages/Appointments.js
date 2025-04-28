import React, { useState } from "react";
import styled from "styled-components";
import { FaCalendarPlus, FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";

const Appointments = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showBookForm, setShowBookForm] = useState(false);
  
  // Mock data
  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sana Araj",
      specialty: "Neurology",
      purpose: "EEG Follow-up",
      date: "March 5, 2025",
      time: "10:00 AM",
      location: "Neurology Center, Building B",
      notes: "Please bring your medication list and any seizure diary updates."
    }
  ];
  
  const pastAppointments = [
    {
      id: 2,
      doctor: "Dr. Sana Araj",
      specialty: "Neurology",
      purpose: "Initial Consultation",
      date: "February 10, 2025",
      time: "2:30 PM",
      location: "Neurology Center, Building B",
      notes: "EEG test scheduled for February 28, 2025."
    },
    {
      id: 3,
      doctor: "Dr. Michael Lee",
      specialty: "Neurology",
      purpose: "Annual Checkup",
      date: "October 15, 2024",
      time: "9:15 AM",
      location: "Main Hospital, Floor 3",
      notes: "No significant changes in condition. Continue current medication."
    }
  ];
  
  return (
    <Container>
      <Header>
        <HeaderContent>
          <h1>Your Appointments</h1>
          <p>Manage your scheduled and past appointments</p>
        </HeaderContent>
        <BookButton onClick={() => setShowBookForm(true)}>
          <FaCalendarPlus />
          <span>Book New</span>
        </BookButton>
      </Header>
      
      <TabsContainer>
        <Tab 
          active={activeTab === "upcoming"}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
          {upcomingAppointments.length > 0 && (
            <TabBadge>{upcomingAppointments.length}</TabBadge>
          )}
        </Tab>
        <Tab 
          active={activeTab === "past"}
          onClick={() => setActiveTab("past")}
        >
          Past Appointments
        </Tab>
      </TabsContainer>
      
      {activeTab === "upcoming" && (
        upcomingAppointments.length > 0 ? (
          <AppointmentsList>
            {upcomingAppointments.map(appointment => (
              <AppointmentCard key={appointment.id}>
                <AppointmentHeader>
                  <AppointmentDate>
                    <FaCalendarAlt />
                    <span>{appointment.date}</span>
                  </AppointmentDate>
                  <AppointmentTime>
                    <FaClock />
                    <span>{appointment.time}</span>
                  </AppointmentTime>
                </AppointmentHeader>
                
                <AppointmentDetails>
                  <DoctorInfo>
                    <DoctorName>{appointment.doctor}</DoctorName>
                    <DoctorSpecialty>{appointment.specialty} - {appointment.purpose}</DoctorSpecialty>
                  </DoctorInfo>
                  
                  <LocationInfo>
                    <FaMapMarkerAlt />
                    <span>{appointment.location}</span>
                  </LocationInfo>
                  
                  {appointment.notes && (
                    <AppointmentNotes>
                      <strong>Notes:</strong> {appointment.notes}
                    </AppointmentNotes>
                  )}
                </AppointmentDetails>
                
                <AppointmentActions>
                  <ActionButton primary>Reschedule</ActionButton>
                  <ActionButton secondary>Cancel</ActionButton>
                </AppointmentActions>
              </AppointmentCard>
            ))}
          </AppointmentsList>
        ) : (
          <EmptyState>
            <FaCalendarAlt size={40} />
            <h3>No Upcoming Appointments</h3>
            <p>Book a new appointment with your doctor</p>
            <BookButton onClick={() => setShowBookForm(true)}>
              <FaCalendarPlus />
              <span>Book Appointment</span>
            </BookButton>
          </EmptyState>
        )
      )}
      
      {activeTab === "past" && (
        pastAppointments.length > 0 ? (
          <AppointmentsList>
            {pastAppointments.map(appointment => (
              <AppointmentCard key={appointment.id} past>
                <AppointmentHeader>
                  <AppointmentDate>
                    <FaCalendarAlt />
                    <span>{appointment.date}</span>
                  </AppointmentDate>
                  <AppointmentTime>
                    <FaClock />
                    <span>{appointment.time}</span>
                  </AppointmentTime>
                </AppointmentHeader>
                
                <AppointmentDetails>
                  <DoctorInfo>
                    <DoctorName>{appointment.doctor}</DoctorName>
                    <DoctorSpecialty>{appointment.specialty} - {appointment.purpose}</DoctorSpecialty>
                  </DoctorInfo>
                  
                  <LocationInfo>
                    <FaMapMarkerAlt />
                    <span>{appointment.location}</span>
                  </LocationInfo>
                  
                  {appointment.notes && (
                    <AppointmentNotes>
                      <strong>Notes:</strong> {appointment.notes}
                    </AppointmentNotes>
                  )}
                </AppointmentDetails>
                
                <AppointmentActions>
                  <ActionButton primary>View Summary</ActionButton>
                </AppointmentActions>
              </AppointmentCard>
            ))}
          </AppointmentsList>
        ) : (
          <EmptyState>
            <FaCalendarAlt size={40} />
            <h3>No Past Appointments</h3>
            <p>Your appointment history will appear here</p>
          </EmptyState>
        )
      )}
      
      {showBookForm && (
        <BookingFormOverlay>
          <BookingForm>
            <BookingHeader>
              <h2>Book New Appointment</h2>
              <CloseButton onClick={() => setShowBookForm(false)}>×</CloseButton>
            </BookingHeader>
            
            <FormGroup>
              <Label>Select Doctor</Label>
              <Select>
                <option value="">Choose a doctor</option>
                <option value="dr-araj">Dr. Sana Araj - Neurology</option>
                <option value="dr-lee">Dr. Michael Lee - Neurology</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>Appointment Type</Label>
              <Select>
                <option value="">Select appointment type</option>
                <option value="follow-up">Follow-up Visit</option>
                <option value="eeg">EEG Test</option>
                <option value="consultation">Consultation</option>
              </Select>
            </FormGroup>
            
            <FormFields>
              <FormGroup>
                <Label>Date</Label>
                <DateInput type="date" min={new Date().toISOString().split('T')[0]} />
              </FormGroup>
              
              <FormGroup>
                <Label>Preferred Time</Label>
                <Select>
                  <option value="">Select time</option>
                  <option value="morning">Morning (9AM - 12PM)</option>
                  <option value="afternoon">Afternoon (1PM - 5PM)</option>
                </Select>
              </FormGroup>
            </FormFields>
            
            <FormGroup>
              <Label>Reason for Visit</Label>
              <Textarea placeholder="Please describe the reason for your appointment..."></Textarea>
            </FormGroup>
            
            <FormActions>
              <ActionButton onClick={() => setShowBookForm(false)}>Cancel</ActionButton>
              <ActionButton primary>Book Appointment</ActionButton>
            </FormActions>
          </BookingForm>
        </BookingFormOverlay>
      )}
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const HeaderContent = styled.div`
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

const BookButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
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

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #E0E6F5;
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#3D52A0' : 'transparent'};
  color: ${props => props.active ? '#3D52A0' : '#7B8794'};
  font-weight: ${props => props.active ? '600' : 'normal'};
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: #3D52A0;
  }
`;

const TabBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #3D52A0;
  color: white;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
`;

const AppointmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AppointmentCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.05);
  opacity: ${props => props.past ? 0.8 : 1};
`;

const AppointmentHeader = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const AppointmentDate = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2A3B75;
  font-weight: 600;
  
  svg {
    color: #3D52A0;
  }
`;

const AppointmentTime = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2A3B75;
  
  svg {
    color: #3D52A0;
  }
`;

const AppointmentDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

const DoctorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DoctorName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #2c3e50;
`;

const DoctorSpecialty = styled.div`
  font-size: 14px;
  color: #7B8794;
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #7B8794;
  
  svg {
    color: #3D52A0;
    min-width: 14px;
  }
`;

const AppointmentNotes = styled.div`
  font-size: 14px;
  color: #7B8794;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #E0E6F5;
  
  strong {
    color: #2c3e50;
  }
`;

const AppointmentActions = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  background: ${props => props.primary ? '#3D52A0' : props.secondary ? '#f1f2f6' : '#f1f2f6'};
  color: ${props => props.primary ? 'white' : props.secondary ? '#E74C3C' : '#2A3B75'};
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.primary ? '#2A3B75' : props.secondary ? '#ffe5e5' : '#E0E6F5'};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 40px 20px;
  border-radius: 12px;
  text-align: center;
  
  svg {
    color: #E0E6F5;
    margin-bottom: 16px;
  }
  
  h3 {
    margin: 0 0 8px 0;
    color: #2A3B75;
  }
  
  p {
    margin: 0 0 20px 0;
    color: #7B8794;
  }
`;

const BookingFormOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const BookingForm = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h2 {
    margin: 0;
    color: #2A3B75;
    font-size: 20px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #7B8794;
  cursor: pointer;
  
  &:hover {
    color: #E74C3C;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #E0E6F5;
  border-radius: 6px;
  font-size: 14px;
  color: #2c3e50;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237B8794' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  appearance: none;
  
  &:focus {
    outline: none;
    border-color: #3D52A0;
  }
`;

const FormFields = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const DateInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #E0E6F5;
  border-radius: 6px;
  font-size: 14px;
  color: #2c3e50;
  
  &:focus {
    outline: none;
    border-color: #3D52A0;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #E0E6F5;
  border-radius: 6px;
  font-size: 14px;
  color: #2c3e50;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3D52A0;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

export default Appointments;