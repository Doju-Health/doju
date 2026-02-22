import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Search, Check, Clock, X } from "lucide-react";
import { Input } from "@/components/ui/input/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMessaging, Conversation } from "@/hooks/useMessaging";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import ChatWindow from "./ChatWindow";

const AdminMessagesInbox = () => {
  const { user } = useAuth();
  const { conversations, loading, closeConversation } = useMessaging();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "support" | "direct">(
    "all",
  );

  const filteredConversations = conversations.filter((conv) => {
    // Filter by tab
    if (activeTab === "support" && conv.type !== "support") return false;
    if (activeTab === "direct" && conv.type !== "admin_direct") return false;

    // Filter by search
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesParticipant = conv.participant_info?.some(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.email.toLowerCase().includes(searchLower),
      );
      const matchesLastMessage = conv.last_message?.content
        .toLowerCase()
        .includes(searchLower);
      return matchesParticipant || matchesLastMessage;
    }
    return true;
  });

  const openConversations = filteredConversations.filter(
    (c) => c.status === "open",
  );
  const closedConversations = filteredConversations.filter(
    (c) => c.status === "closed",
  );

  const getOtherParticipant = (conv: Conversation) => {
    return conv.participant_info?.find((p) => p.id !== user?.id);
  };

  const handleClose = () => {
    setSelectedConversation(null);
  };

  if (selectedConversation) {
    return (
      <div className="h-[600px] bg-card rounded-2xl border border-border overflow-hidden">
        <ChatWindow
          conversation={selectedConversation}
          onClose={handleClose}
          onBack={handleClose}
        />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-doju-lime" />
            Messages Inbox
          </h3>
          <Badge variant="outline">{openConversations.length} open</Badge>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="support" className="flex-1">
              Support
            </TabsTrigger>
            <TabsTrigger value="direct" className="flex-1">
              Direct
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Conversations List */}
      <ScrollArea className="h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-doju-lime"></div>
          </div>
        ) : openConversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No conversations yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {openConversations.map((conv) => {
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
                        {other?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-foreground truncate">
                          {conv.type === "support"
                            ? "Support Chat"
                            : other?.name || "Unknown"}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {format(new Date(conv.updated_at), "MMM d, HH:mm")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {other?.role || "user"}
                        </Badge>
                        <Badge
                          variant={
                            conv.type === "support" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {conv.type === "support" ? "Support" : "Direct"}
                        </Badge>
                      </div>
                      {conv.last_message && (
                        <p className="text-sm text-muted-foreground mt-1 truncate">
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

      {/* Closed Conversations */}
      {closedConversations.length > 0 && (
        <div className="border-t border-border">
          <details className="group">
            <summary className="p-4 cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              {closedConversations.length} closed conversation
              {closedConversations.length > 1 ? "s" : ""}
            </summary>
            <div className="divide-y divide-border">
              {closedConversations.slice(0, 5).map((conv) => {
                const other = getOtherParticipant(conv);
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className="w-full p-3 text-left hover:bg-muted/50 transition-colors opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                          {other?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-foreground truncate block">
                          {other?.name || "Unknown"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Closed
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default AdminMessagesInbox;
