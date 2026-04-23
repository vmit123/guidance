import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const VoiceChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your AI Career Assistant. Ask me about colleges, scholarships, career paths, or anything related to your educational journey!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [userId] = useState(() => `user_${Date.now()}`);
  const [suggestions, setSuggestions] = useState([
    "Tell me about colleges in Jammu",
    "What scholarships are available?",
    "Help me choose a career"
  ]);
  const [emotion, setEmotion] = useState('neutral');
  const [contextAware, setContextAware] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const voiceProcessorRef = useRef(null);

  // Initialize voice processor on client side only
  useEffect(() => {
    if (typeof window === 'undefined') return;

    import('./VoiceProcessor').then(({ default: AdvancedVoiceProcessor }) => {
      const vp = new AdvancedVoiceProcessor();
      voiceProcessorRef.current = vp;

      if (vp.recognition) {
        setRecognitionSupported(true);
        vp.recognition.onresult = (event) => {
          const result = vp.handleRecognitionResult(event);
          if (result && result.transcript) {
            setInputText('');
            setIsListening(false);
            handleSendMessage(result.transcript);
          }
        };
        vp.recognition.onerror = () => {
          setIsListening(false);
        };
        vp.recognition.onend = () => {
          setIsListening(false);
        };
      }

      if (vp.synthesis) {
        setSpeechSupported(true);
      }
    });
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setUnreadCount(0);
    }
  }, [isOpen]);

  const addMessage = useCallback((text, isBot = false) => {
    const newMsg = {
      id: Date.now() + Math.random(),
      text,
      isBot,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMsg]);
    if (isBot && !isOpen) {
      setUnreadCount(prev => prev + 1);
    }
    return newMsg;
  }, [isOpen]);

  const speakText = async (text, emo = 'neutral') => {
    if (!speechSupported || !soundEnabled || !voiceProcessorRef.current) return;
    setIsSpeaking(true);
    try {
      await voiceProcessorRef.current.speak(text, emo);
    } catch (e) {
      // ignore
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (message) => {
    const msg = (message || inputText).trim();
    if (!msg) return;

    addMessage(msg, false);
    setInputText('');
    setIsLoading(true);
    setSuggestions([]);

    try {
      const response = await fetch(`${API_URL}/api/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          user_id: userId,
          conversation_history: messages.slice(-6).map(m => ({
            role: m.isBot ? 'assistant' : 'user',
            content: m.text
          }))
        }),
      });

      if (!response.ok) throw new Error('Failed');

      const data = await response.json();
      addMessage(data.response, true);
      setSuggestions(data.suggestions || []);
      setEmotion(data.emotion || 'neutral');
      setContextAware(data.context_aware || false);

      // Speak the response
      if (soundEnabled) {
        setTimeout(() => speakText(data.response, data.emotion), 400);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      addMessage("I'm sorry, I couldn't connect to the server. Please make sure the backend is running on port 8000.", true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startListening = () => {
    if (!voiceProcessorRef.current || isListening) return;
    setIsListening(true);
    const ok = voiceProcessorRef.current.startListening();
    if (!ok) {
      setIsListening(false);
      addMessage("Microphone access denied. Please allow microphone permission.", true);
    }
  };

  const stopListening = () => {
    if (voiceProcessorRef.current) {
      voiceProcessorRef.current.stopListening();
    }
    setIsListening(false);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      text: "💬 Chat cleared! How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }]);
    setSuggestions([
      "Tell me about colleges in Jammu",
      "What scholarships are available?",
      "Help me choose a career"
    ]);
  };

  const copyMessage = (text) => {
    navigator.clipboard?.writeText(text);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getEmotionEmoji = () => {
    const map = { positive: '😊', negative: '😔', excited: '🎉', neutral: '🤖' };
    return map[emotion] || '🤖';
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          id="chatbot-toggle-btn"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(99,102,241,0.4)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            animation: 'chatPulse 2s infinite'
          }}
          onMouseEnter={e => { e.target.style.transform = 'scale(1.1)'; }}
          onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
        >
          <i className="bi bi-chat-dots-fill"></i>
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '22px',
              height: '22px',
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              border: '2px solid white'
            }}>
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '400px',
          maxWidth: 'calc(100vw - 48px)',
          height: '600px',
          maxHeight: 'calc(100vh - 120px)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.2), 0 0 40px rgba(99,102,241,0.15)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          animation: 'chatSlideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b, #312e81, #4338ca)',
            color: 'white',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                boxShadow: '0 4px 12px rgba(99,102,241,0.4)'
              }}>
                {getEmotionEmoji()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'Outfit, sans-serif' }}>
                  AI Career Assistant
                </div>
                <div style={{ fontSize: '0.72rem', opacity: 0.75, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  Online • Voice & Text
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {/* Sound toggle */}
              <button
                onClick={() => { setSoundEnabled(!soundEnabled); if (isSpeaking) stopSpeaking(); }}
                title={soundEnabled ? 'Mute' : 'Unmute'}
                id="chatbot-sound-toggle"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  transition: 'background 0.2s'
                }}
              >
                <i className={`bi ${soundEnabled ? 'bi-volume-up-fill' : 'bi-volume-mute-fill'}`}></i>
              </button>
              {/* Clear chat */}
              <button
                onClick={clearChat}
                title="Clear chat"
                id="chatbot-clear-btn"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  transition: 'background 0.2s'
                }}
              >
                <i className="bi bi-trash3"></i>
              </button>
              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                id="chatbot-close-btn"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  transition: 'background 0.2s'
                }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            background: 'linear-gradient(180deg, #f8fafc, #f1f5f9)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.isBot ? 'flex-start' : 'flex-end',
                  animation: 'msgFadeIn 0.3s ease-out'
                }}
              >
                <div style={{
                  maxWidth: '82%',
                  position: 'relative',
                  group: true
                }}>
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: msg.isBot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                    background: msg.isBot
                      ? 'white'
                      : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: msg.isBot ? '#1e293b' : 'white',
                    boxShadow: msg.isBot
                      ? '0 2px 8px rgba(0,0,0,0.06)'
                      : '0 4px 12px rgba(99,102,241,0.3)',
                    fontSize: '0.88rem',
                    lineHeight: '1.5',
                    wordBreak: 'break-word'
                  }}>
                    {msg.text}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '4px',
                    justifyContent: msg.isBot ? 'flex-start' : 'flex-end'
                  }}>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                      {formatTime(msg.timestamp)}
                    </span>
                    {msg.isBot && (
                      <button
                        onClick={() => copyMessage(msg.text)}
                        title="Copy"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                          padding: '2px'
                        }}
                      >
                        <i className="bi bi-clipboard"></i>
                      </button>
                    )}
                    {msg.isBot && speechSupported && soundEnabled && (
                      <button
                        onClick={() => speakText(msg.text, emotion)}
                        title="Read aloud"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                          padding: '2px'
                        }}
                      >
                        <i className="bi bi-volume-up"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '12px 18px',
                  borderRadius: '4px 16px 16px 16px',
                  background: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  display: 'flex',
                  gap: '5px',
                  alignItems: 'center'
                }}>
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1',
                    animation: 'typingDot 1.4s infinite', animationDelay: '0s'
                  }}></span>
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6',
                    animation: 'typingDot 1.4s infinite', animationDelay: '0.2s'
                  }}></span>
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7',
                    animation: 'typingDot 1.4s infinite', animationDelay: '0.4s'
                  }}></span>
                </div>
              </div>
            )}

            {/* Listening indicator */}
            {isListening && (
              <div style={{
                display: 'flex', justifyContent: 'center',
                padding: '8px',
                animation: 'msgFadeIn 0.3s ease-out'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #ef4444, #f97316)',
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  animation: 'pulseGlow2 1.5s infinite'
                }}>
                  <i className="bi bi-mic-fill"></i>
                  Listening...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && !isLoading && (
            <div style={{
              padding: '8px 16px',
              background: 'white',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              flexShrink: 0
            }}>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(s)}
                  style={{
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: '20px',
                    padding: '5px 12px',
                    fontSize: '0.75rem',
                    color: '#4f46e5',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))';
                    e.target.style.color = '#4f46e5';
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div style={{
            padding: '12px 16px',
            background: 'white',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            flexShrink: 0
          }}>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Listening...' : 'Type your message...'}
              disabled={isListening || isLoading}
              id="chatbot-input"
              style={{
                flex: 1,
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '0.88rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                background: isListening ? '#fef2f2' : '#f8fafc'
              }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />

            {/* Voice button */}
            {recognitionSupported && (
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading}
                id="chatbot-mic-btn"
                title={isListening ? 'Stop listening' : 'Start voice input'}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isListening
                    ? 'linear-gradient(135deg, #ef4444, #f97316)'
                    : 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
                  color: isListening ? 'white' : '#6366f1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                  animation: isListening ? 'pulseGlow2 1s infinite' : 'none'
                }}
              >
                <i className={`bi ${isListening ? 'bi-mic-mute-fill' : 'bi-mic-fill'}`}></i>
              </button>
            )}

            {/* Send button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading || isListening}
              id="chatbot-send-btn"
              title="Send message"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                border: 'none',
                background: inputText.trim()
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : '#e2e8f0',
                color: inputText.trim() ? 'white' : '#94a3b8',
                cursor: inputText.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                transition: 'all 0.2s',
                flexShrink: 0,
                boxShadow: inputText.trim() ? '0 4px 12px rgba(99,102,241,0.3)' : 'none'
              }}
            >
              <i className="bi bi-send-fill"></i>
            </button>
          </div>

          {/* Status bar */}
          <div style={{
            padding: '6px 16px',
            background: '#f8fafc',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.68rem',
            color: '#94a3b8',
            flexShrink: 0
          }}>
            <span>
              {isSpeaking ? (
                <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <i className="bi bi-soundwave"></i> Speaking...
                  <button onClick={stopSpeaking} style={{
                    background: 'none', border: 'none', color: '#ef4444',
                    cursor: 'pointer', fontSize: '0.68rem', padding: '0 2px'
                  }}>Stop</button>
                </span>
              ) : contextAware ? (
                <span style={{ color: '#6366f1' }}>
                  <i className="bi bi-brain me-1"></i>Context-aware mode
                </span>
              ) : (
                'Powered by AI'
              )}
            </span>
            <span>
              {messages.length - 1} message{messages.length - 1 !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes chatPulse {
          0%, 100% { box-shadow: 0 8px 30px rgba(99,102,241,0.4); }
          50% { box-shadow: 0 8px 40px rgba(99,102,241,0.6); }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes msgFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulseGlow2 {
          0%, 100% { box-shadow: 0 0 8px rgba(239,68,68,0.3); }
          50% { box-shadow: 0 0 20px rgba(239,68,68,0.5); }
        }
      `}</style>
    </>
  );
};

export default VoiceChatbot;
