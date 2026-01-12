import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Check, X, Eye, Clock, Filter, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDocuments, UserDocument, DocumentStatus } from '@/hooks/useDocuments';
import { format } from 'date-fns';

const AdminDocumentManager = () => {
  const { documents, loading, updateDocumentStatus } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<UserDocument | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const filteredDocuments = documents.filter(doc => {
    if (roleFilter !== 'all' && doc.role !== roleFilter) return false;
    if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        doc.user_name?.toLowerCase().includes(query) ||
        doc.user_email?.toLowerCase().includes(query) ||
        doc.document_name.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const pendingDocs = filteredDocuments.filter(d => d.status === 'pending');
  const approvedDocs = filteredDocuments.filter(d => d.status === 'approved');
  const rejectedDocs = filteredDocuments.filter(d => d.status === 'rejected');

  const handleAction = (doc: UserDocument, action: 'approve' | 'reject') => {
    setSelectedDoc(doc);
    setActionType(action);
    setNotes('');
    setShowActionDialog(true);
  };

  const confirmAction = async () => {
    if (!selectedDoc || !actionType) return;

    setProcessing(true);
    await updateDocumentStatus(
      selectedDoc.id,
      actionType === 'approve' ? 'approved' : 'rejected',
      notes
    );
    setProcessing(false);
    setShowActionDialog(false);
    setSelectedDoc(null);
    setActionType(null);
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20 gap-1"><Check className="h-3 w-3" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20 gap-1"><X className="h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
    }
  };

  const getDocumentTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      government_id: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      proof_of_address: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      vehicle_document: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      business_document: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
      product_document: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
      other: 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    };
    return (
      <Badge className={`${colors[type] || colors.other} capitalize`}>
        {type.replace(/_/g, ' ')}
      </Badge>
    );
  };

  const DocumentCard = ({ doc }: { doc: UserDocument }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border p-4"
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h4 className="font-semibold text-foreground">{doc.document_name}</h4>
              <div className="flex items-center gap-2 mt-1">
                {getDocumentTypeBadge(doc.document_type)}
                {getStatusBadge(doc.status)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{doc.user_name || 'Unknown'}</span>
            </div>
            <Badge variant="outline" className="capitalize">{doc.role}</Badge>
            <span>{format(new Date(doc.created_at), 'MMM d, yyyy')}</span>
          </div>

          {doc.admin_notes && (
            <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-2 mb-3">
              <strong>Notes:</strong> {doc.admin_notes}
            </p>
          )}

          <div className="flex gap-2">
            <a href={doc.document_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1">
                <Eye className="h-3 w-3" /> View
              </Button>
            </a>
            {doc.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  className="gap-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleAction(doc, 'approve')}
                >
                  <Check className="h-3 w-3" /> Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleAction(doc, 'reject')}
                >
                  <X className="h-3 w-3" /> Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-doju-lime" />
            Document Management
          </h2>
          <p className="text-muted-foreground text-sm">
            Review and manage uploaded documents from sellers and dispatch agents
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {pendingDocs.length} pending
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="seller">Sellers</SelectItem>
            <SelectItem value="dispatch">Dispatch</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Documents List */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            Pending
            {pendingDocs.length > 0 && (
              <span className="h-5 w-5 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center">
                {pendingDocs.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedDocs.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedDocs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pendingDocs.length > 0 ? (
            <div className="grid gap-4">
              {pendingDocs.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl border border-border">
              <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No documents pending review</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved">
          {approvedDocs.length > 0 ? (
            <div className="grid gap-4">
              {approvedDocs.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl border border-border">
              <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No approved documents</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected">
          {rejectedDocs.length > 0 ? (
            <div className="grid gap-4">
              {rejectedDocs.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl border border-border">
              <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No rejected documents</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Document' : 'Reject Document'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' 
                ? `Approve "${selectedDoc?.document_name}" for ${selectedDoc?.user_name}?`
                : `Reject "${selectedDoc?.document_name}" for ${selectedDoc?.user_name}? The user will be notified.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                {actionType === 'reject' ? 'Rejection Reason (required)' : 'Notes (optional)'}
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={actionType === 'reject' 
                  ? 'Explain why this document was rejected...'
                  : 'Add any notes...'}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              disabled={processing || (actionType === 'reject' && !notes.trim())}
              className={actionType === 'approve' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'}
            >
              {processing ? 'Processing...' : actionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDocumentManager;
