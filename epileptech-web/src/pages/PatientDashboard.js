import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { 
  FaBrain, 
  FaFileDownload, 
  FaHistory, 
  FaChartLine, 
  FaCalendarAlt,
  FaPills,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaClipboardList
} from "react-icons/fa";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");
  
  // Mock data for the dashboard
  const eegReports = [
    { 
      id: "EEG-2845", 
      date: "March 1, 2025", 
      doctor: "Dr. Sana Araj",
      status: "Completed",
      result: "Non-Epileptic",
      notes: "Normal EEG patterns observed. No abnormal activity detected.",
      confidence: 92,
      type: "Routine EEG"
    },
    { 
      id: "EEG-2562", 
      date: "January 15, 2025", 
      doctor: "Dr. Sana Araj",
      status: "Completed",
      result: "Non-Epileptic",
      notes: "Normal EEG patterns with occasional alpha rhythm variations.",
      confidence: 88,
      type: "Routine EEG"
    }
  ];

  const appointments = [
    { 
      id: 1, 
      doctor: "Dr. Sana Araj", 
      specialty: "Neurology", 
      date: "March 5, 2025", 
      time: "10:00 AM",
      purpose: "EEG Follow-up",
      location: "Neurology Center, Building B"
    }
  ];

  const medications = [
    { 
      name: "Levetiracetam", 
      dosage: "500mg", 
      frequency: "Twice daily", 
      refillDate: "March 15, 2025",
      adherence: 95,
      sideEffects: ["Mild fatigue", "Occasional dizziness"]
    },
    { 
      name: "Lamotrigine", 
      dosage: "200mg", 
      frequency: "Once daily", 
      refillDate: "April 2, 2025",
      adherence: 98,
      sideEffects: []
    }
  ];

  // Seizure tracking data for visualization
  const seizureData = [
    { month: 'Sep', count: 3 },
    { month: 'Oct', count: 2 },
    { month: 'Nov', count: 2 },
    { month: 'Dec', count: 1 },
    { month: 'Jan', count: 1 },
    { month: 'Feb', count: 0 },
    { month: 'Mar', count: 0 },
  ];

  // Treatment efficacy data
  const treatmentEfficacy = {
    seizureReduction: 85,
    medicationAdherence: 96,
    sideEffectSeverity: "Low",
    nextReview: "April 10, 2025"
  };

  return (
    <>
      <WelcomeSection>
        <WelcomeContent>
          <h2>Welcome, John!</h2>
          <p>Your epilepsy management portal</p>
        </WelcomeContent>
        <TreatmentSummary>
          <SummaryItem>
            <FaCheckCircle color="#2ECC71" />
            <SummaryText>
              <strong>85%</strong> Seizure Reduction
            </SummaryText>
          </SummaryItem>
          <SummaryItem>
            <FaCheckCircle color="#2ECC71" />
            <SummaryText>
              <strong>96%</strong> Medication Adherence
            </SummaryText>
          </SummaryItem>
          <SummaryItem>
            <FaExclamationTriangle color="#F39C12" />
            <SummaryText>
              Next Review: <strong>April 10</strong>
            </SummaryText>
          </SummaryItem>
        </TreatmentSummary>
      </WelcomeSection>

      <TabsContainer>
        <TabButton 
          active={selectedTab === "overview"} 
          onClick={() => setSelectedTab("overview")}
        >
          Overview
        </TabButton>
        <TabButton 
          active={selectedTab === "eeg-reports"} 
          onClick={() => setSelectedTab("eeg-reports")}
        >
          EEG Reports
        </TabButton>
        <TabButton 
          active={selectedTab === "appointments"} 
          onClick={() => setSelectedTab("appointments")}
        >
          Appointments
        </TabButton>
        <TabButton 
          active={selectedTab === "medications"} 
          onClick={() => setSelectedTab("medications")}
        >
          Medications
        </TabButton>
      </TabsContainer>

      {selectedTab === "overview" && (
        <DashboardGrid>
          {/* EEG Analysis Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FaBrain />
                <h3>Recent EEG Analysis</h3>
              </CardTitle>
              <ViewAllLink onClick={() => setSelectedTab("eeg-reports")}>View All</ViewAllLink>
            </CardHeader>
            {eegReports.length > 0 ? (
              <ReportCard>
                <ReportHeader>
                  <div>
                    <ReportId>{eegReports[0].id}</ReportId>
                    <ReportDate>{eegReports[0].date} • {eegReports[0].type}</ReportDate>
                  </div>
                  <ResultBadge result={eegReports[0].result}>
                    {eegReports[0].result}
                    <ConfidenceLabel>{eegReports[0].confidence}% confidence</ConfidenceLabel>
                  </ResultBadge>
                </ReportHeader>
                <ReportContent>
                  <ReportNotes>
                    <FaInfoCircle />
                    <p>{eegReports[0].notes}</p>
                  </ReportNotes>
                  <ActionButtonsGroup>
                    <Button primary onClick={() => navigate(`/patient/eeg-report/${eegReports[0].id}`)}>
                      View Details
                    </Button>
                    <IconButton title="Download Report">
                      <FaFileDownload />
                    </IconButton>
                  </ActionButtonsGroup>
                </ReportContent>
              </ReportCard>
            ) : (
              <EmptyState>No EEG reports available</EmptyState>
            )}
          </Card>

          {/* Seizure Trends */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FaChartLine />
                <h3>Seizure Trends</h3>
              </CardTitle>
            </CardHeader>
            <SeizureTrendsContainer>
              <TrendsInfo>
                <TrendValue decreasing>-100%</TrendValue>
                <TrendLabel>Last 60 Days</TrendLabel>
              </TrendsInfo>
              <GraphContainer>
                {seizureData.map((month, index) => (
                  <GraphBar key={index}>
                    <BarValue style={{ height: `${month.count * 20}px` }}>
                      {month.count > 0 && <span>{month.count}</span>}
                    </BarValue>
                    <BarLabel>{month.month}</BarLabel>
                  </GraphBar>
                ))}
              </GraphContainer>
            </SeizureTrendsContainer>
          </Card>

          {/* Upcoming Appointments Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FaCalendarAlt />
                <h3>Upcoming Appointments</h3>
              </CardTitle>
              <ViewAllLink onClick={() => setSelectedTab("appointments")}>View All</ViewAllLink>
            </CardHeader>
            {appointments.length > 0 ? (
              <List>
                {appointments.slice(0, 1).map(appointment => (
                  <AppointmentItem key={appointment.id}>
                    <AppointmentDate>
                      <DateBubble>
                        <Month>MAR</Month>
                        <Day>05</Day>
                      </DateBubble>
                      <Time>{appointment.time}</Time>
                    </AppointmentDate>
                    <AppointmentDetails>
                      <DoctorName>{appointment.doctor}</DoctorName>
                      <AppointmentType>{appointment.specialty} - {appointment.purpose}</AppointmentType>
                      <AppointmentLocation>
                        {appointment.location}
                      </AppointmentLocation>
                    </AppointmentDetails>
                    <AppointmentActions>
                      <Button>Reschedule</Button>
                    </AppointmentActions>
                  </AppointmentItem>
                ))}
              </List>
            ) : (
              <EmptyState>No upcoming appointments</EmptyState>
            )}
          </Card>

          {/* Medications Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FaPills />
                <h3>Current Medications</h3>
              </CardTitle>
              <ViewAllLink onClick={() => setSelectedTab("medications")}>View All</ViewAllLink>
            </CardHeader>
            {medications.length > 0 ? (
              <List>
                {medications.slice(0, 2).map((medication, index) => (
                  <MedicationItem key={index}>
                    <MedicationInfo>
                      <MedicationName>{medication.name}</MedicationName>
                      <MedicationDosage>{medication.dosage}, {medication.frequency}</MedicationDosage>
                      <RefillDate>Refill by: {medication.refillDate}</RefillDate>
                    </MedicationInfo>
                    <MedicationMetrics>
                      <AdherenceBar>
                        <MedicationAdherenceText>Adherence</MedicationAdherenceText>
                        <AdherenceProgress>
                          <AdherenceValue style={{ width: `${medication.adherence}%` }} />
                        </AdherenceProgress>
                        <AdherencePercentage>{medication.adherence}%</AdherencePercentage>
                      </AdherenceBar>
                    </MedicationMetrics>
                  </MedicationItem>
                ))}
              </List>
            ) : (
              <EmptyState>No current medications</EmptyState>
            )}
          </Card>

          {/* Recent Activity Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FaHistory />
                <h3>Recent Activity</h3>
              </CardTitle>
            </CardHeader>
            <ActivityList>
              <ActivityItem>
                <ActivityIcon>
                  <FaBrain />
                </ActivityIcon>
                <ActivityContent>
                  <ActivityTitle>EEG Analysis Completed</ActivityTitle>
                  <ActivityDescription>Your latest EEG test has been analyzed</ActivityDescription>
                  <ActivityDate>March 1, 2025</ActivityDate>
                </ActivityContent>
              </ActivityItem>
              <ActivityItem>
                <ActivityIcon>
                  <FaPills />
                </ActivityIcon>
                <ActivityContent>
                  <ActivityTitle>Medication Refill</ActivityTitle>
                  <ActivityDescription>Levetiracetam prescription was refilled</ActivityDescription>
                  <ActivityDate>February 28, 2025</ActivityDate>
                </ActivityContent>
              </ActivityItem>
              <ActivityItem>
                <ActivityIcon>
                  <FaClipboardList />
                </ActivityIcon>
                <ActivityContent>
                  <ActivityTitle>Doctor's Message</ActivityTitle>
                  <ActivityDescription>Dr. Araj sent you a new message</ActivityDescription>
                  <ActivityDate>February 25, 2025</ActivityDate>
                </ActivityContent>
              </ActivityItem>
            </ActivityList>
          </Card>

          {/* Treatment Efficacy Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FaCheckCircle />
                <h3>Treatment Efficacy</h3>
              </CardTitle>
            </CardHeader>
            <EfficacyContainer>
              <EfficacyMetric>
                <MetricLabel>Seizure Reduction</MetricLabel>
                <MetricGauge>
                  <GaugeValue style={{ width: `${treatmentEfficacy.seizureReduction}%` }} />
                </MetricGauge>
                <MetricValue>{treatmentEfficacy.seizureReduction}%</MetricValue>
              </EfficacyMetric>
              
              <EfficacyMetric>
                <MetricLabel>Medication Adherence</MetricLabel>
                <MetricGauge>
                  <GaugeValue style={{ width: `${treatmentEfficacy.medicationAdherence}%` }} />
                </MetricGauge>
                <MetricValue>{treatmentEfficacy.medicationAdherence}%</MetricValue>
              </EfficacyMetric>
              
              <EfficacySummary>
                <SummaryEntry>
                  <EntryLabel>Side Effect Severity:</EntryLabel>
                  <EntryValue>{treatmentEfficacy.sideEffectSeverity}</EntryValue>
                </SummaryEntry>
                <SummaryEntry>
                  <EntryLabel>Next Treatment Review:</EntryLabel>
                  <EntryValue>{treatmentEfficacy.nextReview}</EntryValue>
                </SummaryEntry>
              </EfficacySummary>
            </EfficacyContainer>
          </Card>
        </DashboardGrid>
      )}

      {selectedTab === "eeg-reports" && (
        <Card fullWidth>
          <CardHeader>
            <CardTitle>
              <FaBrain />
              <h3>All EEG Reports</h3>
            </CardTitle>
          </CardHeader>
          {eegReports.length > 0 ? (
            <>
              <ReportFilters>
                <Select defaultValue="all">
                  <option value="all">All Results</option>
                  <option value="epileptic">Epileptic</option>
                  <option value="non-epileptic">Non-Epileptic</option>
                </Select>
                <Select defaultValue="recent">
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                </Select>
              </ReportFilters>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Report ID</TableHeaderCell>
                    <TableHeaderCell>Date</TableHeaderCell>
                    <TableHeaderCell>Type</TableHeaderCell>
                    <TableHeaderCell>Doctor</TableHeaderCell>
                    <TableHeaderCell>Result</TableHeaderCell>
                    <TableHeaderCell>Confidence</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eegReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.id}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>{report.type}</TableCell>
                      <TableCell>{report.doctor}</TableCell>
                      <TableCell>
                        <ResultBadge result={report.result}>
                          {report.result}
                        </ResultBadge>
                      </TableCell>
                      <TableCell>{report.confidence}%</TableCell>
                      <TableCell>
                        <ActionButtonsGroup>
                          <Button onClick={() => navigate(`/patient/eeg-report/${report.id}`)}>View</Button>
                          <IconButton><FaFileDownload /></IconButton>
                        </ActionButtonsGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <EmptyState>No EEG reports available</EmptyState>
          )}
        </Card>
      )}

      {selectedTab === "appointments" && (
        <Card fullWidth>
          <CardHeader>
            <CardTitle>
              <FaCalendarAlt />
              <h3>All Appointments</h3>
            </CardTitle>
            <Button primary onClick={() => navigate("/patient/appointments")}>Book New</Button>
          </CardHeader>
          {appointments.length > 0 ? (
            <List>
              {appointments.map(appointment => (
                <AppointmentItem key={appointment.id}>
                  <AppointmentDate>
                    <DateBubble>
                      <Month>MAR</Month>
                      <Day>05</Day>
                    </DateBubble>
                    <Time>{appointment.time}</Time>
                  </AppointmentDate>
                  <AppointmentDetails>
                    <DoctorName>{appointment.doctor}</DoctorName>
                    <AppointmentType>{appointment.specialty} - {appointment.purpose}</AppointmentType>
                    <AppointmentLocation>
                      {appointment.location}
                    </AppointmentLocation>
                  </AppointmentDetails>
                  <AppointmentActions>
                    <Button>Reschedule</Button>
                    <Button secondary>Cancel</Button>
                  </AppointmentActions>
                </AppointmentItem>
              ))}
            </List>
          ) : (
            <EmptyState>No appointments scheduled</EmptyState>
          )}
        </Card>
      )}

      {selectedTab === "medications" && (
        <Card fullWidth>
          <CardHeader>
            <CardTitle>
              <FaPills />
              <h3>Medications</h3>
            </CardTitle>
          </CardHeader>
          {medications.length > 0 ? (
            <List>
              {medications.map((medication, index) => (
                <MedicationDetailItem key={index}>
                  <MedicationDetailHeader>
                    <MedicationInfo>
                      <MedicationName>{medication.name}</MedicationName>
                      <MedicationDosage>{medication.dosage}, {medication.frequency}</MedicationDosage>
                      <RefillDate>Refill by: {medication.refillDate}</RefillDate>
                    </MedicationInfo>
                    <AdherenceCircle percentage={medication.adherence}>
                      <CirclePercentage>{medication.adherence}%</CirclePercentage>
                      <CircleLabel>Adherence</CircleLabel>
                    </AdherenceCircle>
                  </MedicationDetailHeader>
                  
                  {medication.sideEffects.length > 0 && (
                    <SideEffectsSection>
                      <SideEffectsTitle>Reported Side Effects:</SideEffectsTitle>
                      <SideEffectsList>
                        {medication.sideEffects.map((effect, i) => (
                          <SideEffectItem key={i}>{effect}</SideEffectItem>
                        ))}
                      </SideEffectsList>
                    </SideEffectsSection>
                  )}
                </MedicationDetailItem>
              ))}
            </List>
          ) : (
            <EmptyState>No current medications</EmptyState>
          )}
        </Card>
      )}
    </>
  );
};

// Styled Components
const WelcomeSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const WelcomeContent = styled.div`
  h2 {
    margin: 0 0 8px 0;
    color: #2c3e50;
    font-size: 26px;
  }
  
  p {
    margin: 0;
    color: #7f8c8d;
    font-size: 16px;
  }
`;

const TreatmentSummary = styled.div`
  display: flex;
  gap: 16px;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 8px;
`;

const SummaryText = styled.div`
  font-size: 14px;
  color: #2c3e50;
  
  strong {
    color: #3D52A0;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
`;

const TabButton = styled.button`
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  color: ${props => props.active ? '#3D52A0' : '#7f8c8d'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  
  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #3D52A0;
    display: ${props => props.active ? 'block' : 'none'};
  }
  
  &:hover {
    color: #3D52A0;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 18px;
  }
  
  svg {
    color: #3D52A0;
    font-size: 20px;
  }
`;

const ViewAllLink = styled.a`
  color: #3D52A0;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReportCard = styled.div`
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #E0E6F5;
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #F0F4FD;
`;

const ReportId = styled.div`
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;
`;

const ReportDate = styled.div`
  color: #7B8794;
  font-size: 14px;
  margin-top: 4px;
`;

const ReportContent = styled.div`
  padding: 16px;
`;

const ReportNotes = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  
  svg {
    color: #3D52A0;
    font-size: 18px;
    margin-top: 2px;
  }
  
  p {
    margin: 0;
    color: #2c3e50;
    font-size: 14px;
    line-height: 1.5;
  }
`;

const ResultBadge = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  
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
    } else if (props.result === "PNES") {
      return `
        background-color: rgba(241, 196, 15, 0.1);
        color: #F1C40F;
      `;
    } else {
      return `
        background-color: rgba(52, 152, 219, 0.1);
        color: #3498DB;
      `;
    }
  }}
`;

const ConfidenceLabel = styled.span`
  font-size: 12px;
  opacity: 0.8;
  font-weight: normal;
  margin-top: 4px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  background-color: ${props => props.primary ? '#3D52A0' : props.secondary ? '#e74c3c' : '#f1f2f6'};
  color: ${props => props.primary || props.secondary ? 'white' : '#34495e'};
  border: none;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.primary ? '#2A3B75' : props.secondary ? '#c0392b' : '#e0e0e0'};
    transform: translateY(-2px);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  }
  
  margin-left: ${props => props.secondary ? '8px' : '0'};
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f2f6;
  border: none;
  border-radius: 6px;
  color: #34495e;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e0e0e0;
    transform: translateY(-2px);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  }
`;

const ActionButtonsGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const EmptyState = styled.div`
  padding: 24px;
  text-align: center;
  color: #7f8c8d;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

// Seizure Trends
const SeizureTrendsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TrendsInfo = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const TrendValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.decreasing ? '#2ECC71' : '#E74C3C'};
`;

const TrendLabel = styled.div`
  font-size: 14px;
  color: #7B8794;
`;

const GraphContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 120px;
  padding-top: 20px;
`;

const GraphBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const BarValue = styled.div`
  background: ${props => props.value === 0 ? '#E0E6F5' : 'linear-gradient(180deg, #4361EE 0%, #3D52A0 100%)'};
  width: 12px;
  border-radius: 6px;
  min-height: 4px;
  display: flex;
  justify-content: center;
  
  span {
    color: white;
    font-size: 10px;
    position: relative;
    top: -15px;
  }
`;

const BarLabel = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: #7B8794;
`;

// Appointment Styling
const AppointmentItem = styled.div`
  display: flex;
  padding: 16px;
  border-radius: 8px;
  background-color: #f8f9fa;
  gap: 16px;
  align-items: center;
  
  @media (max-width: 576px) {
    flex-wrap: wrap;
  }
`;

const AppointmentDate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DateBubble = styled.div`
  background: #3D52A0;
  color: white;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
`;

const Month = styled.div`
  font-size: 12px;
  text-transform: uppercase;
`;

const Day = styled.div`
  font-size: 20px;
  font-weight: 600;
`;

const Time = styled.div`
  margin-top: 8px;
  color: #7B8794;
  font-size: 14px;
`;

const AppointmentDetails = styled.div`
  flex-grow: 1;
`;

const DoctorName = styled.div`
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;
`;

const AppointmentType = styled.div`
  color: #7B8794;
  font-size: 14px;
  margin-top: 4px;
`;

const AppointmentLocation = styled.div`
  color: #7B8794;
  font-size: 14px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const AppointmentActions = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 576px) {
    width: 100%;
    margin-top: 12px;
  }
`;

// Medication styling
const MedicationItem = styled.div`
  display: flex;
  padding: 16px;
  border-radius: 8px;
  background-color: #f8f9fa;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const MedicationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MedicationName = styled.div`
  font-weight: 600;
  color: #2c3e50;
`;

const MedicationDosage = styled.div`
  color: #7B8794;
  font-size: 14px;
`;

const RefillDate = styled.div`
  color: #7B8794;
  font-size: 14px;
`;

const MedicationMetrics = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 200px;
  
  @media (max-width: 576px) {
    width: 100%;
  }
`;

const AdherenceBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MedicationAdherenceText = styled.div`
  font-size: 12px;
  color: #7B8794;
`;

const AdherenceProgress = styled.div`
  height: 6px;
  background-color: #E0E6F5;
  border-radius: 3px;
  width: 100%;
`;

const AdherenceValue = styled.div`
  height: 6px;
  background: linear-gradient(90deg, #4361EE 0%, #3D52A0 100%);
  border-radius: 3px;
`;

const AdherencePercentage = styled.div`
  font-size: 12px;
  color: #3D52A0;
  font-weight: 600;
  align-self: flex-end;
`;

// Medication Detail Item
const MedicationDetailItem = styled.div`
  border: 1px solid #E0E6F5;
  border-radius: 8px;
  overflow: hidden;
`;

const MedicationDetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background-color: #F0F4FD;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const AdherenceCircle = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: conic-gradient(
    #3D52A0 ${props => props.percentage}%, 
    #E0E6F5 ${props => props.percentage}% 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: white;
  }
`;

const CirclePercentage = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #3D52A0;
  z-index: 1;
`;

const CircleLabel = styled.div`
  font-size: 12px;
  color: #7B8794;
  z-index: 1;
`;

const SideEffectsSection = styled.div`
  padding: 16px;
  border-top: 1px solid #E0E6F5;
`;

const SideEffectsTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
`;

const SideEffectsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SideEffectItem = styled.div`
  background-color: #F0F4FD;
  color: #3D52A0;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
`;

// Activity styling
const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ActivityItem = styled.div`
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f1f2f6;
  gap: 16px;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #F0F4FD;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3D52A0;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ActivityTitle = styled.div`
  font-weight: 600;
  color: #2c3e50;
`;

const ActivityDescription = styled.div`
  color: #7B8794;
  font-size: 14px;
`;

const ActivityDate = styled.div`
  color: #7B8794;
  font-size: 12px;
  margin-top: 4px;
`;

// Treatment Efficacy styling
const EfficacyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const EfficacyMetric = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MetricLabel = styled.div`
  min-width: 140px;
  font-size: 14px;
  color: #2c3e50;
`;

const MetricGauge = styled.div`
  flex-grow: 1;
  height: 8px;
  background-color: #E0E6F5;
  border-radius: 4px;
`;

const GaugeValue = styled.div`
  height: 8px;
  background: linear-gradient(90deg, #4361EE 0%, #3D52A0 100%);
  border-radius: 4px;
`;

const MetricValue = styled.div`
  min-width: 40px;
  font-size: 14px;
  font-weight: 600;
  color: #3D52A0;
  text-align: right;
`;

const EfficacySummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
  background: #F0F4FD;
  padding: 16px;
  border-radius: 8px;
`;

const SummaryEntry = styled.div`
  display: flex;
  justify-content: space-between;
`;

const EntryLabel = styled.div`
  font-size: 14px;
  color: #7B8794;
`;

const EntryValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
`;

// Report table styles
const ReportFilters = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  background-color: white;
  font-size: 14px;
  color: #34495e;
  
  &:focus {
    outline: none;
    border-color: #3D52A0;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: #f8f9fa;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const TableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
`;

const TableCell = styled.td`
  padding: 12px 16px;
  vertical-align: middle;
`;

export default PatientDashboard;