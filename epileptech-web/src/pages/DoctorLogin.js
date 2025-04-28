import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaArrowLeft, FaUserMd, FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import backgroundVideo from "../assets/vid.mp4";

const DoctorLogin = () => {
  const navigate = useNavigate();
  const { doctorLogin } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (formData.username === "SanaAr" && formData.password === "12345") {
        doctorLogin({ username: formData.username });
        navigate("/doctor/dashboard");
      } else {
        setError("Invalid username or password");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <PageContainer>
      <VideoBackground autoPlay loop muted>
        <source src={backgroundVideo} type="video/mp4" />
      </VideoBackground>
      <Overlay />
      <LoginContainer>
        <LoginCard
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BackButton onClick={() => navigate("/")}>
            <FaArrowLeft /> Back to Home
          </BackButton>

          <LoginHeader>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Doctor Login
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Enter your credentials to access the dashboard
            </motion.p>
          </LoginHeader>

          <FormContainer
            as={motion.form}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
          >
            <InputGroup>
              <InputIcon><FaUserMd /></InputIcon>
              <StyledInput
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <InputIcon><FaLock /></InputIcon>
              <StyledInput
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </InputGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <LoginButton
              type="submit"
              disabled={loading}
              as={motion.button}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Logging in..." : "Login"}
            </LoginButton>
          </FormContainer>
        </LoginCard>
      </LoginContainer>
    </PageContainer>
  );
};

// Styled Components (Matching Patient Login)

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const VideoBackground = styled.video`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.35);
  top: 0;
  left: 0;
  z-index: -2;
`;

const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(135deg, rgba(61, 82, 160, 0.5), rgba(61, 82, 160, 0.3));
  z-index: -1;
`;

const LoginContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  max-width: 420px;
  width: 100%;
  padding: 50px 40px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 50px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
  padding: 8px 16px;
  margin-bottom: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const LoginHeader = styled.div`
  margin-bottom: 35px;

  h2 {
    color: #fff;
    font-size: 2.4rem;
    margin-bottom: 12px;
    font-weight: 700;
  }

  p {
    color: #dcdcdc;
    font-size: 1rem;
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #7091e6;
  font-size: 1.2rem;
  z-index: 1;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 14px 14px 14px 45px;
  box-sizing: border-box;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.95);
  transition: 0.3s;

  &:focus {
    outline: none;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(112, 145, 230, 0.3);
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 14px;
  box-sizing: border-box;
  border-radius: 12px;
  background-color: #7091e6;
  color: white;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
  margin-top: 10px;

  &:hover {
    background-color: #5f7bdc;
    box-shadow: 0 8px 15px rgba(112, 145, 230, 0.25);
  }

  &:disabled {
    background-color: #a9b4d6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.12);
  border-radius: 8px;
  font-size: 0.95rem;
  padding: 10px;
  text-align: center;
  width: 100%;
`;

export default DoctorLogin;
