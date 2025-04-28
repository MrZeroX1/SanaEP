import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import backgroundVideo from "../assets/vid.mp4"; // Ensure the video exists
import { FaBrain, FaUserMd, FaMobileAlt } from "react-icons/fa";

// Global style
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap');
  
  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: 'Montserrat', sans-serif;
    scroll-behavior: smooth;
  }
`;

const LandingPage = () => {
  const navigate = useNavigate();
  
  // Create ref for smooth scrolling
  const featuresRef = useRef(null);
  
  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <>
      <GlobalStyle />
      <Container>
        {/* Background Video */}
        <VideoBackground autoPlay loop muted>
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </VideoBackground>
        
        {/* Overlay gradient */}
        <Overlay />
        
        {/* Main Content */}
        <ContentWrapper>
          {/* Main content area with hero section */}
          <MainContentArea>
            <HeroSection
              as={motion.div}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Revolutionizing
                <ColoredSpan> Epilepsy Care</ColoredSpan>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                AI-driven seizure classification with real-time patient-doctor
                interactions, designed to transform epilepsy diagnosis and
                treatment.
              </motion.p>
              
              <ButtonContainer>
                <StyledButton 
                  primary
                  as={motion.button}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/doctor-login")}  // DIRECT to doctor login
                >
                  Doctor Portal
                </StyledButton>
                <StyledButton 
                  as={motion.button}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/patient-login")}  // DIRECT to patient login
                >
                  Patient Portal
                </StyledButton>
              </ButtonContainer>
              
              <ScrollDownButton 
                onClick={scrollToFeatures}
                as={motion.button}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Learn More <ScrollIcon>↓</ScrollIcon>
              </ScrollDownButton>
            </HeroSection>
          </MainContentArea>
        </ContentWrapper>
        
        {/* Feature Cards */}
        <div ref={featuresRef}>
          <FeatureSection
            as={motion.div}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <FeatureCard
              as={motion.div}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <IconWrapper>
                <FaBrain size={40} color="#FF69B4" />
              </IconWrapper>
              <FeatureTitle>AI Classification</FeatureTitle>
              <FeatureText>Advanced neural networks for accurate seizure pattern recognition</FeatureText>
            </FeatureCard>
            
            <FeatureCard
              as={motion.div}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              viewport={{ once: true }}
            >
              <IconWrapper>
                <FaUserMd size={40} color="#FFCC00" />
              </IconWrapper>
              <FeatureTitle>Doctor Dashboard</FeatureTitle>
              <FeatureText>Comprehensive patient monitoring and EEG analysis tools</FeatureText>
            </FeatureCard>
            
            <FeatureCard
              as={motion.div}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <IconWrapper>
                <FaMobileAlt size={40} color="#00BFFF" />
              </IconWrapper>
              <FeatureTitle>Patient Portal</FeatureTitle>
              <FeatureText>Easy seizure tracking and communication with medical professionals</FeatureText>
            </FeatureCard>
          </FeatureSection>
        </div>
      </Container>
    </>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

// Background Video Styling
const VideoBackground = styled.video`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
  filter: brightness(0.35);
  z-index: -2;
`;

// Overlay for better contrast
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(61, 82, 160, 0.5) 0%, rgba(61, 82, 160, 0.3) 100%);
  z-index: -1;
`;

// Content wrapper for main layout
const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 120px; /* Increased to accommodate fixed navbar */
  justify-content: center;
`;

// Main content area (center)
const MainContentArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 20px;
`;

const HeroSection = styled.div`
  max-width: 800px;
  width: 100%;
  background: rgba(61, 82, 160, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  margin: 0 auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  h1 {
    font-size: 3rem;
    font-weight: 700;
    color: white;
    margin-bottom: 20px;
    line-height: 1.2;
    text-align: center;
  }
  
  p {
    font-size: 1.25rem;
    color: #EDE8F5;
    line-height: 1.7;
    text-align: center;
    margin-bottom: 30px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  @media (max-width: 768px) {
    padding: 30px;
    
    h1 {
      font-size: 2.5rem;
    }
    
    p {
      font-size: 1.1rem;
    }
  }
`;

const ColoredSpan = styled.span`
  display: block;
  color: #7091E6;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const StyledButton = styled.button`
  padding: 14px 35px;
  background-color: ${props => props.primary ? '#3D52A0' : '#7091E6'};
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  
  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    background-color: ${props => props.primary ? '#4A63B8' : '#8697C4'};
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 20px;
  }
`;

// New scroll down button
const ScrollDownButton = styled.button`
  background: none;
  border: none;
  color: #EDE8F5;
  font-size: 1rem;
  margin-top: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  opacity: 0.8;
  transition: all 0.3s ease;
  margin-left: auto;
  margin-right: auto;
  
  &:hover {
    opacity: 1;
    transform: translateY(3px);
  }
`;

const ScrollIcon = styled.span`
  font-size: 1.2rem;
  animation: bounce 2s infinite;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

// Feature section styling
const FeatureSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 0 40px;
  margin: 100px auto 50px auto; /* Increased top margin */
  max-width: 1200px;
  width: 100%;
  
  @media (max-width: 1024px) {
    gap: 20px;
    padding: 0 20px;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
`;

const FeatureCard = styled.div`
  background: rgba(61, 82, 160, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 1024px) {
    padding: 20px;
  }
  
  @media (max-width: 768px) {
    max-width: 350px;
  }
`;

const IconWrapper = styled.div`
  background: rgba(61, 82, 160, 0.3);
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;

const FeatureTitle = styled.h3`
  color: white;
  font-size: 1.3rem;
  margin: 10px 0;
`;

const FeatureText = styled.p`
  color: #ADBBDA;
  font-size: 0.95rem;
  line-height: 1.6;
`;

export default LandingPage;