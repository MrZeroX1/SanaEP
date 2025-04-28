import React, { createContext, useState, useContext } from 'react';

// Initial mock data
const initialData = [
  {
    id: "EEG-2845",
    patient: {
      firstName: "John",
      lastName: "Davis",
      age: 45,
      gender: "Male"
    },
    date: "2025-03-01T10:30:00",
    status: "completed",
    result: "epileptic",
    confidence: 0.87
  },
  {
    id: "EEG-3102",
    patient: {
      firstName: "Emma",
      lastName: "Wilson",
      age: 32,
      gender: "Female"
    },
    date: "2025-03-02T09:15:00",
    status: "pending"
  },
  {
    id: "EEG-2751",
    patient: {
      firstName: "Robert",
      lastName: "Brown",
      age: 61,
      gender: "Male"
    },
    date: "2025-02-28T14:45:00",
    status: "completed",
    result: "non-epileptic",
    confidence: 0.92
  },
  {
    id: "EEG-2984",
    patient: {
      firstName: "Maria",
      lastName: "Garcia",
      age: 28,
      gender: "Female"
    },
    date: "2025-02-27T11:20:00",
    status: "completed",
    result: "psychogenic", // Changed from "inconclusive" to "psychogenic"
    confidence: 0.56
  },
  {
    id: "EEG-3015",
    patient: {
      firstName: "David",
      lastName: "Kim",
      age: 37,
      gender: "Male"
    },
    date: "2025-03-02T08:30:00",
    status: "pending"
  }
];

// Create context
const EEGDataContext = createContext();

// Create provider component
export const EEGDataProvider = ({ children }) => {
  const [eegData, setEEGData] = useState(initialData);

  // Add a new EEG case
  const addEEGCase = (newCase) => {
    setEEGData(prevData => [...prevData, newCase]);
  };

  // Delete an EEG case
  const deleteEEGCase = (id) => {
    setEEGData(prevData => prevData.filter(item => item.id !== id));
  };

  return (
    <EEGDataContext.Provider value={{ eegData, addEEGCase, deleteEEGCase }}>
      {children}
    </EEGDataContext.Provider>
  );
};

// Custom hook for using the EEG data context
export const useEEGData = () => {
  return useContext(EEGDataContext);
};