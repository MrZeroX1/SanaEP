import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaBrain, FaUserMd, FaNotesMedical, FaCalendarCheck, FaMobileAlt, FaChartLine } from "react-icons/fa";

const ServicesPage = () => {
  return (
    <PageContainer>
      <HeroSection>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle>Our Services</HeroTitle>
          <HeroSubtitle>
            Advanced solutions for epilepsy diagnosis and treatment
          </HeroSubtitle>
        </motion.div>
      </HeroSection>

      <ContentWrapper>
        <ServiceGrid>
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              as={motion.div}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <IconContainer style={{ background: service.iconBg }}>
                {service.icon}
              </IconContainer>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDescription>{service.description}</ServiceDescription>
            </ServiceCard>
          ))}
        </ServiceGrid>
      </ContentWrapper>
    </PageContainer>
  );
};

// Services data
const services = [
  {
    icon: <FaBrain size={40} />,
    iconBg: "linear-gradient(135deg, #3D52A0, #7091E6)",
    title: "EEG Analysis with AI",
    description: "Advanced AI-powered analysis of EEG data to detect patterns associated with epilepsy with high accuracy. Our algorithms can identify seizure patterns that may be missed in traditional analysis."
  },
  {
    icon: <FaUserMd size={40} />,
    iconBg: "linear-gradient(135deg, #E67E22, #F39C12)",
    title: "Doctor-Patient Consultations",
    description: "Seamless virtual consultations with medical experts for personalized care from anywhere. Includes secure video conferencing, file sharing, and integrated health record access."
  },
  {
    icon: <FaNotesMedical size={40} />,
    iconBg: "linear-gradient(135deg, #27AE60, #2ECC71)",
    title: "Automated Epilepsy Diagnosis",
    description: "Instant AI-driven epilepsy detection, improving diagnostic speed & accuracy. Our system has been trained on thousands of EEG samples to recognize even subtle seizure indicators."
  },
  {
    icon: <FaCalendarCheck size={40} />,
    iconBg: "linear-gradient(135deg, #8E44AD, #9B59B6)",
    title: "Medical Report Generation",
    description: "Automated medical reports summarizing EEG results for patients & doctors, complete with visualizations and detailed analysis that makes complex data easy to understand."
  },
  {
    icon: <FaMobileAlt size={40} />,
    iconBg: "linear-gradient(135deg, #1ABC9C, #16A085)",
    title: "Seizure Classification",
    description: "Differentiating between epileptic seizures and psychogenic non-epileptic seizures (PNES) using advanced deep learning models trained on extensive EEG datasets for accurate diagnosis."
  },
  {
    icon: <FaChartLine size={40} />,
    iconBg: "linear-gradient(135deg, #C0392B, #E74C3C)",
    title: "Treatment Efficacy Analysis",
    description: "Data-driven insights into treatment effectiveness based on patient outcomes and seizure frequency tracking. Helps doctors optimize medication and treatment plans."
  }
];

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #F9FAFC;
`;

const HeroSection = styled.div`
  width: 100%;
  padding: 100px 20px 60px 20px;
  background: linear-gradient(135deg, #3D52A0 0%, #7091E6 100%);
  text-align: center;
  color: white;
  display: flex;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  margin-top: 15px;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ContentWrapper = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: -40px auto 60px auto;
  position: relative;
  z-index: 2;
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 30px;
  justify-content: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled.div`
  background: white;
  padding: 35px 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  height: 100%;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.iconBg || "linear-gradient(135deg, #3D52A0, #7091E6)"};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const IconContainer = styled.div`
  padding: 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 25px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const ServiceTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 15px 0;
  color: #2C3E50;
`;

const ServiceDescription = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #555;
  flex-grow: 1;
`;

export default ServicesPage;