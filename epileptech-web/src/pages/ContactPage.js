import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would normally send the form data to your server
      console.log("Form data submitted:", formData);
      
      // Reset form and show success message
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      // Reset submission status after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }
  };

  return (
    <PageContainer>
      <HeroSection>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle>Contact Us</HeroTitle>
          <HeroSubtitle>
            Get in touch with our team of epilepsy care specialists
          </HeroSubtitle>
        </motion.div>
      </HeroSection>

      <ContentWrapper>
        <ContactSection>
          <ContactInfo>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <InfoTitle>How Can We Help?</InfoTitle>
              <InfoDescription>
                Whether you have questions about our epilepsy diagnostic services, 
                need technical support, or want to explore collaboration opportunities, 
                we're here to assist you.
              </InfoDescription>
              
              <ContactDetailsList>
                <ContactDetailItem>
                  <IconContainer>
                    <FaEnvelope />
                  </IconContainer>
                  <div>
                    <DetailTitle>Email Us</DetailTitle>
                    <DetailText>support@epileptech.com</DetailText>
                  </div>
                </ContactDetailItem>
                
                <ContactDetailItem>
                  <IconContainer>
                    <FaPhone />
                  </IconContainer>
                  <div>
                    <DetailTitle>Call Us</DetailTitle>
                    <DetailText>+966 500 639 438</DetailText>
                  </div>
                </ContactDetailItem>
                
                <ContactDetailItem>
                  <IconContainer>
                    <FaMapMarkerAlt />
                  </IconContainer>
                  <div>
                    <DetailTitle>Visit Us</DetailTitle>
                    <DetailText>Imam Abdulrahman Bin Faisal University, Dammam, Saudi Arabia</DetailText>
                  </div>
                </ContactDetailItem>
              </ContactDetailsList>
            </motion.div>
          </ContactInfo>

          <ContactForm>
            <motion.form
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              onSubmit={handleSubmit}
            >
              {submitted ? (
                <SuccessMessage>
                  <FaCheckCircle size={40} />
                  <h3>Thank you for contacting us!</h3>
                  <p>We've received your message and will get back to you as soon as possible.</p>
                </SuccessMessage>
              ) : (
                <>
                  <FormTitle>Send Us a Message</FormTitle>
                  
                  <FormGroup>
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                    />
                    {errors.name && <ErrorText>{errors.name}</ErrorText>}
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                    />
                    {errors.email && <ErrorText>{errors.email}</ErrorText>}
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      error={errors.subject}
                    />
                    {errors.subject && <ErrorText>{errors.subject}</ErrorText>}
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="message">Your Message</Label>
                    <TextArea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      error={errors.message}
                    />
                    {errors.message && <ErrorText>{errors.message}</ErrorText>}
                  </FormGroup>
                  
                  <SubmitButton type="submit">Send Message</SubmitButton>
                </>
              )}
            </motion.form>
          </ContactForm>
        </ContactSection>
      </ContentWrapper>

      <MapSection>
        <iframe 
          title="EpilepTech Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3567.2911407257124!2d50.02718847607058!3d26.58772887567761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e49ef85c961edaf%3A0x7b2db98f2941c78c!2sImam%20Abdulrahman%20Bin%20Faisal%20University!5e0!3m2!1sen!2ssa!4v1708955806599!5m2!1sen!2ssa" 
          width="100%" 
          height="100%" 
          style={{border: 0}} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade">
        </iframe>
      </MapSection>
    </PageContainer>
  );
};

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

const ContactSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div`
  padding: 50px;
  background: #F5F7FA;
  
  @media (max-width: 768px) {
    padding: 30px;
  }
`;

const InfoTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #3D52A0;
  margin-bottom: 20px;
`;

const InfoDescription = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 30px;
`;

const ContactDetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-top: 40px;
`;

const ContactDetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const IconContainer = styled.div`
  width: 50px;
  height: 50px;
  background: #3D52A0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  flex-shrink: 0;
`;

const DetailTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2C3E50;
  margin: 0 0 5px 0;
`;

const DetailText = styled.p`
  font-size: 16px;
  color: #555;
  margin: 0;
`;

const ContactForm = styled.div`
  padding: 50px;
  
  @media (max-width: 768px) {
    padding: 30px;
  }
`;

const FormTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #3D52A0;
  margin-bottom: 25px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #2C3E50;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid ${props => props.error ? '#e74c3c' : '#ddd'};
  border-radius: 8px;
  font-size: 16px;
  transition: border 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3D52A0;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid ${props => props.error ? '#e74c3c' : '#ddd'};
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  transition: border 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3D52A0;
  }
`;

const ErrorText = styled.span`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
  display: block;
`;

const SubmitButton = styled.button`
  padding: 14px 30px;
  background: #3D52A0;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(61, 82, 160, 0.3);
  margin-top: 10px;
  
  &:hover {
    background: #7091E6;
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(61, 82, 160, 0.4);
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #27AE60;
  
  h3 {
    font-size: 24px;
    margin: 15px 0;
    color: #2C3E50;
  }
  
  p {
    font-size: 16px;
    color: #555;
  }
`;

const MapSection = styled.div`
  width: 100%;
  height: 450px;
  margin-bottom: -6px; /* Remove gap at bottom of map */
`;

export default ContactPage;