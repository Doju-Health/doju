import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, X, ArrowLeft, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useMessaging, useConversationMessages, Conversation } from '@/hooks/useMessaging';
import { format } from 'date-fns';

interface ChatWindowProps {
  conversation: Conversation | null;
  onClose: () => void;
  onBack?: () => void;
}

const ChatWindow = ({ conversation, onClose, onBack }: ChatWindowProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const { messages, sendMessage, loading } = useConversationMessages(conversation?.id || null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getOtherParticipant = () => {
    if (!conversation?.participant_info) return null;
    return conversation.participant_info.find(p => p.id !== user?.id);
  };

  const otherParticipant = getOtherParticipant();

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-doju-lime/20 text-doju-lime">
            {otherParticipant?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">
            {conversation.type === 'support' 
              ? 'Support Chat' 
              : otherParticipant?.name || 'Unknown User'}
          </h3>
          <div className="flex items-center gap-2">
            {otherParticipant && (
              <Badge variant="outline" className="text-xs capitalize">
                {otherParticipant.role}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {otherParticipant?.email}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-doju-lime"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[75%] ${msg.sender_id === user?.id ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className={
                      msg.sender_id === user?.id 
                        ? 'bg-doju-lime text-doju-navy' 
                        : 'bg-muted text-foreground'
                    }>
                      {msg.sender_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        msg.sender_id === user?.id
                          ? 'bg-doju-lime text-doju-navy'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <p className={`text-xs mt-1 ${
                      msg.sender_id === user?.id ? 'text-right' : ''
                    } text-muted-foreground`}>
                      {msg.sender_name} • {format(new Date(msg.created_at), 'MMM d, HH:mm')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
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
    </div>
  );
};

export default ChatWindow;
