import React, { useState, useRef, useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import {Link, useNavigate} from 'react-router-dom'
import { 
  CircularProgress, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Tooltip
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'prism-react-renderer';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);
const navigate = useNavigate()
  // Get userId from localStorage when component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } 
  }, []);
  useEffect(() => {
    if(!localStorage.getItem('token')){
      navigate('/login')
    }else{
      
    }
    
  }, []);

  // Load initial message when component mounts
  useEffect(() => {
    if (messages.length === 0 && userId) {
      setMessages([{
        id: 1,
        text: "Hello! I'm your AI study assistant. How can I help you today?",
        sender: 'ai',
        isMarkdown: true
      }]);
    }
  }, [userId]);

  // Load chat history when userId changes
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`http://localhost:5000/api/chat/${userId}`);
        const data = await response.json();
        setChatHistory(data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    
    fetchChatHistory();
  }, [userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load a specific conversation
  const loadConversation = async (conversationId) => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/chat/${userId}/${conversationId}`);
      const data = await response.json();
      setMessages(data);
      setConversationId(conversationId);
      setHistoryDrawerOpen(false);
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new conversation
  const startNewConversation = () => {
    setMessages([{
      id: 1,
      text: "Hello! I'm your AI study assistant. How can I help you today?",
      sender: 'ai',
      isMarkdown: true
    }]);
    setConversationId(null);
    setHistoryDrawerOpen(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !userId) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      isMarkdown: false
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId,
          conversationId,
          prompt: inputValue,
          format: "markdown"
        })
      });

      const data = await response.json();
      const aiMessage = {
        id: Date.now() + 1,
        text: data.reply || "I couldn't process that request.",
        sender: 'ai',
        isMarkdown: true
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Update conversation ID if this is a new conversation
      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
      }
      
      // Refresh chat history
      const historyResponse = await fetch(`http://localhost:5000/api/chat/${userId}`);
      const historyData = await historyResponse.json();
      setChatHistory(historyData);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        // id: Date.now() + 1,
        // text: "Sorry, I encountered an error. Please try again.",
        // sender: 'ai',
        // isMarkdown: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageContent = (message) => {
    if (message.isMarkdown) {
      return (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            h1: ({node, ...props}) => <h5 className="fw-bold mt-3" style={{ color: 'rgb(82,113,255)' }} {...props} />,
            h2: ({node, ...props}) => <h6 className="fw-bold mt-3" style={{ color: 'rgb(82,113,255)' }} {...props} />,
            ul: ({node, ...props}) => <ul className="mb-2 ps-3" {...props} />,
            ol: ({node, ...props}) => <ol className="mb-2 ps-3" {...props} />,
            li: ({node, ...props}) => <li className="mb-1" {...props} />,
            table: ({node, ...props}) => (
              <div className="table-responsive">
                <table className="table table-bordered" style={{ borderColor: 'rgb(82,113,255)' }} {...props} />
              </div>
            ),
          }}
        >
          {message.text}
        </ReactMarkdown>
      );
    }
    return <p className="mb-0 text-dark" style={{ color: 'rgb(82,113,255)' }}>{message.text}</p>;
  };

  return (
    <div className="d-flex flex-column" style={{ height: '100vh', width: '100vw' }}>
      {/* Header - Fixed at top */}
      <div className="text-white p-3 d-flex align-items-center shadow-sm" style={{ backgroundColor: 'rgb(82,113,255)' }}>
        <Tooltip title="Chat History">
          <IconButton color="inherit" onClick={() => setHistoryDrawerOpen(true)}>
            <HistoryIcon />
          </IconButton>
        </Tooltip>
        <SmartToyIcon className="me-2" />
        <h5 className="mb-0 flex-grow-1">Study Assistant</h5>
        {conversationId && (
          <small className="text-white-50">Conversation ID: {conversationId.substring(0, 8)}...</small>
        )}
      </div>

      {/* Chat History Drawer */}
      <Drawer
        anchor="left"
        open={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
      >
        <div style={{ width: 300 }}>
          <div className="p-3 d-flex align-items-center" style={{ backgroundColor: 'rgb(82,113,255)', color: 'white' }}>
            <SmartToyIcon className="me-2" />
            <h5 className="mb-0">Chat History</h5>
          </div>
          <List>
            <ListItem button onClick={startNewConversation} className="bg-light">
              <ListItemText 
                primary="Start New Chat" 
                primaryTypographyProps={{ fontWeight: 'bold', color: 'rgb(82,113,255)' }}
              />
            </ListItem>
            <Divider />
            {chatHistory.length > 0 ? (
              chatHistory
                .filter((value, index, self) => 
                  index === self.findIndex((t) => t.conversationId === value.conversationId)
                )
                .map((conversation) => (
                  <ListItem 
                    key={conversation.conversationId} 
                    button 
                    onClick={() => loadConversation(conversation.conversationId)}
                  >
                    <ListItemText 
                      primary={conversation.message.substring(0, 30) + (conversation.message.length > 30 ? '...' : '')}
                      secondary={new Date(conversation.timestamp).toLocaleString()}
                    />
                  </ListItem>
                ))
            ) : (
              <ListItem>
                <ListItemText secondary="No chat history available" />
              </ListItem>
            )}
          </List>
        </div>
      </Drawer>

      {/* Chat Container - Takes remaining space */}
      <div className="flex-grow-1 d-flex flex-column" style={{ overflow: 'hidden' }}>
        {/* Messages - Scrollable area */}
        <div className="flex-grow-1 overflow-auto p-3 bg-light">
          {messages.length === 0 && (
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="text-center">
                <SmartToyIcon style={{ fontSize: 60, color: 'rgb(82,113,255)' }} />
                <h4 className="mt-3">Welcome to Study Assistant</h4>
                <p>Start a new conversation or load one from your history</p>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div key={message.id} className={`d-flex mb-3 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
              <div className={`d-flex align-items-end ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`rounded-circle d-flex align-items-center justify-content-center me-2 ms-2 text-white`} 
                     style={{ width: '32px', height: '32px', backgroundColor: 'rgb(82,113,255)' }}>
                  {message.sender === 'user' ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
                </div>
                <div className={`p-3 rounded-3 ${message.sender === 'user' ? 'rounded-end-0' : 'rounded-start-0'}`} 
                     style={{ 
                       maxWidth: '80%',
                       backgroundColor: message.sender === 'user' ? 'rgba(82,113,255,0.1)' : 'rgba(82,113,255,0.1)',
                       borderColor: 'rgb(82,113,255)'
                     }}>
                  {renderMessageContent(message)}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="d-flex justify-content-start mb-3">
              <div className="d-flex align-items-end">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-2 text-white" 
                     style={{ width: '32px', height: '32px', backgroundColor: 'rgb(82,113,255)' }}>
                  <SmartToyIcon fontSize="small" />
                </div>
                <div className="p-2 rounded-3 rounded-start-0" 
                     style={{ backgroundColor: 'rgba(82,113,255,0.1)' }}>
                  <CircularProgress size={20} style={{ color: 'rgb(82,113,255)' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input - Fixed at bottom */}
        <div className="p-3 bg-white border-top shadow-sm" style={{ borderColor: 'rgb(82,113,255)' }}>
          <div className="d-flex">
            <textarea
              className="form-control rounded-start"
              placeholder="Ask about any study topic..."
              rows="1"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ borderColor: 'rgb(82,113,255)' }}
            />
            <button
              className="btn rounded-end d-flex align-items-center justify-content-center"
              disabled={!inputValue.trim() || isLoading || !userId}
              onClick={handleSendMessage}
              style={{ 
                width: '50px',
                backgroundColor: 'rgb(82,113,255)',
                color: 'white'
              }}
            >
              <SendIcon />
            </button>
          </div>
          <small className="mt-1 d-block" style={{ color: 'rgb(82,113,255)' }}>
            Ask for explanations <Link to='/studyplanner'>study plan </Link>, or <Link to='/content'>Suggested Content</Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Chat;