import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, CheckCircle, XCircle, Clock, Users, FileCheck, 
  AlertTriangle, Eye, Search, Filter, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
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
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useOperatorStore, Operator } from '@/store/operatorStore';
import { toast } from 'sonner';

type VerificationStatus = 'pending' | 'verified' | 'rejected';

interface OperatorWithVerification extends Operator {
  verificationStatus: VerificationStatus;
  documents?: {
    idProof: boolean;
    license: boolean;
    certification: boolean;
  };
  submittedAt?: Date;
}

const AdminDashboard = () => {
  const { operators, updateOperator } = useOperatorStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOperator, setSelectedOperator] = useState<OperatorWithVerification | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'verify' | 'reject'>('verify');

  // Mock verification data for operators
  const operatorsWithVerification: OperatorWithVerification[] = operators.map((op) => ({
    ...op,
    verificationStatus: op.verified ? 'verified' : 'pending',
    documents: {
      idProof: true,
      license: op.certifications ? op.certifications.length > 0 : false,
      certification: op.experience >= 2,
    },
    submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  }));

  const filteredOperators = operatorsWithVerification.filter((op) => {
    const matchesSearch = op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || op.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { 
      title: 'Total Operators', 
      value: operators.length, 
      icon: Users, 
      color: 'text-primary' 
    },
    { 
      title: 'Pending Verification', 
      value: operatorsWithVerification.filter(o => o.verificationStatus === 'pending').length, 
      icon: Clock, 
      color: 'text-yellow-600' 
    },
    { 
      title: 'Verified', 
      value: operatorsWithVerification.filter(o => o.verificationStatus === 'verified').length, 
      icon: CheckCircle, 
      color: 'text-green-600' 
    },
    { 
      title: 'Rejected', 
      value: operatorsWithVerification.filter(o => o.verificationStatus === 'rejected').length, 
      icon: XCircle, 
      color: 'text-destructive' 
    },
  ];

  const handleVerifyOperator = (operator: OperatorWithVerification) => {
    setSelectedOperator(operator);
    setConfirmAction('verify');
    setShowConfirmDialog(true);
  };

  const handleRejectOperator = (operator: OperatorWithVerification) => {
    setSelectedOperator(operator);
    setConfirmAction('reject');
    setShowConfirmDialog(true);
  };

  const confirmVerification = () => {
    if (!selectedOperator) return;
    
    updateOperator(selectedOperator.id, { 
      verified: confirmAction === 'verify' 
    });
    
    toast.success(
      confirmAction === 'verify' 
        ? `${selectedOperator.name} has been verified successfully!`
        : `${selectedOperator.name}'s application has been rejected.`
    );
    
    setShowConfirmDialog(false);
    setSelectedOperator(null);
  };

  const viewDetails = (operator: OperatorWithVerification) => {
    setSelectedOperator(operator);
    setShowDetailsDialog(true);
  };

  const statusBadge = (status: VerificationStatus) => {
    const config = {
      pending: { variant: 'secondary' as const, icon: Clock, label: 'Pending' },
      verified: { variant: 'default' as const, icon: CheckCircle, label: 'Verified' },
      rejected: { variant: 'destructive' as const, icon: XCircle, label: 'Rejected' },
    };
    const { variant, icon: Icon, label } = config[status];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">Manage operator verifications and platform settings</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Operator Verification Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Operator Verification
              </CardTitle>
              <CardDescription>Review and verify operator registrations</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Operators List */}
              <div className="space-y-3">
                {filteredOperators.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No operators found</p>
                  </div>
                ) : (
                  filteredOperators.map((operator) => (
                    <motion.div
                      key={operator.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border rounded-xl p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={operator.avatar}
                            alt={operator.name}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-border"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{operator.name}</h4>
                              {statusBadge(operator.verificationStatus)}
                            </div>
                            <p className="text-sm text-muted-foreground">{operator.phone}</p>
                            <p className="text-sm text-muted-foreground">{operator.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:items-end gap-2">
                          <div className="flex flex-wrap gap-1">
                            {operator.specializations.slice(0, 2).map((spec) => (
                              <Badge key={spec} variant="outline" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                            {operator.specializations.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{operator.specializations.length - 2}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {operator.experience} years experience • ₹{operator.hourlyRate}/hr
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewDetails(operator)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {operator.verificationStatus === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectOperator(operator)}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleVerifyOperator(operator)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Verify
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Operator Details</DialogTitle>
            <DialogDescription>Review operator credentials and documents</DialogDescription>
          </DialogHeader>
          
          {selectedOperator && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedOperator.avatar}
                  alt={selectedOperator.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20"
                />
                <div>
                  <h3 className="font-semibold text-lg">{selectedOperator.name}</h3>
                  <p className="text-muted-foreground">{selectedOperator.phone}</p>
                  {statusBadge(selectedOperator.verificationStatus)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Location</span>
                  <p className="font-medium">{selectedOperator.location}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Experience</span>
                  <p className="font-medium">{selectedOperator.experience} years</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Hourly Rate</span>
                  <p className="font-medium">₹{selectedOperator.hourlyRate}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Rating</span>
                  <p className="font-medium">{selectedOperator.rating} ⭐</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedOperator.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary">{spec}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Document Verification</h4>
                <div className="space-y-2">
                  {[
                    { label: 'ID Proof', verified: selectedOperator.documents?.idProof },
                    { label: 'Operating License', verified: selectedOperator.documents?.license },
                    { label: 'Equipment Certification', verified: selectedOperator.documents?.certification },
                  ].map((doc) => (
                    <div key={doc.label} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <span className="text-sm">{doc.label}</span>
                      {doc.verified ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Submitted
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Missing
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedOperator.bio && (
                <div>
                  <h4 className="font-medium mb-2">Bio</h4>
                  <p className="text-sm text-muted-foreground">{selectedOperator.bio}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            {selectedOperator?.verificationStatus === 'pending' && (
              <>
                <Button variant="outline" onClick={() => {
                  setShowDetailsDialog(false);
                  handleRejectOperator(selectedOperator);
                }}>
                  Reject
                </Button>
                <Button onClick={() => {
                  setShowDetailsDialog(false);
                  handleVerifyOperator(selectedOperator);
                }}>
                  Verify Operator
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'verify' ? 'Verify Operator' : 'Reject Application'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'verify' 
                ? `Are you sure you want to verify ${selectedOperator?.name}? They will be able to accept job requests.`
                : `Are you sure you want to reject ${selectedOperator?.name}'s application?`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant={confirmAction === 'verify' ? 'default' : 'destructive'}
              onClick={confirmVerification}
            >
              {confirmAction === 'verify' ? 'Verify' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
