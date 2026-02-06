import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type DispatchAgentStatus =
  | "pending_verification"
  | "active"
  | "suspended"
  | "rejected";
export type VehicleType = "bike" | "car" | "van";

export interface DispatchAgent {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  home_address: string;
  area_of_operation: string;
  vehicle_type: VehicleType;
  plate_number: string;
  government_id_url: string;
  selfie_url: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  status: DispatchAgentStatus;
  approved_at: string | null;
  approved_by: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface DispatchAgentFormData {
  full_name: string;
  email: string;
  phone: string;
  home_address: string;
  area_of_operation: string;
  vehicle_type: VehicleType;
  plate_number: string;
  government_id: File | null;
  selfie: File | null;
  account_name: string;
  account_number: string;
  bank_name: string;
}

export const useDispatchAgent = () => {
  const { user } = useAuth();
  const [agent, setAgent] = useState<DispatchAgent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAgentProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAgentProfile = async () => {
    if (!user) return;

    try {
      // Mock fetch
      await new Promise((resolve) => setTimeout(resolve, 300));
      setAgent(null);
    } catch (error) {
      console.error("Error fetching dispatch agent profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const registerAsAgent = async (
    formData: DispatchAgentFormData,
  ): Promise<boolean> => {
    if (!user) {
      toast.error("Please sign in to register");
      return false;
    }

    if (!formData.government_id || !formData.selfie) {
      toast.error("Please upload all required documents");
      return false;
    }

    try {
      // Mock registration
      toast.success("Application submitted successfully!");
      return true;
    } catch (error: any) {
      console.error("Error registering as dispatch agent:", error);
      toast.error("Failed to submit application", {
        description: error.message,
      });
      return false;
    }
  };

  return {
    agent,
    loading,
    registerAsAgent,
    refetch: fetchAgentProfile,
  };
};

// Admin hook for managing dispatch agents
export const useDispatchAgentsAdmin = () => {
  const [agents, setAgents] = useState<DispatchAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllAgents();
  }, []);

  const fetchAllAgents = async () => {
    try {
      // Mock fetch
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAgents([]);
    } catch (error) {
      console.error("Error fetching dispatch agents:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAgentStatus = async (
    agentId: string,
    status: DispatchAgentStatus,
    rejectionReason?: string,
  ): Promise<boolean> => {
    try {
      // Mock update
      const statusMessages = {
        active: "Agent approved successfully! 🎉",
        rejected: "Agent application rejected.",
        suspended: "Agent suspended.",
        pending_verification: "Agent status updated.",
      };

      toast.success(statusMessages[status]);
      return true;
    } catch (error: any) {
      console.error("Error updating agent status:", error);
      toast.error("Failed to update status", { description: error.message });
      return false;
    }
  };

  return {
    agents,
    loading,
    updateAgentStatus,
    refetch: fetchAllAgents,
  };
};
