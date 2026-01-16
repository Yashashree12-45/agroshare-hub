import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  UserCheck, 
  Check, 
  Loader2, 
  Truck, 
  Package, 
  MapPin,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Shield,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Equipment } from '@/services/api';
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore } from '@/store/authStore';
import { Operator } from '@/store/operatorStore';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
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
import { AddressAutocomplete } from '@/components/maps/AddressAutocomplete';
import { PickupLocationMap } from '@/components/maps/PickupLocationMap';
import { OperatorSelector } from './OperatorSelector';

interface BookingModalProps {
  equipment: Equipment;
  open: boolean;
  onClose: () => void;
}

type BookingStep = 'schedule' | 'operator' | 'delivery' | 'review' | 'success';

const stepConfig = [
  { id: 'schedule', label: 'Schedule', icon: CalendarIcon },
  { id: 'operator', label: 'Operator', icon: UserCheck },
  { id: 'delivery', label: 'Delivery', icon: Truck },
  { id: 'review', label: 'Review', icon: CreditCard },
];

export function BookingModal({ equipment, open, onClose }: BookingModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addBooking } = useBookingStore();
  
  const [step, setStep] = useState<BookingStep>('schedule');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [duration, setDuration] = useState('4');
  const [withOperator, setWithOperator] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCoords, setDeliveryCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const currentStepIndex = stepConfig.findIndex(s => s.id === step);

  const estimatedDelivery = useMemo(() => {
    if (!deliveryCoords || deliveryOption !== 'delivery') return null;
    
    const R = 6371;
    const dLat = ((equipment.location.lat - deliveryCoords.lat) * Math.PI) / 180;
    const dLon = ((equipment.location.lng - deliveryCoords.lng) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((deliveryCoords.lat * Math.PI) / 180) *
      Math.cos((equipment.location.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    const estimatedMinutes = Math.round(distance * 2.5);
    
    return {
      distance: distance.toFixed(1),
      time: estimatedMinutes < 60 
        ? `${estimatedMinutes} ${t('booking.minutes')}`
        : `${Math.floor(estimatedMinutes / 60)} ${t('booking.hrs')} ${estimatedMinutes % 60} ${t('booking.minutes')}`
    };
  }, [deliveryCoords, deliveryOption, equipment.location, t]);

  const operatorCost = selectedOperator?.hourlyRate || 500;
  const hours = duration === 'custom' ? 4 : parseInt(duration);
  const baseCost = hours * equipment.pricePerHour;
  const totalOperatorCost = withOperator ? operatorCost * hours : 0;
  const deliveryCost = !withOperator && deliveryOption === 'delivery' ? equipment.transportCharge : 0;
  const pickupDiscount = !withOperator && deliveryOption === 'pickup' ? Math.floor(equipment.transportCharge * 0.5) : 0;
  const totalCost = baseCost + totalOperatorCost + (withOperator ? equipment.transportCharge : deliveryCost) - pickupDiscount;

  const timeSlots = [
    { value: '2', label: `2 ${t('booking.hours')}` },
    { value: '4', label: `4 ${t('booking.hours')}` },
    { value: '8', label: `${t('booking.fullDay')} (8 ${t('booking.hours')})` },
    { value: 'custom', label: t('booking.custom') },
  ];

  const handleAddressChange = (address: string, coords?: { lat: number; lng: number }) => {
    setDeliveryAddress(address);
    if (coords) setDeliveryCoords(coords);
  };

  const canProceed = () => {
    switch (step) {
      case 'schedule':
        return !!date;
      case 'operator':
        return true; // Optional step
      case 'delivery':
        if (withOperator) return true;
        if (deliveryOption === 'delivery') return !!deliveryAddress;
        return true;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    const steps: BookingStep[] = ['schedule', 'operator', 'delivery', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: BookingStep[] = ['schedule', 'operator', 'delivery', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast({ title: t('booking.loginRequired'), description: t('booking.loginRequiredDesc'), variant: 'destructive' });
      navigate('/login');
      return;
    }
    if (!date) {
      toast({ title: t('booking.selectDateTitle'), description: t('booking.selectDateDesc'), variant: 'destructive' });
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
      startDate: date,
      endDate: date,
      duration: `${hours} hours`,
      status: 'pending',
      totalPrice: totalCost,
      withOperator,
      location: `${equipment.location.village}, ${equipment.location.district}`,
      createdAt: new Date(),
    });
    setLoading(false);
    setStep('success');
  };

  const handleClose = () => {
    setStep('schedule');
    setDate(undefined);
    setDuration('4');
    setWithOperator(false);
    setSelectedOperator(null);
    setDeliveryAddress('');
    setDeliveryCoords(null);
    setDeliveryOption('delivery');
    onClose();
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-6 px-2">
      {stepConfig.map((s, index) => {
        const isActive = s.id === step;
        const isPast = currentStepIndex > index;
        const Icon = s.icon;
        
        return (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg scale-110' 
                    : isPast 
                      ? 'bg-secondary text-secondary-foreground' 
                      : 'bg-muted text-muted-foreground'
                }`}
                animate={{ scale: isActive ? 1.1 : 1 }}
              >
                {isPast ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </motion.div>
              <span className={`text-xs mt-1 font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
            </div>
            {index < stepConfig.length - 1 && (
              <div className={`w-8 sm:w-12 h-0.5 mx-1 ${isPast ? 'bg-secondary' : 'bg-muted'}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderScheduleStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5"
    >
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
        <img src={equipment.images[0]} alt={equipment.name} className="w-16 h-16 rounded-lg object-cover shadow-md" />
        <div>
          <div className="font-semibold text-lg">{equipment.name}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            ₹{equipment.pricePerHour}{t('common.perHour')}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-primary" />
          {t('booking.selectDate')}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal h-12 border-2 hover:border-primary/50">
              <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
              {date ? format(date, 'PPP') : <span className="text-muted-foreground">{t('booking.selectDate')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date()} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          {t('booking.duration')}
        </Label>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger className="h-12 border-2 hover:border-primary/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((slot) => (
              <SelectItem key={slot.value} value={slot.value}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  {slot.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {date && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-secondary/10 rounded-xl border border-secondary/20"
        >
          <div className="flex items-center gap-2 text-secondary">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Booking for {format(date, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Duration: {hours} hours • Base cost: ₹{baseCost}
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  const renderOperatorStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5"
    >
      <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="font-semibold">{t('booking.withOperator')}</div>
              <div className="text-sm text-muted-foreground">
                {withOperator ? t('booking.operatorIncluded') : t('booking.addOperatorDesc')}
              </div>
            </div>
          </div>
          <Switch 
            checked={withOperator} 
            onCheckedChange={(checked) => {
              setWithOperator(checked);
              if (!checked) setSelectedOperator(null);
            }} 
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {withOperator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <Shield className="w-3 h-3" />
                  Verified Operators
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="w-3 h-3" />
                  Trained Professionals
                </Badge>
              </div>
              
              <OperatorSelector
                equipmentType={equipment.name}
                onSelect={setSelectedOperator}
                selectedOperator={selectedOperator}
              />

              {selectedOperator && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-primary/5 rounded-xl border border-primary/20"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <div>
                      <span className="font-medium">Selected: {selectedOperator.name}</span>
                      <div className="text-sm text-muted-foreground">
                        ₹{selectedOperator.hourlyRate}/hr × {hours} hrs = ₹{selectedOperator.hourlyRate * hours}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!withOperator && (
        <div className="p-4 bg-muted/50 rounded-xl text-center">
          <p className="text-sm text-muted-foreground">
            {t('booking.selfOperateDesc')}
          </p>
        </div>
      )}
    </motion.div>
  );

  const renderDeliveryStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5"
    >
      {withOperator ? (
        <div className="p-6 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl border text-center">
          <Truck className="w-12 h-12 mx-auto text-primary mb-3" />
          <h3 className="font-semibold text-lg mb-2">{t('booking.operatorDelivery')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('booking.operatorDeliveryDesc')}
          </p>
          <div className="mt-4 p-3 bg-background rounded-lg">
            <span className="text-sm">Transport Charge: </span>
            <span className="font-bold text-primary">₹{equipment.transportCharge}</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Label className="font-semibold">{t('booking.deliveryOption')}</Label>
          <RadioGroup value={deliveryOption} onValueChange={(v) => setDeliveryOption(v as 'pickup' | 'delivery')} className="space-y-3">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                deliveryOption === 'delivery' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{t('booking.ownerDelivery')}</div>
                      <div className="text-xs text-muted-foreground">{t('booking.ownerDeliveryDesc')}</div>
                    </div>
                    <Badge className="ml-auto">+₹{equipment.transportCharge}</Badge>
                  </div>
                </Label>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                deliveryOption === 'pickup' ? 'border-secondary bg-secondary/5' : 'border-border hover:border-secondary/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <div className="font-medium">{t('booking.selfPickup')}</div>
                      <div className="text-xs text-muted-foreground">{t('booking.selfPickupDesc')}</div>
                    </div>
                    <Badge variant="secondary" className="ml-auto">Save ₹{Math.floor(equipment.transportCharge * 0.5)}</Badge>
                  </div>
                </Label>
              </div>
            </motion.div>
          </RadioGroup>

          <AnimatePresence mode="wait">
            {deliveryOption === 'delivery' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden"
              >
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {t('booking.deliveryAddress')}
                </Label>
                <AddressAutocomplete value={deliveryAddress} onChange={handleAddressChange} placeholder={t('booking.enterAddress')} />
                {estimatedDelivery && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20"
                  >
                    <Clock className="w-4 h-4 text-primary" />
                    <div className="text-sm">
                      <span className="font-medium text-primary">{t('booking.estimatedDelivery')}: </span>
                      {estimatedDelivery.time} ({estimatedDelivery.distance} km)
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {deliveryOption === 'pickup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-secondary" />
                  {t('booking.pickupLocation')}
                </Label>
                <PickupLocationMap ownerLocation={equipment.location} ownerName={equipment.owner.name} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );

  const renderReviewStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5"
    >
      <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Order Summary
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b">
            <img src={equipment.images[0]} alt={equipment.name} className="w-12 h-12 rounded-lg object-cover" />
            <div className="flex-1">
              <div className="font-medium">{equipment.name}</div>
              <div className="text-sm text-muted-foreground">
                {date && format(date, 'PPP')} • {hours} hours
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('booking.base')} ({hours} {t('booking.hours')})</span>
              <span>₹{baseCost}</span>
            </div>
            
            {withOperator && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('booking.operatorCost')} {selectedOperator && `(${selectedOperator.name})`}
                  </span>
                  <span>₹{totalOperatorCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('booking.transport')}</span>
                  <span>₹{equipment.transportCharge}</span>
                </div>
              </>
            )}
            
            {!withOperator && (
              <>
                {deliveryOption === 'delivery' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('booking.deliveryCharge')}</span>
                    <span>₹{deliveryCost}</span>
                  </div>
                )}
                {deliveryOption === 'pickup' && pickupDiscount > 0 && (
                  <div className="flex justify-between text-secondary">
                    <span>{t('booking.pickupDiscount')}</span>
                    <span>-₹{pickupDiscount}</span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex justify-between font-bold text-lg pt-3 border-t">
            <span>{t('booking.totalCost')}</span>
            <span className="text-primary">₹{totalCost}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-muted/50 rounded-lg text-center">
          <CalendarIcon className="w-5 h-5 mx-auto text-primary mb-1" />
          <div className="text-xs text-muted-foreground">Date</div>
          <div className="text-sm font-medium">{date && format(date, 'MMM d')}</div>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg text-center">
          <Clock className="w-5 h-5 mx-auto text-primary mb-1" />
          <div className="text-xs text-muted-foreground">Duration</div>
          <div className="text-sm font-medium">{hours} hours</div>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg text-center">
          <UserCheck className="w-5 h-5 mx-auto text-primary mb-1" />
          <div className="text-xs text-muted-foreground">Operator</div>
          <div className="text-sm font-medium">{withOperator ? 'Included' : 'Self'}</div>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg text-center">
          <Truck className="w-5 h-5 mx-auto text-primary mb-1" />
          <div className="text-xs text-muted-foreground">Delivery</div>
          <div className="text-sm font-medium">{deliveryOption === 'delivery' ? 'Home' : 'Pickup'}</div>
        </div>
      </div>

      <div className="p-3 bg-secondary/10 rounded-lg flex items-center gap-2">
        <Shield className="w-5 h-5 text-secondary" />
        <div className="text-sm">
          <span className="font-medium text-secondary">100% Safe & Secure</span>
          <span className="text-muted-foreground"> • Cancel anytime before dispatch</span>
        </div>
      </div>
    </motion.div>
  );

  const renderSuccessStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-8 text-center"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-secondary to-primary flex items-center justify-center"
      >
        <Check className="w-10 h-10 text-white" />
      </motion.div>
      <h3 className="text-2xl font-bold mb-2">{t('booking.success')}</h3>
      <p className="text-muted-foreground mb-6">{t('booking.successMessage')}</p>
      
      <div className="p-4 bg-muted/50 rounded-xl mb-6 text-left">
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Booking ID</span>
            <span className="font-mono">#{Date.now().toString().slice(-8)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount Paid</span>
            <span className="font-bold text-primary">₹{totalCost}</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={handleClose}>{t('common.close')}</Button>
        <Button onClick={() => navigate('/bookings')}>{t('booking.viewBookings')}</Button>
      </div>
    </motion.div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 'success' ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                {t('booking.success')}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-primary" />
                {t('common.bookNow')}
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {step !== 'success' && renderStepIndicator()}

        <AnimatePresence mode="wait">
          {step === 'schedule' && renderScheduleStep()}
          {step === 'operator' && renderOperatorStep()}
          {step === 'delivery' && renderDeliveryStep()}
          {step === 'review' && renderReviewStep()}
          {step === 'success' && renderSuccessStep()}
        </AnimatePresence>

        {step !== 'success' && (
          <div className="flex gap-3 mt-6">
            {step !== 'schedule' && (
              <Button variant="outline" onClick={handleBack} className="gap-1">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <div className="flex-1" />
            {step === 'review' ? (
              <Button onClick={handleBooking} disabled={loading} className="gap-2 min-w-32">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {loading ? 'Processing...' : t('booking.confirm')}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed()} className="gap-1 min-w-24">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
