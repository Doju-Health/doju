import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type DocumentType =
  | "government_id"
  | "proof_of_address"
  | "vehicle_document"
  | "business_document"
  | "product_document"
  | "other";
export type DocumentStatus = "pending" | "approved" | "rejected";

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

// Mock documents storage
const mockDocuments: Record<string, UserDocument[]> = {};

export const useDocuments = () => {
  const { user, isAdmin } = useAuth();
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    if (!user) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const allDocs = Object.values(mockDocuments).flat();

      if (!isAdmin) {
        // Show only user's own documents
        setDocuments(allDocs.filter((d) => d.user_id === user.id));
      } else {
        // Show all documents for admin
        setDocuments(allDocs);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
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
    notes?: string,
  ) => {
    if (!user || !isAdmin) return;

    try {
      const allDocs = Object.values(mockDocuments).flat();
      const doc = allDocs.find((d) => d.id === documentId);

      if (doc) {
        doc.status = status;
        doc.admin_notes = notes || null;
        doc.reviewed_by = user.id;
        doc.reviewed_at = new Date().toISOString();
      }

      toast.success(`Document ${status}`);
      await fetchDocuments();
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document");
    }
  };

  return {
    documents,
    loading,
    updateDocumentStatus,
    refreshDocuments: fetchDocuments,
  };
};

// Fetch documents for a specific user (admin use)
export const fetchUserDocuments = async (
  userId: string,
): Promise<UserDocument[]> => {
  try {
    const allDocs = Object.values(mockDocuments).flat();
    return allDocs.filter((d) => d.user_id === userId);
  } catch (error) {
    console.error("Error fetching user documents:", error);
    return [];
  }
};
