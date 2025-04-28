import React, { useRef } from "react";
import styled, { keyframes } from "styled-components";
import { FaRobot, FaBrain, FaChartLine, FaNetworkWired, FaDatabase, FaUserMd, FaRocket, FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";

const AIPage = () => {
  const featuresRef = useRef(null);
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <PageContainer>
      <HeroSection>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroContent>
            <RocketIcon><FaRocket size={40} /></RocketIcon>
            <Title>Powering Healthcare with AI</Title>
            <Subtitle>
              We train state-of-the-art AI models to provide the best results for epilepsy diagnosis and patient care.
            </Subtitle>
            <LearnMoreButton onClick={scrollToFeatures}>
              Learn More <FaChevronDown style={{ marginLeft: '8px' }} />
            </LearnMoreButton>
          </HeroContent>
        </motion.div>
      </HeroSection>

      <FeaturesSection ref={featuresRef}>
        <AnimationContainer>
          <RobotIcon />
        </AnimationContainer>

        <FeaturesGrid>
        <FeatureCard
          as={motion.div}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <IconContainer color="#3D52A0">
            <FaBrain size={40} />
          </IconContainer>
          <h3>Deep Learning Analysis</h3>
          <p>Our AI uses advanced deep learning to analyze EEG patterns for accurate epilepsy detection and differentiating between epileptic seizures and PNES.</p>
        </FeatureCard>

        <FeatureCard
          as={motion.div}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <IconContainer color="#E67E22">
            <FaRobot size={40} />
          </IconContainer>
          <h3>AI Chatbot Support</h3>
          <p>Instant AI-powered chatbot for patient guidance and doctor assistance with 24/7 availability and medical expertise.</p>
        </FeatureCard>

        <FeatureCard
          as={motion.div}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <IconContainer color="#27AE60">
            <FaChartLine size={40} />
          </IconContainer>
          <h3>High Accuracy</h3>
          <p>Trained on thousands of EEG scans, our AI delivers precise results with diagnostic accuracy rates approaching those of expert neurologists.</p>
        </FeatureCard>

        <FeatureCard
          as={motion.div}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <IconContainer color="#8E44AD">
            <FaNetworkWired size={40} />
          </IconContainer>
          <h3>Neural Networks</h3>
          <p>Utilizing sophisticated convolutional and recurrent neural networks to capture both spatial and temporal patterns in EEG signals.</p>
        </FeatureCard>

        <FeatureCard
          as={motion.div}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <IconContainer color="#1ABC9C">
            <FaDatabase size={40} />
          </IconContainer>
          <h3>Extensive Training</h3>
          <p>Our models are continuously trained on expanding datasets from multiple sources to ensure robust performance across diverse patient populations.</p>
        </FeatureCard>

        <FeatureCard
          as={motion.div}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <IconContainer color="#C0392B">
            <FaUserMd size={40} />
          </IconContainer>
          <h3>Human-AI Collaboration</h3>
          <p>Our system combines AI capabilities with medical expertise, providing doctors with AI-powered insights while maintaining human oversight.</p>
        </FeatureCard>
      </FeaturesGrid>

  </FeaturesSection>
      <TechSection>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <TechTitle>Our AI Technology</TechTitle>
          <TechDescription>
            We combine state-of-the-art deep learning models including Convolutional Neural Networks (CNNs), 
            Long Short-Term Memory Networks (LSTMs), and Graph Neural Networks (GNNs) to accurately analyze EEG data 
            and provide reliable seizure classification and predictions.
          </TechDescription>
        </motion.div>
      </TechSection>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8f9fa, #ede8f5);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  text-align: center;
  overflow-x: hidden;
`;

const HeroSection = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #f8f9fa, #ede8f5);
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  padding: 0 20px;
`;

const RocketIcon = styled.div`
  color: #3d52a0;
  margin-bottom: 20px;
  animation: ${keyframes`
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  `} 3s infinite ease-in-out;
`;

const Title = styled.h1`
  font-size: 48px;
  color: #3d52a0;
  margin-bottom: 15px;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: #555;
  max-width: 700px;
  margin: 0 auto 40px auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const LearnMoreButton = styled.button`
  background: #3d52a0;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  margin-top: 20px;
  box-shadow: 0 4px 10px rgba(61, 82, 160, 0.3);
  
  &:hover {
    background: #7091E6;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(61, 82, 160, 0.4);
  }
`;

const FeaturesSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
`;

const AnimationContainer = styled.div`
  width: 120px;
  height: 120px;
  margin-bottom: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const moveRobot = keyframes`
  0% { transform: translateY(0) rotate(0); }
  25% { transform: translateY(-15px) rotate(5deg); }
  50% { transform: translateY(0) rotate(0); }
  75% { transform: translateY(-5px) rotate(-5deg); }
  100% { transform: translateY(0) rotate(0); }
`;

const RobotIcon = styled(FaRobot)`
  font-size: 100px;
  color: #3d52a0;
  animation: ${moveRobot} 3s infinite ease-in-out;
  filter: drop-shadow(0 5px 15px rgba(61, 82, 160, 0.3));
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  justify-content: center;
  align-items: stretch;
  max-width: 1200px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
`;

const FeatureCard = styled.div`
  background: white;
  padding: 35px 30px;
  border-radius: 16px;
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  height: 100%;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0px 15px 35px rgba(0, 0, 0, 0.15);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color || "#3D52A0"};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }

  h3 {
    margin-top: 25px;
    font-size: 22px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 15px;
  }

  p {
    font-size: 16px;
    color: #555;
    line-height: 1.6;
    flex-grow: 1;
  }
`;

const IconContainer = styled.div`
  background: ${(props) => props.color || "#3D52A0"};
  padding: 25px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
`;

const TechSection = styled.div`
  background: rgba(61, 82, 160, 0.05);
  width: 100%;
  padding: 70px 20px;
  margin-top: 80px;
  text-align: center;
`;

const TechTitle = styled.h2`
  font-size: 32px;
  color: #3D52A0;
  margin: 0 0 20px 0;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const TechDescription = styled.p`
  font-size: 18px;
  color: #555;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.7;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export default AIPage;