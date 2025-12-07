import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CreditCard, 
  RefreshCw,
  Tractor,
  MapPin,
  IndianRupee,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore, Booking } from '@/store/bookingStore';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

// Mock payment history data
const mockPayments = [
  {
    id: '1',
    date: new Date('2024-02-15'),
    amount: 2400,
    status: 'completed',
    method: 'UPI',
    equipmentName: 'John Deere 5050D Tractor',
    transactionId: 'TXN123456789'
  },
  {
    id: '2',
    date: new Date('2024-02-10'),
    amount: 1500,
    status: 'completed',
    method: 'Card',
    equipmentName: 'Mahindra Rotavator',
    transactionId: 'TXN987654321'
  },
  {
    id: '3',
    date: new Date('2024-02-05'),
    amount: 3000,
    status: 'refunded',
    method: 'Wallet',
    equipmentName: 'DJI Agras T30 Drone',
    transactionId: 'TXN456789123'
  },
  {
    id: '4',
    date: new Date('2024-01-28'),
    amount: 800,
    status: 'completed',
    method: 'UPI',
    equipmentName: 'Seed Drill Machine',
    transactionId: 'TXN789123456'
  }
];

const statusConfig = {
  pending: { color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: AlertCircle },
  confirmed: { color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: CheckCircle },
  ongoing: { color: 'bg-primary/10 text-primary border-primary/20', icon: Clock },
  completed: { color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle },
  cancelled: { color: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle },
};

const paymentStatusConfig = {
  completed: { color: 'bg-green-500/10 text-green-600', label: 'Paid' },
  pending: { color: 'bg-yellow-500/10 text-yellow-600', label: 'Pending' },
  refunded: { color: 'bg-blue-500/10 text-blue-600', label: 'Refunded' },
  failed: { color: 'bg-destructive/10 text-destructive', label: 'Failed' },
};

export default function FarmerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { bookings } = useBookingStore();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Filter bookings for the logged-in farmer
  const farmerBookings = bookings.filter(b => b.farmerId === user?.id);
  
  // Get upcoming bookings (not completed or cancelled)
  const upcomingBookings = farmerBookings.filter(
    b => b.status !== 'completed' && b.status !== 'cancelled'
  );

  // Get dates with bookings for calendar highlighting
  const bookedDates = farmerBookings.map(b => b.startDate);

  const handleRebook = (booking: Booking) => {
    navigate(`/equipment/${booking.equipmentId}`);
  };

  const stats = [
    { label: 'Active Bookings', value: upcomingBookings.length, icon: Tractor, color: 'text-primary' },
    { label: 'Total Spent', value: '₹12,700', icon: IndianRupee, color: 'text-agri-gold' },
    { label: 'Completed Rentals', value: farmerBookings.filter(b => b.status === 'completed').length, icon: CheckCircle, color: 'text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, <span className="text-primary">{user?.name || 'Farmer'}</span>
            </h1>
            <p className="text-muted-foreground">
              Manage your equipment rentals and bookings
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="bookings" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                <TabsTrigger value="bookings" className="gap-2">
                  <Tractor className="w-4 h-4" />
                  <span className="hidden sm:inline">My Bookings</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Calendar</span>
                </TabsTrigger>
                <TabsTrigger value="payments" className="gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="hidden sm:inline">Payments</span>
                </TabsTrigger>
              </TabsList>

              {/* Bookings Tab */}
              <TabsContent value="bookings" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Your Bookings</h2>
                  <Button variant="outline" size="sm" onClick={() => navigate('/equipment')}>
                    Browse Equipment
                  </Button>
                </div>
                
                {farmerBookings.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="p-12 text-center">
                      <Tractor className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start by browsing available equipment
                      </p>
                      <Button onClick={() => navigate('/equipment')}>
                        Find Equipment
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {farmerBookings.map((booking) => {
                      const StatusIcon = statusConfig[booking.status].icon;
                      return (
                        <Card key={booking.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                              {/* Equipment Image Placeholder */}
                              <div className="w-full md:w-48 h-32 md:h-auto bg-muted flex items-center justify-center">
                                <Tractor className="w-12 h-12 text-muted-foreground" />
                              </div>
                              
                              {/* Booking Details */}
                              <div className="flex-1 p-4 md:p-6">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h3 className="font-semibold text-lg">{booking.equipmentName}</h3>
                                      <Badge 
                                        variant="outline" 
                                        className={statusConfig[booking.status].color}
                                      >
                                        <StatusIcon className="w-3 h-3 mr-1" />
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                      </Badge>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <CalendarIcon className="w-4 h-4" />
                                        {format(booking.startDate, 'MMM dd, yyyy')}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {booking.duration}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {booking.location}
                                      </span>
                                    </div>
                                    
                                    {booking.withOperator && (
                                      <Badge variant="secondary" className="text-xs">
                                        With Operator
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <div className="flex flex-col items-end gap-2">
                                    <p className="text-xl font-bold text-primary">
                                      ₹{booking.totalPrice.toLocaleString()}
                                    </p>
                                    {booking.status === 'completed' && (
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => handleRebook(booking)}
                                        className="gap-1"
                                      >
                                        <RefreshCw className="w-3 h-3" />
                                        Rebook
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* Calendar Tab */}
              <TabsContent value="calendar" className="space-y-4">
                <h2 className="text-xl font-semibold">Upcoming Rentals</h2>
                
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Rental Calendar</CardTitle>
                      <CardDescription>View your scheduled equipment rentals</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border pointer-events-auto"
                        modifiers={{
                          booked: bookedDates,
                        }}
                        modifiersStyles={{
                          booked: {
                            backgroundColor: 'hsl(var(--primary))',
                            color: 'hsl(var(--primary-foreground))',
                            borderRadius: '50%',
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Scheduled Rentals</CardTitle>
                      <CardDescription>
                        {upcomingBookings.length} upcoming {upcomingBookings.length === 1 ? 'rental' : 'rentals'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {upcomingBookings.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          No upcoming rentals scheduled
                        </p>
                      ) : (
                        upcomingBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                          >
                            <div className="p-2 rounded-full bg-primary/10">
                              <Tractor className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{booking.equipmentName}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(booking.startDate, 'MMM dd')} • {booking.duration}
                              </p>
                            </div>
                            <Badge 
                              variant="outline"
                              className={statusConfig[booking.status].color}
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value="payments" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Payment History</h2>
                  <Button variant="outline" size="sm">
                    Download Statement
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-4 font-medium">Date</th>
                            <th className="text-left p-4 font-medium">Equipment</th>
                            <th className="text-left p-4 font-medium">Method</th>
                            <th className="text-left p-4 font-medium">Status</th>
                            <th className="text-right p-4 font-medium">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {mockPayments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                              <td className="p-4">
                                <div>
                                  <p className="font-medium">{format(payment.date, 'MMM dd, yyyy')}</p>
                                  <p className="text-xs text-muted-foreground">{payment.transactionId}</p>
                                </div>
                              </td>
                              <td className="p-4">
                                <p className="font-medium">{payment.equipmentName}</p>
                              </td>
                              <td className="p-4">
                                <Badge variant="secondary">{payment.method}</Badge>
                              </td>
                              <td className="p-4">
                                <Badge 
                                  variant="outline"
                                  className={paymentStatusConfig[payment.status as keyof typeof paymentStatusConfig].color}
                                >
                                  {paymentStatusConfig[payment.status as keyof typeof paymentStatusConfig].label}
                                </Badge>
                              </td>
                              <td className="p-4 text-right">
                                <p className="font-semibold">
                                  {payment.status === 'refunded' ? '-' : ''}₹{payment.amount.toLocaleString()}
                                </p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}