import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const faqQuickReplies = {
  en: [
    { label: 'How to book?', query: 'How do I book equipment?' },
    { label: 'Payment options', query: 'What payment methods do you accept?' },
    { label: 'Cancel booking', query: 'How can I cancel my booking?' },
    { label: 'Track equipment', query: 'How do I track my rented equipment?' },
  ],
  hi: [
    { label: 'बुकिंग कैसे करें?', query: 'उपकरण कैसे बुक करें?' },
    { label: 'भुगतान विकल्प', query: 'आप कौन से भुगतान तरीके स्वीकार करते हैं?' },
    { label: 'बुकिंग रद्द करें', query: 'मैं अपनी बुकिंग कैसे रद्द कर सकता हूं?' },
    { label: 'ट्रैक करें', query: 'मैं अपने किराए के उपकरण को कैसे ट्रैक करूं?' },
  ],
  mr: [
    { label: 'बुकिंग कशी करायची?', query: 'साधने कशी बुक करायची?' },
    { label: 'पेमेंट पर्याय', query: 'तुम्ही कोणत्या पेमेंट पद्धती स्वीकारता?' },
    { label: 'बुकिंग रद्द करा', query: 'मी माझी बुकिंग कशी रद्द करू?' },
    { label: 'ट्रॅक करा', query: 'मी माझी भाड्याची साधने कशी ट्रॅक करू?' },
  ],
};

const botResponses: Record<string, Record<string, string>> = {
  en: {
    'How do I book equipment?': 'To book equipment: 1) Search for equipment by type and location, 2) Select your preferred dates and time slots, 3) Choose if you need an operator, 4) Confirm and pay. It\'s that simple!',
    'What payment methods do you accept?': 'We accept UPI, Credit/Debit Cards, Net Banking, and our in-app Wallet. All transactions are secure and you\'ll receive an invoice for every payment.',
    'How can I cancel my booking?': 'You can cancel from your Dashboard > My Bookings. Free cancellation up to 24 hours before. Late cancellations may incur a small fee. Refunds are processed within 3-5 business days.',
    'How do I track my rented equipment?': 'Go to Dashboard > My Bookings > Select booking > Track. You\'ll see real-time GPS location, ETA, and can contact the operator directly.',
    'default': 'I\'m here to help! You can ask about booking equipment, payments, tracking, or any other questions. Would you like to speak with our support team?',
  },
  hi: {
    'उपकरण कैसे बुक करें?': 'उपकरण बुक करने के लिए: 1) प्रकार और स्थान के अनुसार खोजें, 2) अपनी पसंदीदा तारीखें चुनें, 3) ऑपरेटर चुनें यदि आवश्यक हो, 4) पुष्टि करें और भुगतान करें।',
    'आप कौन से भुगतान तरीके स्वीकार करते हैं?': 'हम UPI, क्रेडिट/डेबिट कार्ड, नेट बैंकिंग और इन-ऐप वॉलेट स्वीकार करते हैं। सभी लेनदेन सुरक्षित हैं।',
    'मैं अपनी बुकिंग कैसे रद्द कर सकता हूं?': 'आप डैशबोर्ड > मेरी बुकिंग से रद्द कर सकते हैं। 24 घंटे पहले मुफ्त रद्दीकरण। देर से रद्दीकरण पर शुल्क लग सकता है।',
    'मैं अपने किराए के उपकरण को कैसे ट्रैक करूं?': 'डैशबोर्ड > मेरी बुकिंग > ट्रैक पर जाएं। आप रियल-टाइम GPS स्थान और ETA देख सकते हैं।',
    'default': 'मैं आपकी मदद के लिए यहां हूं! आप बुकिंग, भुगतान, ट्रैकिंग के बारे में पूछ सकते हैं।',
  },
  mr: {
    'साधने कशी बुक करायची?': 'साधने बुक करण्यासाठी: 1) प्रकार आणि स्थानानुसार शोधा, 2) तुमच्या आवडीच्या तारखा निवडा, 3) ऑपरेटर निवडा, 4) पुष्टी करा आणि पैसे भरा।',
    'तुम्ही कोणत्या पेमेंट पद्धती स्वीकारता?': 'आम्ही UPI, क्रेडिट/डेबिट कार्ड, नेट बँकिंग आणि इन-अॅप वॉलेट स्वीकारतो।',
    'मी माझी बुकिंग कशी रद्द करू?': 'तुम्ही डॅशबोर्ड > माझी बुकिंग वरून रद्द करू शकता। २४ तास आधी मोफत रद्द करता येते।',
    'मी माझी भाड्याची साधने कशी ट्रॅक करू?': 'डॅशबोर्ड > माझी बुकिंग > ट्रॅक वर जा. तुम्हाला रियल-टाइम GPS स्थान आणि ETA दिसेल।',
    'default': 'मी तुम्हाला मदत करण्यासाठी येथे आहे! तुम्ही बुकिंग, पेमेंट, ट्रॅकिंग बद्दल विचारू शकता।',
  },
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();

  const currentLang = i18n.language as keyof typeof faqQuickReplies;
  const quickReplies = faqQuickReplies[currentLang] || faqQuickReplies.en;
  const responses = botResponses[currentLang] || botResponses.en;

  const greetings: Record<string, string> = {
    en: 'Hello! 👋 I\'m your AgroToolAccess assistant. How can I help you today?',
    hi: 'नमस्ते! 👋 मैं आपका AgroToolAccess सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
    mr: 'नमस्कार! 👋 मी तुमचा AgroToolAccess सहाय्यक आहे. आज मी तुम्हाला कशी मदत करू शकतो?',
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: greetings[currentLang] || greetings.en,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, currentLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBotResponse = (query: string): string => {
    const normalizedQuery = query.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
      if (key !== 'default' && normalizedQuery.includes(key.toLowerCase().slice(0, 10))) {
        return value;
      }
    }
    return responses[query] || responses['default'];
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(text),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-primary shadow-lg hover:bg-primary/90"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] max-w-[calc(100vw-3rem)] rounded-xl border bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b bg-primary p-4 rounded-t-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary-foreground">AgroToolAccess</h3>
                <p className="text-xs text-primary-foreground/70">Always here to help</p>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[300px] overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary">
                      <User className="h-4 w-4 text-secondary-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 rounded-lg bg-muted px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Typing...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="border-t px-4 py-2">
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(reply.query)}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    {reply.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="border-t p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={currentLang === 'hi' ? 'संदेश लिखें...' : currentLang === 'mr' ? 'संदेश लिहा...' : 'Type a message...'}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
