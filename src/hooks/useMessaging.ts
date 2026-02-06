import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  status: "sent" | "delivered" | "read";
  created_at: string;
  sender_name?: string;
  sender_role?: string;
}

export interface Conversation {
  id: string;
  type: "admin_direct" | "support";
  participant_ids: string[];
  subject: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  last_message?: Message;
  unread_count?: number;
  participant_info?: {
    id: string;
    name: string;
    email: string;
    role: string;
  }[];
}

export const useMessaging = () => {
  const { user, isAdmin } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      // Fetch last message and participant info for each conversation
      const enrichedConversations = await Promise.all(
        (data || []).map(async (conv) => {
          // Get last message
          const { data: messages } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1);

          // Get participant profiles
          const participantInfos = await Promise.all(
            (conv.participant_ids as string[]).map(async (pid) => {
              const { data: profile } = await supabase
                .from("profiles")
                .select("user_id, full_name, email")
                .eq("user_id", pid)
                .single();

              const { data: roles } = await supabase
                .from("user_roles")
                .select("role")
                .eq("user_id", pid);

              return {
                id: pid,
                name: profile?.full_name || "Unknown",
                email: profile?.email || "",
                role: roles?.[0]?.role || "buyer",
              };
            }),
          );

          return {
            ...conv,
            type: conv.type as "admin_direct" | "support",
            last_message: messages?.[0] || undefined,
            participant_info: participantInfos,
          };
        }),
      );

      setConversations(enrichedConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Real-time subscription for conversations
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("conversations-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        () => {
          fetchConversations();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchConversations();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchConversations]);

  const createConversation = async (
    participantId: string,
    type: "admin_direct" | "support",
    subject?: string,
  ): Promise<Conversation | null> => {
    if (!user) return null;

    try {
      const participantIds = [user.id, participantId].filter(
        (id, index, arr) => arr.indexOf(id) === index,
      );

      // Check if conversation already exists
      const { data: existing } = await supabase
        .from("conversations")
        .select("*")
        .eq("type", type)
        .contains("participant_ids", participantIds);

      if (existing && existing.length > 0) {
        return existing[0] as Conversation;
      }

      const { data, error } = await supabase
        .from("conversations")
        .insert({
          type,
          participant_ids: participantIds,
          subject: subject || null,
          status: "open",
        })
        .select()
        .single();

      if (error) throw error;

      await fetchConversations();
      return data as Conversation;
    } catch (error: any) {
      console.error("Error creating conversation:", error);
      toast.error("Failed to start conversation");
      return null;
    }
  };

  const closeConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from("conversations")
        .update({ status: "closed" })
        .eq("id", conversationId);

      if (error) throw error;
      await fetchConversations();
      toast.success("Conversation closed");
    } catch (error) {
      console.error("Error closing conversation:", error);
      toast.error("Failed to close conversation");
    }
  };

  return {
    conversations,
    loading,
    createConversation,
    closeConversation,
    refreshConversations: fetchConversations,
  };
};

export const useConversationMessages = (conversationId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Enrich with sender info
      const enrichedMessages = await Promise.all(
        (data || []).map(async (msg) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("user_id", msg.sender_id)
            .single();

          const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", msg.sender_id);

          return {
            ...msg,
            status: msg.status as "sent" | "delivered" | "read",
            sender_name: profile?.full_name || "Unknown",
            sender_role: roles?.[0]?.role || "buyer",
          };
        }),
      );

      setMessages(enrichedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Real-time subscription for messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          fetchMessages();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages]);

  const sendMessage = async (content: string) => {
    if (!user || !conversationId || !content.trim()) return;

    try {
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
        status: "sent",
      });

      if (error) throw error;

      // Update conversation updated_at
      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    refreshMessages: fetchMessages,
  };
};
