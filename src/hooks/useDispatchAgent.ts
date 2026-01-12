import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type DispatchAgentStatus = 'pending_verification' | 'active' | 'suspended' | 'rejected';
export type VehicleType = 'bike' | 'car' | 'van';

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
      const { data, error } = await supabase
        .from('dispatch_agents')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setAgent(data as DispatchAgent | null);
    } catch (error) {
      console.error('Error fetching dispatch agent profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from('dispatch-documents')
      .upload(path, file, { upsert: true });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('dispatch-documents')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const registerAsAgent = async (formData: DispatchAgentFormData): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to register');
      return false;
    }

    if (!formData.government_id || !formData.selfie) {
      toast.error('Please upload all required documents');
      return false;
    }

    try {
      // Upload documents
      const govIdPath = `${user.id}/government-id-${Date.now()}`;
      const selfiePath = `${user.id}/selfie-${Date.now()}`;

      const [govIdUrl, selfieUrl] = await Promise.all([
        uploadFile(formData.government_id, govIdPath),
        uploadFile(formData.selfie, selfiePath),
      ]);

      // Create dispatch agent record
      const { data, error } = await supabase
        .from('dispatch_agents')
        .insert({
          user_id: user.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          home_address: formData.home_address,
          area_of_operation: formData.area_of_operation,
          vehicle_type: formData.vehicle_type,
          plate_number: formData.plate_number,
          government_id_url: govIdUrl,
          selfie_url: selfieUrl,
          account_name: formData.account_name,
          account_number: formData.account_number,
          bank_name: formData.bank_name,
          status: 'pending_verification',
        })
        .select()
        .single();

      if (error) throw error;

      // Add dispatch role to user
      await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'dispatch' as any,
        });

      setAgent(data as DispatchAgent);
      toast.success('Application submitted successfully!');
      return true;
    } catch (error: any) {
      console.error('Error registering as dispatch agent:', error);
      toast.error('Failed to submit application', { description: error.message });
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
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('dispatch-agents-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dispatch_agents',
        },
        () => {
          fetchAllAgents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAllAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('dispatch_agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgents((data || []) as DispatchAgent[]);
    } catch (error) {
      console.error('Error fetching dispatch agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAgentStatus = async (
    agentId: string, 
    status: DispatchAgentStatus,
    rejectionReason?: string
  ): Promise<boolean> => {
    try {
      const updateData: Record<string, any> = { status };
      
      if (status === 'active') {
        updateData.approved_at = new Date().toISOString();
      }
      
      if (status === 'rejected' && rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }

      const { error } = await supabase
        .from('dispatch_agents')
        .update(updateData)
        .eq('id', agentId);

      if (error) throw error;

      // Update local state
      setAgents(prev => prev.map(a => 
        a.id === agentId 
          ? { ...a, ...updateData }
          : a
      ));

      const statusMessages = {
        active: 'Agent approved successfully! 🎉',
        rejected: 'Agent application rejected.',
        suspended: 'Agent suspended.',
        pending_verification: 'Agent status updated.',
      };

      toast.success(statusMessages[status]);
      return true;
    } catch (error: any) {
      console.error('Error updating agent status:', error);
      toast.error('Failed to update status', { description: error.message });
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
