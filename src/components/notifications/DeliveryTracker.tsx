import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  Package, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Bell,
  X,
  Phone,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface DeliveryStatus {
  id: string;
  equipmentName: string;
  status: 'confirmed' | 'preparing' | 'dispatched' | 'in_transit' | 'arriving' | 'delivered';
  estimatedTime: number; // in minutes
  currentLocation?: string;
  driverName?: string;
  driverPhone?: string;
  distance?: number;
}

interface DeliveryTrackerProps {
  deliveryStatus: DeliveryStatus;
  onClose?: () => void;
  compact?: boolean;
}

const statusSteps = [
  { key: 'confirmed', icon: CheckCircle2, label: 'notifications.confirmed' },
  { key: 'preparing', icon: Package, label: 'notifications.preparing' },
  { key: 'dispatched', icon: Truck, label: 'notifications.dispatched' },
  { key: 'in_transit', icon: MapPin, label: 'notifications.inTransit' },
  { key: 'arriving', icon: Clock, label: 'notifications.arriving' },
  { key: 'delivered', icon: CheckCircle2, label: 'notifications.delivered' },
];

export function DeliveryTracker({ deliveryStatus, onClose, compact = false }: DeliveryTrackerProps) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; time: Date }>>([]);

  const currentStepIndex = statusSteps.findIndex(step => step.key === deliveryStatus.status);
  const progress = ((currentStepIndex + 1) / statusSteps.length) * 100;

  // Simulate notifications
  useEffect(() => {
    const statusMessages: Record<string, string> = {
      confirmed: t('notifications.bookingConfirmed'),
      preparing: t('notifications.equipmentPreparing'),
      dispatched: t('notifications.equipmentDispatched'),
      in_transit: t('notifications.equipmentOnWay'),
      arriving: t('notifications.equipmentArriving'),
      delivered: t('notifications.equipmentDelivered'),
    };

    const message = statusMessages[deliveryStatus.status];
    if (message) {
      setNotifications(prev => [
        { id: Date.now().toString(), message, time: new Date() },
        ...prev.slice(0, 4),
      ]);
    }
  }, [deliveryStatus.status, t]);

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-primary/10 rounded-xl border border-primary/20"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Truck className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">{deliveryStatus.equipmentName}</p>
              <p className="text-xs text-muted-foreground">
                {t(`notifications.${deliveryStatus.status}`)}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {deliveryStatus.estimatedTime} {t('booking.minutes')}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </motion.div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-xl">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">{t('notifications.trackingTitle')}</CardTitle>
              <p className="text-sm text-muted-foreground">{deliveryStatus.equipmentName}</p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Progress Steps */}
        <div className="relative mb-8">
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-muted">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="relative flex justify-between">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const StepIcon = step.icon;
              
              return (
                <div key={step.key} className="flex flex-col items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.2 : 1,
                      backgroundColor: isCompleted ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                    }}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center z-10",
                      isCompleted ? "text-primary-foreground" : "text-muted-foreground"
                    )}
                  >
                    <StepIcon className="h-5 w-5" />
                  </motion.div>
                  <span className={cn(
                    "text-xs mt-2 text-center max-w-[60px]",
                    isCompleted ? "text-primary font-medium" : "text-muted-foreground"
                  )}>
                    {t(step.label)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Status Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-muted/50 rounded-xl text-center">
            <Clock className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-xs text-muted-foreground">{t('notifications.eta')}</p>
            <p className="font-semibold">{deliveryStatus.estimatedTime} {t('booking.minutes')}</p>
          </div>
          {deliveryStatus.distance && (
            <div className="p-4 bg-muted/50 rounded-xl text-center">
              <MapPin className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground">{t('notifications.distance')}</p>
              <p className="font-semibold">{deliveryStatus.distance.toFixed(1)} km</p>
            </div>
          )}
        </div>

        {/* Driver Info */}
        {deliveryStatus.driverName && (
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="font-semibold text-primary">
                  {deliveryStatus.driverName.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium">{deliveryStatus.driverName}</p>
                <p className="text-xs text-muted-foreground">{t('notifications.driver')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {deliveryStatus.driverPhone && (
                <>
                  <Button variant="outline" size="icon" asChild>
                    <a href={`tel:${deliveryStatus.driverPhone}`}>
                      <Phone className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href={`sms:${deliveryStatus.driverPhone}`}>
                      <MessageSquare className="h-4 w-4" />
                    </a>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Recent Notifications */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t('notifications.recentUpdates')}</span>
          </div>
          <AnimatePresence mode="popLayout">
            {notifications.slice(0, 3).map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
              >
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {notification.time.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
