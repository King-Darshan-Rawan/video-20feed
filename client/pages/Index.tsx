import { Mic, MicOff, Video, VideoOff, Phone, Gift, MessageCircle, Volume2, VolumeX, Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Index() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMale, setIsMale] = useState(true);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentMood, setCurrentMood] = useState<'happy' | 'calm' | 'excited' | 'neutral'>('neutral');
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'ai', timestamp: Date}>>([]);
  const [currentTyping, setCurrentTyping] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<Array<{id: string, emoji: string, x: number, y: number}>>([]);
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const [currentExpression, setCurrentExpression] = useState<'smile' | 'laugh' | 'nod' | null>(null);
  const [userMessage, setUserMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Mood colors mapping
  const moodColors = {
    happy: 'from-orange-400/30 to-yellow-500/20',
    calm: 'from-blue-400/30 to-cyan-500/20', 
    excited: 'from-pink-400/30 to-purple-500/20',
    neutral: 'from-call-primary/20 to-purple-500/20'
  };

  // TTS Function
  const speakText = (text: string) => {
    if (!isTTSEnabled || !text) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = isMale ? 0.8 : 1.2;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsAISpeaking(true);
    utterance.onend = () => setIsAISpeaking(false);
    
    speechSynthesis.speak(utterance);
  };

  // Add floating emoji
  const addFloatingEmoji = (emoji: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const x = Math.random() * 300 + 50;
    const y = Math.random() * 100 + 200;
    
    setFloatingEmojis(prev => [...prev, { id, emoji, x, y }]);
    
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 3000);
  };

  // Handle expression triggers
  const triggerExpression = (expression: 'smile' | 'laugh' | 'nod') => {
    setCurrentExpression(expression);
    
    switch(expression) {
      case 'smile':
        setCurrentMood('happy');
        addFloatingEmoji('😊');
        break;
      case 'laugh':
        setCurrentMood('excited');
        addFloatingEmoji('😄');
        break;
      case 'nod':
        setCurrentMood('calm');
        addFloatingEmoji('👍');
        break;
    }
    
    setTimeout(() => setCurrentExpression(null), 2000);
  };

  // Simulate AI response
  const simulateAIResponse = () => {
    const responses = [
      "Hello! I'm Lumi, your AI assistant. How can I help you today?",
      "That's a great question! Let me think about that [smile]",
      "I'm here to assist you with anything you need [nod]",
      "Haha, that's interesting! [laugh] Tell me more about that.",
      "I understand. Let me help you with that right away! 😊"
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    // Process expression triggers
    const expressionMatch = response.match(/\[(smile|laugh|nod)\]/);
    if (expressionMatch) {
      setTimeout(() => {
        triggerExpression(expressionMatch[1] as 'smile' | 'laugh' | 'nod');
      }, 1000);
    }
    
    // Process emojis
    const emojiMatch = response.match(/(😊|😅|🙌|😄|👍)/);
    if (emojiMatch) {
      setTimeout(() => {
        addFloatingEmoji(emojiMatch[1]);
      }, 1500);
    }
    
    const cleanResponse = response.replace(/\[\w+\]/g, '');
    
    const newMessage = {
      id: Date.now().toString(),
      text: cleanResponse,
      sender: 'ai' as const,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    speakText(cleanResponse);
  };

  // Send user message
  const sendUserMessage = () => {
    if (!userMessage.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      text: userMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setUserMessage('');
    
    // Simulate AI response after delay
    setTimeout(simulateAIResponse, 1000);
  };

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, currentTyping]);

  return (
    <div className="h-screen w-full bg-video-gradient flex flex-col overflow-hidden relative">
      {/* Floating Emojis */}
      {floatingEmojis.map(emoji => (
        <div
          key={emoji.id}
          className="absolute text-2xl animate-bounce pointer-events-none z-50"
          style={{
            left: `${emoji.x}px`,
            top: `${emoji.y}px`,
            animation: 'float-up 3s ease-out forwards'
          }}
        >
          {emoji.emoji}
        </div>
      ))}

      {/* Top Bar */}
      <div className="flex-shrink-0 p-4 sm:p-6">
        <div className="glass rounded-2xl p-4 flex items-center justify-between">
          <button
            onClick={() => setShowChat(!showChat)}
            className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </button>
          
          <h1 className="text-xl sm:text-2xl font-bold text-white">Lumi</h1>
          
          <button
            onClick={() => setIsTTSEnabled(!isTTSEnabled)}
            className={`w-10 h-10 glass rounded-full flex items-center justify-center transition-all ${
              isTTSEnabled ? 'bg-green-500/50' : 'hover:bg-white/20'
            }`}
          >
            {isTTSEnabled ? (
              <Volume2 className="w-5 h-5 text-white" />
            ) : (
              <VolumeX className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-4 sm:gap-6 px-4 sm:px-6 pb-4 sm:pb-6 min-h-0">
        {/* Left Side - User Video */}
        <div className="w-80 hidden lg:block">
          <div className="glass-dark rounded-3xl h-full p-6 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-gray-700/30 to-gray-900/30 rounded-2xl flex items-center justify-center border border-white/5">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-white/60" />
                </div>
                <p className="text-white/60 text-sm">Your Camera</p>
              </div>
            </div>
          </div>
        </div>

        {/* Center - AI Assistant */}
        <div className="flex-1 min-h-0">
          <div className="glass-dark rounded-3xl h-full py-6 pr-6 pl-6 flex items-center justify-center relative">
            {/* Mood Glow Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${moodColors[currentMood]} rounded-3xl transition-all duration-1000`} />
            
            {/* Placeholder for Lottie animation */}
            <div className="w-full h-full rounded-2xl flex items-center justify-center border border-white/5 relative overflow-hidden z-10">
              <div className="text-center">
                <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white/20 transition-all duration-500 ${
                  currentExpression === 'nod' ? 'animate-bounce' : 
                  currentExpression === 'laugh' ? 'animate-pulse' : 
                  currentExpression === 'smile' ? 'scale-105' : ''
                }`}>
                  <img
                    src={isMale
                      ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
                      : "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
                    }
                    alt={isMale ? "Male AI Assistant" : "Female AI Assistant"}
                    className="w-full h-full object-cover transition-all duration-300"
                    onError={(e) => {
                      e.currentTarget.src = isMale 
                        ? "https://via.placeholder.com/150/4F46E5/FFFFFF?text=M"
                        : "https://via.placeholder.com/150/EC4899/FFFFFF?text=F";
                    }}
                  />
                </div>
                <p className="text-white/80 text-sm sm:text-base font-medium">
                  {isMale ? "Berk" : "Luna"}
                </p>
                
                {/* Audio Wave Visualization */}
                <div className="flex items-center justify-center gap-1 mt-3 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 bg-gradient-to-t from-call-primary to-purple-500 rounded-full transition-all duration-150 ${
                        isAISpeaking 
                          ? 'animate-pulse h-4 sm:h-6' 
                          : 'h-1'
                      }`}
                      style={{
                        animationDelay: isAISpeaking ? `${i * 100}ms` : '0ms',
                        animationDuration: isAISpeaking ? `${600 + (i * 100)}ms` : '150ms'
                      }}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={() => setIsAISpeaking(!isAISpeaking)}
                  className="text-white/50 text-xs sm:text-sm hover:text-white/70 transition-colors"
                >
                  {isAISpeaking ? "🔊 Speaking..." : "💬 Click to simulate speaking"}
                </button>
              </div>

              {/* Gender Toggle Switch - Top Right */}
              <button
                onClick={() => setIsMale(!isMale)}
                className="absolute top-4 right-4 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200 hover:scale-105 z-20"
              >
                {isMale ? (
                  <div className="text-blue-400 font-bold text-lg">♂</div>
                ) : (
                  <div className="text-pink-400 font-bold text-lg">♀</div>
                )}
              </button>

              {/* Gift Box - Bottom Right */}
              <button 
                onClick={() => addFloatingEmoji('🎁')}
                className="absolute bottom-4 right-4 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200 hover:scale-105 z-20"
              >
                <Gift className="w-5 h-5 text-yellow-400" />
              </button>

              {/* Expression Test Buttons - Bottom Left */}
              <div className="absolute bottom-4 left-4 flex gap-2 z-20">
                <button
                  onClick={() => triggerExpression('smile')}
                  className="w-8 h-8 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-all text-xs"
                >
                  😊
                </button>
                <button
                  onClick={() => triggerExpression('laugh')}
                  className="w-8 h-8 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-all text-xs"
                >
                  😄
                </button>
                <button
                  onClick={() => triggerExpression('nod')}
                  className="w-8 h-8 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-all text-xs"
                >
                  👍
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Chat Panel */}
        {showChat && (
          <div className="w-80 lg:w-96">
            <div className="glass-dark rounded-3xl h-full flex flex-col">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-white font-medium">Chat with Lumi</h3>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-2xl text-sm animate-bounce-in ${
                        message.sender === 'user'
                          ? 'bg-call-primary text-white'
                          : 'bg-white/10 text-white border border-white/20'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 text-white border border-white/20 px-3 py-2 rounded-2xl text-sm">
                      {currentTyping}
                      <span className="animate-pulse">|</span>
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>
              
              {/* Chat Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendUserMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 text-sm"
                  />
                  <button
                    onClick={sendUserMessage}
                    className="w-10 h-10 bg-call-primary rounded-lg flex items-center justify-center hover:bg-call-primary/80 transition-all"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="flex-shrink-0 p-4 sm:p-6">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {/* Mute Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                isMuted
                  ? "bg-call-danger/80 hover:bg-call-danger"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {isMuted ? (
                <MicOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : (
                <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </button>

            {/* Video Toggle Button */}
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                !isVideoOn
                  ? "bg-call-danger/80 hover:bg-call-danger"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {isVideoOn ? (
                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : (
                <VideoOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </button>

            {/* Demo AI Response Button */}
            <button
              onClick={simulateAIResponse}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all duration-200 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            {/* End Call Button */}
            <button className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-call-danger hover:bg-red-600 flex items-center justify-center transition-all duration-200 hover:scale-105 transform">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white transform rotate-[135deg]" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.5);
          }
        }
        
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(10px);
          }
          60% {
            opacity: 1;
            transform: scale(1.05) translateY(-2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
