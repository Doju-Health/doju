import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Bell, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMessaging, Conversation, useConversationMessages } from '@/hooks/useMessaging';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import ChatWindow from '@/components/chat/ChatWindow';

const UserMessagesInbox = () => {
  const { user } = useAuth();
  const { conversations, loading } = useMessaging();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('messages');

  const userConversations = conversations.filter(conv => 
    conv.participant_ids.includes(user?.id || '')
  );

  const getOtherParticipant = (conv: Conversation) => {
    return conv.participant_info?.find(p => p.id !== user?.id);
  };

  if (selectedConversation) {
    return (
      <div className="h-[500px] bg-card rounded-2xl border border-border overflow-hidden">
        <ChatWindow 
          conversation={selectedConversation} 
          onClose={() => setSelectedConversation(null)}
          onBack={() => setSelectedConversation(null)}
        />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <div className="border-b border-border p-4">
          <TabsList className="w-full">
            <TabsTrigger value="messages" className="flex-1 gap-2">
              <MessageCircle className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 gap-2 relative">
              <Bell className="h-4 w-4" />
              Notifications
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="messages" className="m-0">
          <ScrollArea className="h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-doju-lime"></div>
              </div>
            ) : userConversations.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No messages yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Use the support chat to contact us
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {userConversations.map((conv) => {
                  const other = getOtherParticipant(conv);
                  return (
                    <motion.button
                      key={conv.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSelectedConversation(conv)}
                      className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-doju-lime/20 text-doju-lime">
                            {other?.name?.charAt(0) || 'A'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-foreground truncate">
                              {conv.type === 'support' ? 'Customer Support' : other?.name || 'Admin'}
                            </span>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {format(new Date(conv.updated_at), 'MMM d')}
                            </span>
                          </div>
                          {conv.last_message && (
                            <p className="text-sm text-muted-foreground mt-1 truncate">
                              {conv.last_message.sender_id === user?.id ? 'You: ' : ''}
                              {conv.last_message.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="notifications" className="m-0">
          <div className="border-b border-border p-2 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all as read
            </Button>
          </div>
          <ScrollArea className="h-[356px]">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notif) => (
                  <motion.button
                    key={notif.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => markAsRead(notif.id)}
                    className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                      !notif.read ? 'bg-doju-lime/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                        !notif.read ? 'bg-doju-lime' : 'bg-transparent'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-medium truncate ${
                            !notif.read ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {notif.title}
                          </span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {format(new Date(notif.created_at), 'MMM d')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserMessagesInbox;
