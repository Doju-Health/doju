import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type DocumentType = 'government_id' | 'proof_of_address' | 'vehicle_document' | 'business_document' | 'product_document' | 'other';
export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface UserDocument {
  id: string;
  user_id: string;
  document_type: DocumentType;
  document_url: string;
  document_name: string;
  status: DocumentStatus;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
}

export const useDocuments = () => {
  const { user, isAdmin } = useAuth();
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    if (!user) return;

    try {
      let query = supabase.from('user_documents').select('*');

      // If not admin, only fetch user's own documents
      if (!isAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Enrich with user info for admin
      if (isAdmin && data) {
        const enrichedDocs = await Promise.all(
          data.map(async (doc) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('user_id', doc.user_id)
              .single();

            return {
              ...doc,
              document_type: doc.document_type as DocumentType,
              status: doc.status as DocumentStatus,
              user_name: profile?.full_name || 'Unknown',
              user_email: profile?.email || ''
            };
          })
        );
        setDocuments(enrichedDocs);
      } else {
        setDocuments((data || []).map(d => ({
          ...d,
          document_type: d.document_type as DocumentType,
          status: d.status as DocumentStatus
        })));
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const updateDocumentStatus = async (
    documentId: string,
    status: DocumentStatus,
    notes?: string
  ) => {
    if (!user || !isAdmin) return;

    try {
      const { error } = await supabase
        .from('user_documents')
        .update({
          status,
          admin_notes: notes || null,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (error) throw error;

      // Get document owner for notification
      const doc = documents.find(d => d.id === documentId);
      if (doc) {
        await supabase.from('notifications').insert({
          user_id: doc.user_id,
          title: status === 'approved' ? 'Document Approved ✓' : 'Document Rejected',
          message: status === 'approved'
            ? `Your ${doc.document_name} has been approved.`
            : `Your ${doc.document_name} was rejected. ${notes || ''}`,
          type: status === 'approved' ? 'success' : 'error'
        });
      }

      toast.success(`Document ${status}`);
      await fetchDocuments();
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document');
    }
  };

  return {
    documents,
    loading,
    updateDocumentStatus,
    refreshDocuments: fetchDocuments
  };
};

// Fetch documents for a specific user (admin use)
export const fetchUserDocuments = async (userId: string): Promise<UserDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('user_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(d => ({
      ...d,
      document_type: d.document_type as DocumentType,
      status: d.status as DocumentStatus
    }));
  } catch (error) {
    console.error('Error fetching user documents:', error);
    return [];
  }
};
