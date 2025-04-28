import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/Logo.png";
import { motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <Nav scrolled={scrolled}>
        {/* Left Section: Logo */}
        <LogoContainer>
          <Link to="/">
            <Logo 
              src={logo} 
              alt="EpilepTech" 
              as={motion.img}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
          </Link>
        </LogoContainer>

        {/* Desktop Navigation Links */}
        <NavLinks>
          <NavItem>
            <StyledLink 
              to="/" 
              $active={location.pathname === '/'}
            >
              <LinkText
                as={motion.div}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                Home
              </LinkText>
            </StyledLink>
          </NavItem>
          <NavItem>
            <StyledLink 
              to="/services" 
              $active={location.pathname === '/services'}
            >
              <LinkText
                as={motion.div}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                Services
              </LinkText>
            </StyledLink>
          </NavItem>
          <NavItem>
            <StyledLink 
              to="/ai" 
              $active={location.pathname === '/ai'}
            >
              <AILink
                as={motion.div}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <AIIcon>⚡</AIIcon> AI
              </AILink>
            </StyledLink>
          </NavItem>
          <NavItem>
            <StyledLink 
              to="/resources" 
              $active={location.pathname === '/resources'}
            >
              <LinkText
                as={motion.div}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                Resources
              </LinkText>
            </StyledLink>
          </NavItem>
          <NavItem>
            <StyledLink 
              to="/contact" 
              $active={location.pathname === '/contact'}
            >
              <LinkText
                as={motion.div}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                Contact
              </LinkText>
            </StyledLink>
          </NavItem>
        </NavLinks>

        {/* Mobile Menu Toggle Button */}
        <MobileMenuToggle onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </MobileMenuToggle>
      </Nav>

      {/* Mobile Navigation Menu - Separate from Nav to ensure full-screen */}
      <MobileNavLinks $isOpen={mobileMenuOpen}>
        <MobileNavItem>
          <MobileStyledLink 
            to="/" 
            $active={location.pathname === '/'}
          >
            Home
          </MobileStyledLink>
        </MobileNavItem>
        <MobileNavItem>
          <MobileStyledLink 
            to="/services" 
            $active={location.pathname === '/services'}
          >
            Services
          </MobileStyledLink>
        </MobileNavItem>
        <MobileNavItem>
          <MobileStyledLink 
            to="/ai" 
            $active={location.pathname === '/ai'}
          >
            <MobileAILink>
              <AIIcon>⚡</AIIcon> AI
            </MobileAILink>
          </MobileStyledLink>
        </MobileNavItem>
        <MobileNavItem>
          <MobileStyledLink 
            to="/resources" 
            $active={location.pathname === '/resources'}
          >
            Resources
          </MobileStyledLink>
        </MobileNavItem>
        <MobileNavItem>
          <MobileStyledLink 
            to="/contact" 
            $active={location.pathname === '/contact'}
          >
            Contact
          </MobileStyledLink>
        </MobileNavItem>
      </MobileNavLinks>
    </>
  );
};

// Styled Components
const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: rgba(245, 245, 250, 0.95);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.08);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 60px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  @media (min-width: 768px) {
    padding: 0 30px;
    height: 70px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const Logo = styled.img`
  height: 35px;
  display: block;
  cursor: pointer;
  
  @media (min-width: 768px) {
    height: 40px;
  }
`;

// Navigation Links - Visible on desktop, hidden on mobile
const NavLinks = styled.div`
  display: none;
  
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 25px;
    height: 100%;
  }
  
  @media (min-width: 1024px) {
    gap: 35px;
  }
`;

const NavItem = styled.div`
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  height: 100%;
  
  @media (min-width: 1024px) {
    font-size: 16px;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.$active ? '#3D52A0' : '#333'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 5px;
  position: relative;
  
  &:hover {
    color: #3D52A0;
  }
  
  &:after {
    content: '';
    position: absolute;
    width: ${props => props.$active ? '100%' : '0'};
    height: 3px;
    bottom: -5px;
    left: 0;
    background-color: #3D52A0;
    transition: width 0.3s ease;
    border-radius: 2px;
  }
  
  &:hover:after {
    width: 100%;
  }
`;

const LinkText = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const AILink = styled.span`
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, rgba(61, 82, 160, 0.1) 0%, rgba(112, 145, 230, 0.2) 100%);
  padding: 8px 15px;
  border-radius: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, rgba(61, 82, 160, 0.15) 0%, rgba(112, 145, 230, 0.25) 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(61, 82, 160, 0.15);
  }
`;

const AIIcon = styled.span`
  margin-right: 5px;
  font-size: 14px;
`;

// Mobile Navigation
const MobileMenuToggle = styled.button`
  display: block;
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  z-index: 1001;
  padding: 10px;
  margin-right: -10px;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

// Mobile Nav Links - Positioned outside the main nav to allow full screen overlay
const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(245, 245, 250, 0.98);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding-top: 80px;
  z-index: 999;
  transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.3s ease-in-out;
  align-items: center;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileNavItem = styled.div`
  margin: 10px 0;
  width: 80%;
  text-align: center;
`;

const MobileStyledLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.$active ? '#3D52A0' : '#333'};
  font-size: 18px;
  font-weight: 600;
  padding: 15px 0;
  display: block;
  transition: all 0.3s ease;
  border-radius: 8px;
  
  &:hover, &:active {
    color: #3D52A0;
  }
`;

const MobileAILink = styled.span`
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, rgba(61, 82, 160, 0.1) 0%, rgba(112, 145, 230, 0.2) 100%);
  padding: 8px 15px;
  border-radius: 15px;
`;

export default Navbar;