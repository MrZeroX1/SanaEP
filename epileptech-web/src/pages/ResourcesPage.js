import React from "react";
import styled from "styled-components";
import { FaBookOpen, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const ResourcesPage = () => {
  return (
    <PageContainer>
      <ContentWrapper>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Title>📚 Research & Resources</Title>
          <Subtitle>Explore our latest research papers, AI studies, and medical documentation.</Subtitle>
        </motion.div>
        
        <ResourceGrid>
          <ResourceCard 
            href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1234567/" 
            target="_blank"
            as={motion.a}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ 
              y: -8, 
              boxShadow: "0px 12px 25px rgba(0, 0, 0, 0.15)"
            }}
          >
            <IconContainer>
              <FaBookOpen size={40} />
            </IconContainer>
            <h3>📄 AI in Epilepsy Diagnosis</h3>
            <p>Our latest research paper on AI-powered EEG analysis for epilepsy detection.</p>
            <ExternalLinkIcon />
          </ResourceCard>
          
          <ResourceCard 
            href="https://arxiv.org/abs/2201.12345" 
            target="_blank"
            as={motion.a}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ 
              y: -8, 
              boxShadow: "0px 12px 25px rgba(0, 0, 0, 0.15)"
            }}
          >
            <IconContainer>
              <FaBookOpen size={40} />
            </IconContainer>
            <h3>🧠 Deep Learning for EEG</h3>
            <p>How deep learning models improve the accuracy of seizure predictions.</p>
            <ExternalLinkIcon />
          </ResourceCard>
          
          <ResourceCard 
            href="https://www.who.int/publications" 
            target="_blank"
            as={motion.a}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ 
              y: -8, 
              boxShadow: "0px 12px 25px rgba(0, 0, 0, 0.15)"
            }}
          >
            <IconContainer>
              <FaBookOpen size={40} />
            </IconContainer>
            <h3>🌍 WHO Guidelines</h3>
            <p>World Health Organization (WHO) reports on epilepsy treatments & AI research.</p>
            <ExternalLinkIcon />
          </ResourceCard>
        </ResourceGrid>
      </ContentWrapper>
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
  padding: 80px 20px;
  text-align: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
`;

const Title = styled.h1`
  font-size: 42px;
  color: #3d52a0;
  margin-bottom: 12px;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: #555;
  max-width: 700px;
  margin: 0 auto 50px auto;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 40px;
  }
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  max-width: 1100px;
  margin: 0 auto;
`;

const ResourceCard = styled.a`
  background: white;
  padding: 30px 25px;
  border-radius: 16px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: #3d52a0;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &:hover::before {
    transform: scaleX(1);
  }

  h3 {
    margin-top: 20px;
    font-size: 22px;
    font-weight: 700;
    color: #2c3e50;
  }

  p {
    font-size: 16px;
    color: #555;
    margin-top: 15px;
    line-height: 1.6;
  }
`;

const IconContainer = styled.div`
  background: #3d52a0;
  padding: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 20px rgba(61, 82, 160, 0.2);
`;

const ExternalLinkIcon = styled(FaExternalLinkAlt)`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 20px;
  color: #3d52a0;
  transition: transform 0.3s ease;
  
  ${ResourceCard}:hover & {
    transform: translateY(-3px);
  }
`;

export default ResourcesPage;