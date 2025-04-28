import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { 
  FaRobot, 
  FaRegPaperPlane, 
  FaRegLightbulb, 
  FaBrain, 
  FaPills,
  FaInfoCircle,
  FaChevronDown
} from "react-icons/fa";

// API endpoint for the chatbot - using relative path with proxy
const API_ENDPOINT = "/api/chatbot/chat";

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "system",
      text: "Hi John, I'm your AI health assistant. I can help answer questions about epilepsy, medications, and your treatment plan. How can I help you today?"
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Mock suggested questions - expanded with more relevant options
  const suggestedQuestions = [
    { 
      id: 1, 
      text: "What are common side effects of Levetiracetam?",
      icon: <FaPills /> 
    },
    { 
      id: 2, 
      text: "How should I prepare for my EEG appointment?",
      icon: <FaBrain /> 
    },
    {
      id: 3,
      text: "What lifestyle changes can help with epilepsy?",
      icon: <FaRegLightbulb />
    },
    {
      id: 4,
      text: "What's the difference between epileptic and psychogenic seizures?",
      icon: <FaInfoCircle />
    }
  ];
  
  // Function to call the OpenAI API through our Flask backend
  const callOpenAI = async (userMessage) => {
    console.log("Sending message to OpenAI API:", userMessage);
    setIsTyping(true);
    setError(null);
    
    try {
      // For debugging - log the request
      console.log("API Request:", {
        url: API_ENDPOINT,
        method: "POST",
        body: { message: userMessage }
      });
      
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any authentication headers if needed
          // "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ message: userMessage }),
        credentials: "include" // Include cookies for session authentication
      });
      
      // For debugging - log the response status
      console.log("API Response Status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Failed to get response from AI assistant");
      }
      
      const data = await response.json();
      
      // For debugging - log the response data
      console.log("API Response Data:", data);
      
      return data.reply;
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      setError(error.message);
      return "I'm sorry, I encountered an error. Please try again later.";
    } finally {
      setIsTyping(false);
    }
  };
  
  // Helper function to simulate AI response with better responses
  const simulateResponse = (userMessage) => {
    setIsTyping(true);
    
    // Simulate network delay
    setTimeout(() => {
      let response = "";
      const lowerCaseMsg = userMessage.toLowerCase();
      
      if (lowerCaseMsg.includes("side effect") || lowerCaseMsg.includes("levetiracetam")) {
        response = "Common side effects of Levetiracetam (Keppra) include:\n\n• Drowsiness and fatigue (20-30% of patients)\n• Dizziness\n• Mood changes or irritability (sometimes called 'Keppra rage')\n• Headache\n• Weakness\n• Coordination problems\n\nMost side effects are mild and may decrease over time. If you're experiencing severe side effects, please contact Dr. Sana Araj right away for guidance.";
      } else if (lowerCaseMsg.includes("eeg") || lowerCaseMsg.includes("appointment")) {
        response = "To prepare for your upcoming EEG appointment:\n\n1. Wash your hair the night before and don't use hair products\n2. Continue taking your medications unless Dr. Araj instructs otherwise\n3. Avoid caffeine for 6-8 hours before the test\n4. Get a good night's sleep if possible (some EEGs require sleep deprivation, but your doctor will tell you if this applies)\n5. Eat normally but avoid heavy meals\n\nThe procedure is painless and usually takes 60-90 minutes.";
      } else if (lowerCaseMsg.includes("lifestyle") || lowerCaseMsg.includes("change")) {
        response = "Lifestyle changes that can help manage epilepsy include:\n\n• Maintaining consistent sleep patterns (aim for 7-8 hours nightly)\n• Stress management through meditation, yoga, or breathing exercises\n• Regular physical activity (with appropriate precautions)\n• Consistent meal timing to avoid low blood sugar\n• Limiting or avoiding alcohol\n• Staying well-hydrated\n• Taking medications exactly as prescribed\n• Using a seizure diary to identify potential triggers\n\nYour next appointment with Dr. Araj is scheduled for March 5th, where you can discuss which of these might be most beneficial for your specific situation.";
      } else if (lowerCaseMsg.includes("difference") || lowerCaseMsg.includes("psychogenic") || lowerCaseMsg.includes("pnes")) {
        response = "Epileptic seizures and psychogenic non-epileptic seizures (PNES) can look similar but have different causes:\n\n• Epileptic seizures are caused by abnormal electrical activity in the brain\n• Psychogenic seizures are related to psychological factors and don't involve abnormal electrical activity\n\nSome differences that might be observed:\n• Duration (PNES often last longer)\n• Response to anti-seizure medications (PNES typically don't respond)\n• EEG readings during events (normal in PNES)\n\nBoth conditions require proper treatment, and our team at EpilepTech specializes in correctly diagnosing and developing appropriate treatment plans for both epileptic and psychogenic seizures.";
      } else {
        response = "Thank you for your question. While I can provide general information about epilepsy and seizure disorders, I recommend discussing your specific medical concerns with Dr. Araj at your next appointment. Would you like me to provide some general information about seizure management or suggest some specific questions to ask during your visit?";
      }
      
      setMessages(prev => [
        ...prev, 
        {
          id: prev.length + 1,
          type: "assistant",
          text: response
        }
      ]);
      
      setIsTyping(false);
    }, 1500);
  };
  
  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      text: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Call the OpenAI API instead of simulating a response
    try {
      const aiResponse = await callOpenAI(input);
      
      setMessages(prev => [
        ...prev, 
        {
          id: prev.length + 1,
          type: "assistant",
          text: aiResponse
        }
      ]);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      setError(error.message);
    }
  };
  
  // Handle clicking a suggested question
  const handleSuggestionClick = async (question) => {
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      text: question.text
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Call the OpenAI API instead of simulating a response
    try {
      const aiResponse = await callOpenAI(question.text);
      
      setMessages(prev => [
        ...prev, 
        {
          id: prev.length + 1,
          type: "assistant",
          text: aiResponse
        }
      ]);
    } catch (error) {
      console.error("Error in handleSuggestionClick:", error);
      setError(error.message);
    }
    
    // Hide suggestions after clicking one
    setShowSuggestions(false);
  };
  
  // Focus on input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Toggle disclaimer section
  const toggleDisclaimer = () => {
    setDisclaimerOpen(!disclaimerOpen);
  };
  
  return (
    <Container>
      <ChatHeader>
        <IconContainer>
          <FaRobot size={28} />
        </IconContainer>
        <div>
          <HeaderTitle>EpilepTech AI Assistant</HeaderTitle>
          <HeaderSubtitle>
            Your personal guide for epilepsy and seizure management
          </HeaderSubtitle>
        </div>
      </ChatHeader>
      
      <ChatContainer>
        <MessageContainer>
          {messages.map(message => (
            <MessageBubble 
              key={message.id} 
              isUser={message.type === "user"}
              isSystem={message.type === "system"}
            >
              {message.type === "assistant" && (
                <MessageIcon isUser={false}>
                  <FaRobot size={16} />
                </MessageIcon>
              )}
              
              {message.type === "user" && (
                <MessageIcon isUser={true}>
                  <UserInitial>J</UserInitial>
                </MessageIcon>
              )}
              
              <MessageContent 
                isUser={message.type === "user"}
                isSystem={message.type === "system"}
              >
                {message.text}
              </MessageContent>
            </MessageBubble>
          ))}
          
          {isTyping && (
            <MessageBubble isUser={false}>
              <MessageIcon isUser={false}>
                <FaRobot size={16} />
              </MessageIcon>
              <MessageContent isUser={false}>
                <TypingIndicator>
                  <TypingDot />
                  <TypingDot />
                  <TypingDot />
                </TypingIndicator>
              </MessageContent>
            </MessageBubble>
          )}
          
          {error && (
            <ErrorMessage>
              Error: {error}
            </ErrorMessage>
          )}
          
          <div ref={messagesEndRef} />
        </MessageContainer>
        
        {showSuggestions && messages.length < 2 && (
          <SuggestionsContainer>
            <SuggestionsLabel>Common questions:</SuggestionsLabel>
            <SuggestionsList>
              {suggestedQuestions.map(question => (
                <SuggestionItem 
                  key={question.id}
                  onClick={() => handleSuggestionClick(question)}
                >
                  <SuggestionIcon>{question.icon}</SuggestionIcon>
                  <SuggestionText>{question.text}</SuggestionText>
                </SuggestionItem>
              ))}
            </SuggestionsList>
          </SuggestionsContainer>
        )}
        
        <ComposeForm onSubmit={handleSendMessage}>
          <MessageInput 
            ref={inputRef}
            type="text" 
            placeholder="Type your question here..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <SendButton type="submit" disabled={!input.trim() || isTyping}>
            <FaRegPaperPlane />
          </SendButton>
        </ComposeForm>
      </ChatContainer>
      
      <DisclaimerSection>
        <DisclaimerTitle onClick={toggleDisclaimer}>
          <span>Medical Information & Privacy Notice</span>
          <FaChevronDown style={{ transform: disclaimerOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
        </DisclaimerTitle>
        <DisclaimerContent open={disclaimerOpen}>
          <p>This AI assistant provides general information about epilepsy and seizure management based on your treatment plan. It is not a substitute for professional medical advice from Dr. Sana Araj or other healthcare providers.</p>
          <p>All information shared with this assistant is secured according to HIPAA standards and integrated with your patient records. Your conversation history may be used to improve your care plan during consultations.</p>
          <p>In case of emergency, please call emergency services or go to the nearest emergency room immediately.</p>
        </DisclaimerContent>
      </DisclaimerSection>
    </Container>
  );
};

// Improved Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: calc(100vh - 130px);
  min-height: 600px;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
`;

const IconContainer = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4361EE, #3A0CA3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0px 4px 10px rgba(67, 97, 238, 0.3);
`;

const HeaderTitle = styled.h2`
  margin: 0 0 4px 0;
  font-size: 18px;
  color: #2A3B75;
  font-weight: 600;
`;

const HeaderSubtitle = styled.div`
  font-size: 14px;
  color: #7B8794;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  flex-grow: 1;
  overflow: hidden;
`;

const MessageContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-right: 8px;
  margin-bottom: 16px;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c5d0e6;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a9b6d4;
  }
`;

const MessageBubble = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 85%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  flex-direction: ${props => props.isUser ? 'row-reverse' : 'row'};
  
  ${props => props.isSystem && `
    align-self: center;
    max-width: 90%;
  `}
`;

const MessageIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.isUser ? 
    'linear-gradient(135deg, #3D52A0, #2A3B75)' : 
    'linear-gradient(135deg, #4361EE, #3A0CA3)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

const UserInitial = styled.div`
  font-weight: 600;
  font-size: 16px;
`;

const MessageContent = styled.div`
  padding: 14px 18px;
  background: ${props => {
    if (props.isSystem) return '#F8F9FB';
    return props.isUser ? 'linear-gradient(135deg, #3D52A0, #2A3B75)' : '#F0F4FD';
  }};
  color: ${props => props.isUser ? 'white' : '#2c3e50'};
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.5;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05);
  border-top-right-radius: ${props => props.isUser ? '4px' : '18px'};
  border-top-left-radius: ${props => !props.isUser ? '4px' : '18px'};
  white-space: pre-line;
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TypingDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #7B8794;
  animation: typing-animation 1.4s infinite ease-in-out both;
  
  &:nth-child(1) {
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes typing-animation {
    0%, 80%, 100% {
      transform: scale(0.6);
      opacity: 0.6;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const SuggestionsContainer = styled.div`
  margin-bottom: 20px;
`;

const SuggestionsLabel = styled.div`
  font-size: 14px;
  color: #7B8794;
  margin-bottom: 10px;
  font-weight: 500;
`;

const SuggestionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SuggestionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #F0F4FD;
  border-radius: 20px;
  color: #3D52A0;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #E0E6F5;
  
  &:hover {
    background: #E0E6F5;
    transform: translateY(-2px);
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.08);
  }
`;

const SuggestionIcon = styled.div`
  display: flex;
  align-items: center;
  color: #4361EE;
`;

const SuggestionText = styled.div``;

const ComposeForm = styled.form`
  display: flex;
  gap: 10px;
  margin-top: auto;
`;

const MessageInput = styled.input`
  flex-grow: 1;
  padding: 14px 20px;
  border: 1px solid #E0E6F5;
  border-radius: 24px;
  font-size: 15px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #4361EE;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
  }
  
  &:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4361EE, #3A0CA3);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0px 3px 8px rgba(67, 97, 238, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0px 5px 12px rgba(67, 97, 238, 0.4);
  }
  
  &:disabled {
    background: #E0E6F5;
    color: #7B8794;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const DisclaimerSection = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
`;

const DisclaimerTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  color: #2A3B75;
  font-weight: 500;
  cursor: pointer;
  
  svg {
    color: #7B8794;
  }
`;

const DisclaimerContent = styled.div`
  padding: ${props => props.open ? '0 20px 16px 20px' : '0 20px'};
  color: #7B8794;
  font-size: 14px;
  line-height: 1.6;
  max-height: ${props => props.open ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  
  p {
    margin: 0 0 10px 0;
  }
`;

const ErrorMessage = styled.div`
  padding: 10px;
  background: #FFE0E0;
  border-radius: 8px;
  color: #D00;
  font-size: 14px;
  margin-bottom: 16px;
`;

export default AIAssistant;