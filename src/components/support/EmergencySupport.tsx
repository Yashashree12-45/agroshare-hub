import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Phone, 
  MessageCircle, 
  Send, 
  X, 
  Headphones,
  Wrench,
  Clock,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender: 'user' | 'support';
  text: string;
  timestamp: Date;
}

const emergencyOptions = [
  { id: 'breakdown', icon: Wrench, label: 'Equipment Breakdown', priority: 'high' },
  { id: 'delay', icon: Clock, label: 'Delivery Delay', priority: 'medium' },
  { id: 'location', icon: MapPin, label: 'Location Issue', priority: 'medium' },
  { id: 'other', icon: MessageCircle, label: 'Other Issue', priority: 'low' },
];

export function EmergencySupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'options' | 'chat'>('options');
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSelectIssue = (issueId: string) => {
    setSelectedIssue(issueId);
    setStep('chat');
    
    // Initial support message
    const initialMessage: Message = {
      id: '1',
      sender: 'support',
      text: `Hello! I'm here to help with your ${emergencyOptions.find(o => o.id === issueId)?.label.toLowerCase()}. Please describe your issue in detail, including your booking ID if available.`,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate support response
    setTimeout(() => {
      const supportResponses = [
        "I understand your concern. Let me connect you with our technical team right away.",
        "Thank you for the details. Our nearest technician is being dispatched to your location.",
        "I've logged your issue with high priority. You'll receive a call from our team within 10 minutes.",
        "Your safety is our priority. Please stay at a safe distance from the equipment until help arrives.",
      ];
      
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'support',
        text: supportResponses[Math.floor(Math.random() * supportResponses.length)],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, supportMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleEmergencyCall = () => {
    toast({
      title: 'Connecting to Emergency Support',
      description: 'Calling +91 1800-123-4567...',
    });
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-destructive text-destructive-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AlertTriangle className="w-6 h-6" />
      </motion.button>

      {/* Emergency Support Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-border rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-destructive text-destructive-foreground p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Headphones className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold">24/7 Emergency Support</h3>
                    <p className="text-sm opacity-90">We're here to help</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:opacity-80">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {step === 'options' ? (
                  <div className="p-4 space-y-4">
                    {/* Emergency Call Banner */}
                    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Phone className="w-5 h-5 text-destructive" />
                        <span className="font-semibold text-destructive">Immediate Help Needed?</span>
                      </div>
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={handleEmergencyCall}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Helpline: 1800-123-4567
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Available 24/7 • Toll-free
                      </p>
                    </div>

                    {/* Issue Options */}
                    <div>
                      <p className="text-sm font-medium mb-3">Select your issue type:</p>
                      <div className="space-y-2">
                        {emergencyOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => handleSelectIssue(option.id)}
                            className="w-full flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                option.priority === 'high' 
                                  ? 'bg-destructive/10 text-destructive' 
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                <option.icon className="w-5 h-5" />
                              </div>
                              <span className="font-medium">{option.label}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Support Info */}
                    <div className="bg-muted/50 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground">
                        <strong>Response Time:</strong> Within 10 minutes for equipment breakdowns. 
                        Our support team is available in English, Hindi, and Marathi.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    {/* Chat Header */}
                    <div className="p-3 border-b border-border flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setStep('options');
                          setMessages([]);
                        }}
                      >
                        ← Back
                      </Button>
                      <Badge variant={selectedIssue === 'breakdown' ? 'destructive' : 'secondary'}>
                        {emergencyOptions.find(o => o.id === selectedIssue)?.label}
                      </Badge>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 space-y-4 min-h-[300px]">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-2xl ${
                              message.sender === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-md'
                                : 'bg-muted rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender === 'user' ? 'opacity-70' : 'text-muted-foreground'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-100" />
                              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-200" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-border">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Describe your issue..."
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button onClick={handleSendMessage}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}