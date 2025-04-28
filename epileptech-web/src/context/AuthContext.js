import React, { createContext, useState, useEffect, useContext } from "react";

// Create the authentication context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  // Initialize doctor authentication state from localStorage
  const [doctorAuth, setDoctorAuth] = useState(() => {
    const savedData = localStorage.getItem("doctorAuth");
    return savedData ? JSON.parse(savedData) : { isAuthenticated: false, username: null };
  });
  
  // Initialize patient authentication state from localStorage
  const [patientAuth, setPatientAuth] = useState(() => {
    const savedData = localStorage.getItem("patientAuth");
    return savedData ? JSON.parse(savedData) : { isAuthenticated: false, username: null };
  });

  // Doctor login function
  const doctorLogin = (userData) => {
    const authData = { isAuthenticated: true, username: userData.username };
    setDoctorAuth(authData);
    localStorage.setItem("doctorAuth", JSON.stringify(authData));
  };

  // Patient login function
  const patientLogin = (userData) => {
    const authData = { isAuthenticated: true, username: userData.username };
    setPatientAuth(authData);
    localStorage.setItem("patientAuth", JSON.stringify(authData));
  };

  // Doctor logout function
  const doctorLogout = () => {
    setDoctorAuth({ isAuthenticated: false, username: null });
    localStorage.removeItem("doctorAuth");
  };

  // Patient logout function
  const patientLogout = () => {
    setPatientAuth({ isAuthenticated: false, username: null });
    localStorage.removeItem("patientAuth");
  };

  // Values to be provided to consumers
  const value = {
    doctorAuth,
    patientAuth,
    doctorLogin,
    patientLogin,
    doctorLogout,
    patientLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;