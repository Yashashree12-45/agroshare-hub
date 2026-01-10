import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, UserCheck, Check, Loader2, Truck, Package, MapPin } from 'lucide-react';
import { Equipment } from '@/services/api';
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface BookingModalProps {
  equipment: Equipment;
  open: boolean;
  onClose: () => void;
}

export function BookingModal({ equipment, open, onClose }: BookingModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addBooking } = useBookingStore();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [duration, setDuration] = useState('4');
  const [withOperator, setWithOperator] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');

  // Calculate estimated delivery time based on simulated distance
  const estimatedDelivery = useMemo(() => {
    if (!deliveryAddress || deliveryOption !== 'delivery') return null;
    
    // Simulate distance calculation based on address length (mock)
    const simulatedDistance = Math.min(5 + (deliveryAddress.length % 20) * 2, 50); // 5-50 km
    const estimatedMinutes = Math.round(simulatedDistance * 2.5); // ~2.5 min per km
    
    return {
      distance: simulatedDistance,
      time: estimatedMinutes < 60 
        ? `${estimatedMinutes} ${t('booking.minutes')}`
        : `${Math.floor(estimatedMinutes / 60)} ${t('booking.hrs')} ${estimatedMinutes % 60} ${t('booking.minutes')}`
    };
  }, [deliveryAddress, deliveryOption, t]);

  const operatorCost = 500;
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

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast({
        title: t('booking.loginRequired'),
        description: t('booking.loginRequiredDesc'),
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (!date) {
      toast({
        title: t('booking.selectDateTitle'),
        description: t('booking.selectDateDesc'),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    // Simulate API call
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
    setStep('select');
    setDate(undefined);
    setDuration('4');
    setWithOperator(false);
    setDeliveryAddress('');
    setDeliveryOption('delivery');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {step === 'success' ? t('booking.success') : t('common.bookNow')}
          </DialogTitle>
        </DialogHeader>

        {step === 'success' ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
              <Check className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
            <p className="text-muted-foreground mb-6">
              Your booking request has been sent to the owner. You'll receive a confirmation soon.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={() => navigate('/dashboard')}>
                View Bookings
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
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
                  ₹{equipment.pricePerHour}{t('common.perHour')}
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <Label className="mb-2 block">{t('booking.selectDate')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : 'Pick a date'}
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

            {/* Duration Selection */}
            <div>
              <Label className="mb-2 block">{t('booking.duration')}</Label>
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

            {/* Operator Toggle */}
            {equipment.operatorAvailable && (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">{t('booking.withOperator')}</div>
                    <div className="text-sm text-muted-foreground">
                      +₹{operatorCost}{t('common.perHour')}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={withOperator}
                  onCheckedChange={setWithOperator}
                />
              </div>
            )}

            {/* Delivery Option - Only show when WITHOUT operator */}
            {!withOperator && (
              <div className="p-4 bg-muted/50 rounded-xl space-y-3">
                <Label className="font-medium">{t('booking.deliveryOption')}</Label>
                <RadioGroup
                  value={deliveryOption}
                  onValueChange={(value) => setDeliveryOption(value as 'pickup' | 'delivery')}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-medium">{t('booking.ownerDelivery')}</div>
                          <div className="text-xs text-muted-foreground">
                            {t('booking.ownerDeliveryDesc')} (+₹{equipment.transportCharge})
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-secondary" />
                        <div>
                          <div className="font-medium">{t('booking.selfPickup')}</div>
                          <div className="text-xs text-muted-foreground">
                            {t('booking.selfPickupDesc')} (-₹{Math.floor(equipment.transportCharge * 0.5)} {t('booking.discount')})
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Delivery Address Input - Only show when delivery is selected */}
                {deliveryOption === 'delivery' && (
                  <div className="mt-4 space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {t('booking.deliveryAddress')}
                    </Label>
                    <Input
                      placeholder={t('booking.enterAddress')}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full"
                    />
                    
                    {/* Estimated Delivery Time */}
                    {estimatedDelivery && (
                      <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <Clock className="w-4 h-4 text-primary" />
                        <div className="text-sm">
                          <span className="font-medium text-primary">{t('booking.estimatedDelivery')}: </span>
                          <span className="text-foreground">
                            {estimatedDelivery.time} ({estimatedDelivery.distance} km)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Price Breakdown */}
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('booking.base')} ({hours} {t('booking.hours')})</span>
                <span>₹{baseCost}</span>
              </div>
              {withOperator && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('booking.operatorCost')}</span>
                  <span>₹{totalOperatorCost}</span>
                </div>
              )}
              {withOperator ? (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('booking.transport')}</span>
                  <span>₹{equipment.transportCharge}</span>
                </div>
              ) : (
                <>
                  {deliveryOption === 'delivery' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('booking.deliveryCharge')}</span>
                      <span>₹{deliveryCost}</span>
                    </div>
                  )}
                  {deliveryOption === 'pickup' && pickupDiscount > 0 && (
                    <div className="flex justify-between text-sm text-secondary">
                      <span>{t('booking.pickupDiscount')}</span>
                      <span>-₹{pickupDiscount}</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                <span>{t('booking.totalCost')}</span>
                <span className="text-primary">₹{totalCost}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                {t('common.cancel')}
              </Button>
              <Button
                className="flex-1"
                onClick={handleBooking}
                disabled={loading || !date}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t('booking.confirm')
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}