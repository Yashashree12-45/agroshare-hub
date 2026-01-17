import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Clock, 
  CreditCard, 
  RefreshCw,
  Tractor,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  Star,
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore, Booking } from '@/store/bookingStore';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const statusConfig = {
  pending: { color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: AlertCircle, label: 'Pending' },
  confirmed: { color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: CheckCircle, label: 'Confirmed' },
  ongoing: { color: 'bg-primary/10 text-primary border-primary/20', icon: Clock, label: 'Ongoing' },
  completed: { color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle, label: 'Delivered' },
  cancelled: { color: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle, label: 'Cancelled' },
};

// Recommended equipment based on user history
const recommendedEquipment = [
  { id: '1', name: 'John Deere 5310', type: 'Tractor', price: 800, rating: 4.8, image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200' },
  { id: '2', name: 'Mahindra Rotavator', type: 'Tiller', price: 500, rating: 4.6, image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200' },
  { id: '3', name: 'DJI Agras Drone', type: 'Drone', price: 2000, rating: 4.9, image: 'https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=200' },
];

export default function FarmerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { bookings } = useBookingStore();
  const navigate = useNavigate();

  // Filter bookings for the logged-in farmer
  const farmerBookings = bookings.filter(b => b.farmerId === user?.id);
  
  // Get active bookings
  const activeBookings = farmerBookings.filter(
    b => b.status !== 'completed' && b.status !== 'cancelled'
  );

  const handleRebook = (booking: Booking) => {
    navigate(`/equipment/${booking.equipmentId}`);
  };

  const stats = [
    { label: 'Active Orders', value: activeBookings.length, icon: Package, color: 'text-primary', bgColor: 'bg-primary/10' },
    { label: 'Completed', value: farmerBookings.filter(b => b.status === 'completed').length, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-500/10' },
    { label: 'Total Rentals', value: farmerBookings.length, icon: ShoppingBag, color: 'text-secondary', bgColor: 'bg-secondary/10' },
  ];

  const renderOrderCard = (booking: Booking) => {
    const StatusIcon = statusConfig[booking.status].icon;
    
    return (
      <motion.div
        key={booking.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="border rounded-xl overflow-hidden bg-card hover:shadow-md transition-all"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Equipment Image */}
          <div className="sm:w-36 h-28 sm:h-auto bg-muted flex items-center justify-center">
            <Tractor className="w-12 h-12 text-muted-foreground" />
          </div>
          
          {/* Order Details */}
          <div className="flex-1 p-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{booking.equipmentName}</h3>
                  <Badge 
                    variant="outline" 
                    className={statusConfig[booking.status].color}
                  >
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig[booking.status].label}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(booking.startDate, 'MMM dd')} • {booking.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {booking.location}
                  </span>
                </div>
                
                {booking.withOperator && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    With Operator
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">₹{booking.totalPrice.toLocaleString()}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleRebook(booking)}
                  className="gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Rebook
                </Button>
              </div>
            </div>

            {/* Order Progress - Flipkart style */}
            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
              <div className="mt-4 pt-3 border-t">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {['Confirmed', 'Preparing', 'On the way', 'Delivered'].map((step, idx) => {
                    const currentStep = booking.status === 'pending' ? 0 : 
                                        booking.status === 'confirmed' ? 1 : 
                                        booking.status === 'ongoing' ? 2 : 3;
                    const isActive = idx <= currentStep;
                    const isCurrent = idx === currentStep;
                    
                    return (
                      <div key={step} className="flex items-center">
                        <div className={`flex flex-col items-center min-w-[60px]`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          } ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                            {isActive ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span className={`text-[10px] mt-1 ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                            {step}
                          </span>
                        </div>
                        {idx < 3 && (
                          <div className={`w-8 h-0.5 mx-1 ${idx < currentStep ? 'bg-primary' : 'bg-muted'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Hi, <span className="text-primary">{user?.name || 'Farmer'}</span>!
            </h1>
            <p className="text-muted-foreground">
              Track your rentals and discover new equipment
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-4 text-center">
                  <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-2`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="orders" className="space-y-4">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="orders" className="gap-2">
                  <Package className="w-4 h-4" />
                  My Orders
                </TabsTrigger>
                <TabsTrigger value="discover" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Discover
                </TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-4">
                {farmerBookings.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="p-12 text-center">
                      <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start by browsing available equipment
                      </p>
                      <Button onClick={() => navigate('/equipment')}>
                        Browse Equipment
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {farmerBookings.map(renderOrderCard)}
                  </div>
                )}
              </TabsContent>

              {/* Discover Tab - Flipkart style recommendations */}
              <TabsContent value="discover" className="space-y-6">
                {/* Recently Viewed / Recommended */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Recommended for You
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/equipment')}>
                      View All <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {recommendedEquipment.map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ y: -4 }}
                        className="border rounded-xl overflow-hidden bg-card cursor-pointer"
                        onClick={() => navigate(`/equipment/${item.id}`)}
                      >
                        <div className="h-28 bg-muted">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.type}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-primary">₹{item.price}/hr</span>
                            <span className="text-xs flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                              {item.rating}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/equipment')}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Tractor className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Browse All</p>
                        <p className="text-xs text-muted-foreground">100+ Equipment</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/ai-recommend')}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium">AI Suggest</p>
                        <p className="text-xs text-muted-foreground">Get Recommendations</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
