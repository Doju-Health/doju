import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Minimize2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useMessaging, useConversationMessages } from '@/hooks/useMessaging';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const SupportChatWidget = () => {
  const { user, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { createConversation } = useMessaging();
  const { messages, sendMessage, loading } = useConversationMessages(conversationId);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Don't show for admins (they have their own inbox)
  if (isAdmin) return null;

  // Check for existing support conversation
  useEffect(() => {
    const checkExistingConversation = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('conversations')
        .select('id')
        .eq('type', 'support')
        .contains('participant_ids', [user.id])
        .eq('status', 'open')
        .limit(1);

      if (data && data.length > 0) {
        setConversationId(data[0].id);
      }
    };

    if (isOpen && user) {
      checkExistingConversation();
    }
  }, [isOpen, user]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    // Create conversation if doesn't exist
    if (!conversationId && user) {
      // For support, we use a placeholder admin ID that will be picked up by any admin
      const conv = await createConversation(user.id, 'support', 'Customer Support');
      if (conv) {
        setConversationId(conv.id);
        // Send message after conversation is created
        setTimeout(async () => {
          await supabase.from('messages').insert({
            conversation_id: conv.id,
            sender_id: user.id,
            content: message.trim(),
            status: 'sent'
          });
          setMessage('');
        }, 100);
      }
    } else {
      await sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-doju-lime text-doju-navy shadow-lg hover:bg-doju-lime/90 flex items-center justify-center"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] h-[500px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-doju-navy to-doju-navy-light p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-doju-lime/20 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-doju-lime" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Customer Support</h3>
                  <p className="text-xs text-white/70">We typically reply in minutes</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/10"
              >
                <Minimize2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              {!user ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-2">Please log in to chat with support</p>
                  <Button variant="doju-primary" size="sm" onClick={() => window.location.href = '/auth'}>
                    Log In
                  </Button>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">Start a conversation with our support team</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          msg.sender_id === user?.id
                            ? 'bg-doju-lime text-doju-navy'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {msg.sender_id !== user?.id && (
                          <p className="text-xs font-medium mb-1 opacity-70">
                            {msg.sender_name} (Support)
                          </p>
                        )}
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender_id === user?.id ? 'text-doju-navy/60' : 'text-muted-foreground'
                        }`}>
                          {format(new Date(msg.created_at), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            {user && (
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button
                    variant="doju-primary"
                    size="icon"
                    onClick={handleSend}
                    disabled={!message.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportChatWidget;
