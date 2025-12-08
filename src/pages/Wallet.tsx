import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Wallet as WalletIcon, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft,
  CreditCard,
  Smartphone,
  Building2,
  History,
  CheckCircle2,
  Clock,
  XCircle,
  IndianRupee,
  Send,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'debit',
    amount: 2500,
    description: 'Booking: Mahindra Tractor',
    date: '2024-01-15T10:30:00',
    status: 'completed',
    method: 'Wallet',
  },
  {
    id: '2',
    type: 'credit',
    amount: 5000,
    description: 'Wallet Top-up',
    date: '2024-01-14T15:45:00',
    status: 'completed',
    method: 'UPI',
  },
  {
    id: '3',
    type: 'debit',
    amount: 1800,
    description: 'Booking: Rotavator',
    date: '2024-01-12T09:20:00',
    status: 'completed',
    method: 'Card',
  },
  {
    id: '4',
    type: 'credit',
    amount: 500,
    description: 'Refund: Cancelled booking',
    date: '2024-01-10T14:00:00',
    status: 'completed',
    method: 'Wallet',
  },
  {
    id: '5',
    type: 'debit',
    amount: 3500,
    description: 'Booking: Drone Sprayer',
    date: '2024-01-08T11:30:00',
    status: 'pending',
    method: 'UPI',
  },
];

const quickAmounts = [500, 1000, 2000, 5000];

const Wallet = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [balance, setBalance] = useState(4200);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showSendMoney, setShowSendMoney] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [recipientUpi, setRecipientUpi] = useState('');

  const handleAddMoney = () => {
    const amount = parseInt(addAmount);
    if (amount > 0) {
      setBalance(prev => prev + amount);
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'credit',
        amount,
        description: 'Wallet Top-up',
        date: new Date().toISOString(),
        status: 'completed',
        method: paymentMethod.toUpperCase(),
      };
      setTransactions(prev => [newTransaction, ...prev]);
      toast({
        title: 'Money Added Successfully',
        description: `₹${amount.toLocaleString()} has been added to your wallet`,
      });
      setShowAddMoney(false);
      setAddAmount('');
    }
  };

  const handleSendMoney = () => {
    const amount = parseInt(sendAmount);
    if (amount > 0 && amount <= balance && recipientUpi) {
      setBalance(prev => prev - amount);
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'debit',
        amount,
        description: `Transfer to ${recipientUpi}`,
        date: new Date().toISOString(),
        status: 'completed',
        method: 'UPI',
      };
      setTransactions(prev => [newTransaction, ...prev]);
      toast({
        title: 'Money Sent Successfully',
        description: `₹${amount.toLocaleString()} sent to ${recipientUpi}`,
      });
      setShowSendMoney(false);
      setSendAmount('');
      setRecipientUpi('');
    }
  };

  const statusConfig = {
    completed: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <WalletIcon className="w-8 h-8 text-primary" />
              My Wallet
            </h1>
            <p className="text-muted-foreground">
              Manage your balance, add money, and view transaction history
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Balance Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm opacity-80">Available Balance</span>
                    <WalletIcon className="w-6 h-6 opacity-80" />
                  </div>
                  <div className="text-4xl font-bold mb-6">
                    ₹{balance.toLocaleString()}
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="secondary" 
                      className="flex-1"
                      onClick={() => setShowAddMoney(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Money
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                      onClick={() => setShowSendMoney(true)}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <ArrowDownLeft className="w-6 h-6 mx-auto text-green-600 mb-2" />
                    <div className="text-lg font-bold text-green-600">₹5,500</div>
                    <div className="text-xs text-muted-foreground">This Month (In)</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <ArrowUpRight className="w-6 h-6 mx-auto text-red-600 mb-2" />
                    <div className="text-lg font-bold text-red-600">₹7,800</div>
                    <div className="text-xs text-muted-foreground">This Month (Out)</div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Transactions & Payment Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Tabs defaultValue="transactions">
                <TabsList className="mb-4">
                  <TabsTrigger value="transactions" className="gap-2">
                    <History className="w-4 h-4" />
                    Transactions
                  </TabsTrigger>
                  <TabsTrigger value="payment-methods" className="gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment Methods
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="transactions">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>Your recent wallet activity</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {transactions.map((txn) => {
                          const StatusIcon = statusConfig[txn.status].icon;
                          return (
                            <div
                              key={txn.id}
                              className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                  {txn.type === 'credit' ? (
                                    <ArrowDownLeft className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium">{txn.description}</div>
                                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    {new Date(txn.date).toLocaleDateString('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                    <Badge variant="outline" className="text-xs">
                                      {txn.method}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`font-semibold ${
                                  txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                                </div>
                                <Badge 
                                  variant="secondary" 
                                  className={`${statusConfig[txn.status].bg} ${statusConfig[txn.status].color} text-xs`}
                                >
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {txn.status}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="payment-methods">
                  <Card>
                    <CardHeader>
                      <CardTitle>Saved Payment Methods</CardTitle>
                      <CardDescription>Manage your payment options for quick checkout</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* UPI */}
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Smartphone className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">UPI</div>
                            <div className="text-sm text-muted-foreground">farmer@ybl</div>
                          </div>
                        </div>
                        <Badge>Default</Badge>
                      </div>

                      {/* Card */}
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="font-medium">Debit Card</div>
                            <div className="text-sm text-muted-foreground">**** **** **** 4532</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>

                      {/* Bank Account */}
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <Building2 className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="font-medium">Bank Account</div>
                            <div className="text-sm text-muted-foreground">SBI - ****6789</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>

                      <Button variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Payment Method
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Add Money Dialog */}
      <Dialog open={showAddMoney} onOpenChange={setShowAddMoney}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Money to Wallet</DialogTitle>
            <DialogDescription>
              Choose amount and payment method to top up your wallet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Enter amount"
                  className="pl-9"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {quickAmounts.map((amt) => (
                  <Button
                    key={amt}
                    variant="outline"
                    size="sm"
                    onClick={() => setAddAmount(amt.toString())}
                  >
                    ₹{amt}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Smartphone className="w-4 h-4" />
                    UPI
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="w-4 h-4" />
                    Debit/Credit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="netbanking" id="netbanking" />
                  <Label htmlFor="netbanking" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Building2 className="w-4 h-4" />
                    Net Banking
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === 'upi' && (
              <div className="space-y-2">
                <Label>UPI ID</Label>
                <Input
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMoney(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMoney} disabled={!addAmount || parseInt(addAmount) <= 0}>
              Add ₹{addAmount || 0}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Money Dialog */}
      <Dialog open={showSendMoney} onOpenChange={setShowSendMoney}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Money</DialogTitle>
            <DialogDescription>
              Transfer money to another UPI ID
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Recipient UPI ID</Label>
              <Input
                placeholder="recipient@upi"
                value={recipientUpi}
                onChange={(e) => setRecipientUpi(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Enter amount"
                  className="pl-9"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Available balance: ₹{balance.toLocaleString()}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendMoney(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendMoney} 
              disabled={!sendAmount || !recipientUpi || parseInt(sendAmount) > balance}
            >
              Send ₹{sendAmount || 0}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Wallet;
