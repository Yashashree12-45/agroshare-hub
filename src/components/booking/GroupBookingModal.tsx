import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Plus, 
  Trash2, 
  Check, 
  Loader2,
  Split,
  UserPlus
} from 'lucide-react';
import { Equipment } from '@/services/api';
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';

interface GroupBookingModalProps {
  equipment: Equipment;
  open: boolean;
  onClose: () => void;
}

interface GroupMember {
  id: string;
  name: string;
  phone: string;
  share: number;
}

const timeSlots = [
  { value: '2', label: '2 Hours' },
  { value: '4', label: '4 Hours' },
  { value: '8', label: 'Full Day (8 Hours)' },
];

export function GroupBookingModal({ equipment, open, onClose }: GroupBookingModalProps) {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuthStore();
  const { addBooking } = useBookingStore();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [duration, setDuration] = useState('4');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'members' | 'payment' | 'success'>('members');
  const [members, setMembers] = useState<GroupMember[]>([
    { id: '1', name: user?.name || 'You', phone: '', share: 50 }
  ]);
  const [newMember, setNewMember] = useState({ name: '', phone: '' });

  const hours = parseInt(duration);
  const baseCost = hours * equipment.pricePerHour;
  const totalCost = baseCost + equipment.transportCharge;

  const addMember = () => {
    if (!newMember.name || !newMember.phone) {
      toast({
        title: 'Missing Information',
        description: 'Please enter name and phone number',
        variant: 'destructive',
      });
      return;
    }

    const equalShare = Math.floor(100 / (members.length + 1));
    const updatedMembers = members.map(m => ({ ...m, share: equalShare }));
    
    setMembers([
      ...updatedMembers,
      { id: Date.now().toString(), name: newMember.name, phone: newMember.phone, share: equalShare }
    ]);
    setNewMember({ name: '', phone: '' });
  };

  const removeMember = (id: string) => {
    if (members.length <= 1) return;
    const filtered = members.filter(m => m.id !== id);
    const equalShare = Math.floor(100 / filtered.length);
    setMembers(filtered.map(m => ({ ...m, share: equalShare })));
  };

  const updateShare = (id: string, share: number) => {
    setMembers(members.map(m => m.id === id ? { ...m, share } : m));
  };

  const totalShare = members.reduce((sum, m) => sum + m.share, 0);

  const handleProceedToPayment = () => {
    if (!date) {
      toast({
        title: 'Select Date',
        description: 'Please select a booking date',
        variant: 'destructive',
      });
      return;
    }
    if (totalShare !== 100) {
      toast({
        title: 'Invalid Shares',
        description: 'Total shares must equal 100%',
        variant: 'destructive',
      });
      return;
    }
    setStep('payment');
  };

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to book equipment',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    addBooking({
      id: Date.now().toString(),
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      farmerId: '1',
      ownerId: equipment.owner.id,
      startDate: date!,
      endDate: date!,
      duration: `${hours} hours`,
      status: 'pending',
      totalPrice: totalCost,
      withOperator: false,
      location: `${equipment.location.village}, ${equipment.location.district}`,
      createdAt: new Date(),
    });

    setLoading(false);
    setStep('success');
  };

  const handleClose = () => {
    setStep('members');
    setDate(undefined);
    setDuration('4');
    setMembers([{ id: '1', name: user?.name || 'You', phone: '', share: 100 }]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {step === 'success' ? 'Group Booking Confirmed!' : 'Group Booking'}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground mb-4">
                Payment links have been sent to all group members.
              </p>
              <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
                <p className="font-medium mb-2">Payment Summary:</p>
                {members.map((member) => (
                  <div key={member.id} className="flex justify-between text-sm">
                    <span>{member.name}</span>
                    <span className="font-medium">₹{Math.round(totalCost * member.share / 100)}</span>
                  </div>
                ))}
              </div>
              <Button onClick={handleClose}>Close</Button>
            </motion.div>
          ) : step === 'payment' ? (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Split className="w-4 h-4" />
                  Split Payment Breakdown
                </h3>
                <div className="space-y-3">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.phone || 'Primary Member'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">₹{Math.round(totalCost * member.share / 100)}</p>
                        <p className="text-sm text-muted-foreground">{member.share}%</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₹{totalCost}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep('members')}>
                  Back
                </Button>
                <Button className="flex-1" onClick={handleConfirmBooking} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm & Send Payment Links'}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="members"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Equipment Summary */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                <img
                  src={equipment.images[0]}
                  alt={equipment.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <div className="font-semibold">{equipment.name}</div>
                  <div className="text-sm text-muted-foreground">
                    ₹{equipment.pricePerHour}/hour
                  </div>
                </div>
              </div>

              {/* Date & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PP') : 'Pick date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="mb-2 block">Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {slot.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Group Members */}
              <div>
                <Label className="mb-2 block flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Group Members ({members.length})
                </Label>
                <div className="space-y-3">
                  {members.map((member, index) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{member.name}</p>
                        {member.phone && <p className="text-sm text-muted-foreground">{member.phone}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={member.share}
                          onChange={(e) => updateShare(member.id, parseInt(e.target.value) || 0)}
                          className="w-20 text-center"
                        />
                        <span className="text-sm">%</span>
                        {index > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeMember(member.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Member */}
                <div className="mt-4 p-4 border border-dashed border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <UserPlus className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Add Member</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Input
                      placeholder="Name"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    />
                    <Input
                      placeholder="Phone"
                      value={newMember.phone}
                      onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    />
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={addMember}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add to Group
                  </Button>
                </div>

                {totalShare !== 100 && (
                  <p className="text-sm text-destructive mt-2">
                    Total share: {totalShare}% (must be 100%)
                  </p>
                )}
              </div>

              {/* Price Summary */}
              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Base ({hours} hours)</span>
                  <span>₹{baseCost}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Transport</span>
                  <span>₹{equipment.transportCharge}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">₹{totalCost}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={handleClose}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleProceedToPayment}>
                  Proceed to Payment Split
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}