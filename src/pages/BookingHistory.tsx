import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Package, Calendar, Clock, MapPin, Truck, CheckCircle2,
  XCircle, Timer, RefreshCw, ChevronRight, Filter, Search
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore } from '@/store/authStore';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-500', icon: Timer },
  confirmed: { label: 'Confirmed', color: 'bg-blue-500', icon: CheckCircle2 },
  ongoing: { label: 'In Progress', color: 'bg-primary', icon: Truck },
  completed: { label: 'Delivered', color: 'bg-secondary', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-destructive', icon: XCircle },
};

const BookingHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { bookings } = useBookingStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const userBookings = bookings.filter(b => b.farmerId === user?.id || b.farmerId === '1');

  const filteredBookings = userBookings.filter(booking => {
    const matchesSearch = booking.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeBookings = filteredBookings.filter(b => ['pending', 'confirmed', 'ongoing'].includes(b.status));
  const pastBookings = filteredBookings.filter(b => ['completed', 'cancelled'].includes(b.status));

  const BookingCard = ({ booking }: { booking: typeof bookings[0] }) => {
    const status = statusConfig[booking.status];
    const StatusIcon = status.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
      >
        {/* Status Bar */}
        <div className={`h-1 ${status.color}`} />
        
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{booking.equipmentName}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('bookingHistory.orderId')}: #{booking.id.slice(-6).toUpperCase()}
                </p>
              </div>
            </div>
            <Badge className={`${status.color} text-white gap-1`}>
              <StatusIcon className="w-3 h-3" />
              {t(`bookingHistory.${booking.status}`)}
            </Badge>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{format(booking.startDate, 'PP')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{booking.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="truncate">{booking.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {booking.withOperator ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span>{t('bookingHistory.withOperator')}</span>
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4 text-primary" />
                  <span>{t('bookingHistory.selfOperated')}</span>
                </>
              )}
            </div>
          </div>

          {/* Progress Timeline for Active Bookings */}
          {['confirmed', 'ongoing'].includes(booking.status) && (
            <div className="mb-4 p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t('bookingHistory.trackingProgress')}</span>
                <Button variant="ghost" size="sm" onClick={() => navigate('/tracking')}>
                  {t('bookingHistory.trackLive')}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {['Confirmed', 'Dispatched', 'In Transit', 'Delivered'].map((step, index) => (
                  <div key={step} className="flex-1 flex items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      index <= (booking.status === 'ongoing' ? 2 : 1) 
                        ? 'bg-primary' 
                        : 'bg-muted-foreground/30'
                    }`} />
                    {index < 3 && (
                      <div className={`flex-1 h-0.5 ${
                        index < (booking.status === 'ongoing' ? 2 : 1) 
                          ? 'bg-primary' 
                          : 'bg-muted-foreground/30'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Confirmed</span>
                <span className="text-xs text-muted-foreground">Delivered</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(`/equipment/${booking.equipmentId}`)}>
              {t('bookingHistory.viewDetails')}
            </Button>
            {booking.status === 'completed' && (
              <Button size="sm" variant="secondary" onClick={() => navigate(`/equipment/${booking.equipmentId}`)}>
                <RefreshCw className="w-4 h-4 mr-1" />
                {t('bookingHistory.bookAgain')}
              </Button>
            )}
            {booking.status === 'pending' && (
              <Button size="sm" variant="destructive">
                {t('bookingHistory.cancelBooking')}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">{t('bookingHistory.title')}</h1>
          <p className="text-muted-foreground">{t('bookingHistory.subtitle')}</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('bookingHistory.searchPlaceholder')}
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
              <SelectItem value="all">{t('bookingHistory.allOrders')}</SelectItem>
              <SelectItem value="pending">{t('bookingHistory.pending')}</SelectItem>
              <SelectItem value="confirmed">{t('bookingHistory.confirmed')}</SelectItem>
              <SelectItem value="ongoing">{t('bookingHistory.ongoing')}</SelectItem>
              <SelectItem value="completed">{t('bookingHistory.completed')}</SelectItem>
              <SelectItem value="cancelled">{t('bookingHistory.cancelled')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
            <TabsTrigger value="active" className="gap-2">
              <Truck className="w-4 h-4" />
              {t('bookingHistory.activeOrders')} ({activeBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {t('bookingHistory.pastOrders')} ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeBookings.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-2xl">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">{t('bookingHistory.noActiveOrders')}</h3>
                <p className="text-muted-foreground mb-4">{t('bookingHistory.noActiveOrdersDesc')}</p>
                <Button onClick={() => navigate('/equipment')}>
                  {t('bookingHistory.browseEquipment')}
                </Button>
              </div>
            ) : (
              activeBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-2xl">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">{t('bookingHistory.noPastOrders')}</h3>
                <p className="text-muted-foreground">{t('bookingHistory.noPastOrdersDesc')}</p>
              </div>
            ) : (
              pastBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default BookingHistory;
