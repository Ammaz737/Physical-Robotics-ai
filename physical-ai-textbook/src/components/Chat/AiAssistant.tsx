import React, { useState, useRef, useEffect } from 'react';
import styles from './AiAssistant.module.css';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

      const handleSendMessage = async (messageText: string) => {
      if (messageText.trim() === '') return;
  
      const newUserMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: messageText,
      };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setInput('');
  
      const token = localStorage.getItem('access_token');
      if (!token) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'You need to be logged in to chat with the AI Assistant.',
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        return;
      }
  
      try {
        const response = await fetch('http://127.0.0.1:8000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Add Authorization header
          },
          body: JSON.stringify({ query: messageText }),
        });
  
        if (!response.ok) {
          let errorDetail = 'Unknown error';
          if (response.status === 401) {
            errorDetail = 'Your session has expired. Please log in again.';
          } else {
            try {
              const errorData = await response.json();
              if (errorData.detail) {
                errorDetail = errorData.detail;
              } else if (errorData.response) {
                errorDetail = errorData.response;
              }
            } catch (jsonError) {
              errorDetail = response.statusText || 'Could not parse error response from server.';
            }
          }
          throw new Error(`Backend error: ${response.status} - ${errorDetail}`);
        }
  
        const data = await response.json();
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.response,
        };
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
      } catch (error) {
        console.error('Error:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `Sorry, I encountered an error: ${error.message || 'Could not connect to the brain.'}`,
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    };
  return (
    <div className={styles.chatWrapper}>
      <button 
        className={styles.launcher} 
        onClick={() => setIsOpen(!isOpen)}
      >
        💬 AI Assistant
      </button>

      {isOpen && (
        <div className={styles.chatContainer}>
          <div className={styles.header}>
            <h3>AI Research Assistant</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className={styles.messagesDisplay}>
            {messages.map((message) => (
              <div key={message.id} className={`${styles.message} ${styles[message.sender]}`}>
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
              placeholder="Ask about the book..."
              className={styles.chatInput}
            />
            <button onClick={() => handleSendMessage(input)} className={styles.sendButton}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAssistant;