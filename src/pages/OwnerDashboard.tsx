import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Tractor, Calendar, DollarSign, TrendingUp, CheckCircle, XCircle, 
  Clock, Plus, Edit, Eye, Star, MapPin, Bell, Package, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Equipment {
  id: string;
  name: string;
  type: string;
  image: string;
  status: 'available' | 'booked' | 'maintenance';
  pricePerHour: number;
  totalEarnings: number;
  totalBookings: number;
  rating: number;
  location: string;
}

interface BookingRequest {
  id: string;
  equipmentId: string;
  equipmentName: string;
  farmerName: string;
  farmerPhone: string;
  date: string;
  duration: string;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'rejected';
  withOperator: boolean;
}

const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'John Deere 5310',
    type: 'Tractor',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400',
    status: 'available',
    pricePerHour: 800,
    totalEarnings: 45000,
    totalBookings: 32,
    rating: 4.8,
    location: 'Pune, Maharashtra',
  },
  {
    id: '2',
    name: 'Mahindra Harvester',
    type: 'Harvester',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400',
    status: 'booked',
    pricePerHour: 1500,
    totalEarnings: 78000,
    totalBookings: 28,
    rating: 4.6,
    location: 'Nashik, Maharashtra',
  },
  {
    id: '3',
    name: 'DJI Agras Drone',
    type: 'Drone',
    image: 'https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=400',
    status: 'maintenance',
    pricePerHour: 2000,
    totalEarnings: 52000,
    totalBookings: 18,
    rating: 4.9,
    location: 'Pune, Maharashtra',
  },
];

const mockBookingRequests: BookingRequest[] = [
  {
    id: 'REQ-001',
    equipmentId: '1',
    equipmentName: 'John Deere 5310',
    farmerName: 'Suresh Patil',
    farmerPhone: '+91 98765 43210',
    date: '2024-01-20',
    duration: '8 hours',
    totalAmount: 6400,
    status: 'pending',
    withOperator: true,
  },
  {
    id: 'REQ-002',
    equipmentId: '2',
    equipmentName: 'Mahindra Harvester',
    farmerName: 'Amit Sharma',
    farmerPhone: '+91 87654 32109',
    date: '2024-01-22',
    duration: '1 day',
    totalAmount: 12000,
    status: 'pending',
    withOperator: false,
  },
];

const mockEarnings = {
  thisMonth: 45000,
  lastMonth: 38000,
  pending: 18400,
  growth: 18.4,
};

const statusConfig = {
  available: { label: 'Available', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
  booked: { label: 'Booked', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  maintenance: { label: 'Maintenance', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
};

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [equipment] = useState<Equipment[]>(mockEquipment);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(mockBookingRequests);
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<'accept' | 'reject'>('accept');

  const pendingRequests = bookingRequests.filter((r) => r.status === 'pending');
  const totalEquipment = equipment.length;
  const availableEquipment = equipment.filter((e) => e.status === 'available').length;
  const totalEarnings = equipment.reduce((acc, e) => acc + e.totalEarnings, 0);

  const handleBookingAction = (request: BookingRequest, action: 'accept' | 'reject') => {
    setSelectedRequest(request);
    setDialogAction(action);
    setShowDialog(true);
  };

  const confirmAction = () => {
    if (!selectedRequest) return;
    
    setBookingRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? { ...r, status: dialogAction === 'accept' ? 'accepted' : 'rejected' }
          : r
      )
    );
    
    toast.success(
      dialogAction === 'accept' 
        ? 'Booking accepted! The farmer will be notified.' 
        : 'Booking declined.'
    );
    setShowDialog(false);
  };

  const stats = [
    {
      title: 'Total Equipment',
      value: totalEquipment,
      subtitle: `${availableEquipment} available`,
      icon: Tractor,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Pending Requests',
      value: pendingRequests.length,
      subtitle: 'Needs attention',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'This Month',
      value: `₹${mockEarnings.thisMonth.toLocaleString()}`,
      subtitle: `+${mockEarnings.growth}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total Earnings',
      value: `₹${(totalEarnings / 1000).toFixed(0)}K`,
      subtitle: 'All time',
      icon: DollarSign,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Owner Dashboard</h1>
              <p className="text-muted-foreground text-sm">Manage your equipment and bookings</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {pendingRequests.length}
                  </span>
                )}
              </Button>
              <Button onClick={() => navigate('/list-equipment')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{stat.title}</p>
                        <p className="text-xl font-bold mt-0.5">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                      </div>
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="equipment" className="space-y-4">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="equipment" className="gap-1.5">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Equipment</span>
              </TabsTrigger>
              <TabsTrigger value="requests" className="gap-1.5 relative">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Requests</span>
                {pendingRequests.length > 0 && (
                  <span className="ml-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {pendingRequests.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="earnings" className="gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Earnings</span>
              </TabsTrigger>
            </TabsList>

            {/* Equipment Tab */}
            <TabsContent value="equipment" className="space-y-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipment.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -2 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="relative h-36">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge
                          className={`absolute top-2 right-2 ${statusConfig[item.status].color}`}
                          variant="outline"
                        >
                          {statusConfig[item.status].label}
                        </Badge>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {item.location}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-primary">₹{item.pricePerHour}/hr</span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            {item.rating}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-muted rounded-lg p-2 text-center">
                            <p className="font-semibold">₹{(item.totalEarnings / 1000).toFixed(0)}K</p>
                            <p className="text-xs text-muted-foreground">Earned</p>
                          </div>
                          <div className="bg-muted rounded-lg p-2 text-center">
                            <p className="font-semibold">{item.totalBookings}</p>
                            <p className="text-xs text-muted-foreground">Bookings</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" className="flex-1" onClick={() => navigate(`/equipment/${item.id}`)}>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* Add Equipment Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -2 }}
                >
                  <Card 
                    className="h-full min-h-[300px] border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => navigate('/list-equipment')}
                  >
                    <CardContent className="text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <Plus className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1">Add Equipment</h3>
                      <p className="text-sm text-muted-foreground">List new equipment for rental</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            {/* Booking Requests Tab */}
            <TabsContent value="requests" className="space-y-3">
              {bookingRequests.length === 0 ? (
                <Card className="p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No booking requests yet</p>
                </Card>
              ) : (
                bookingRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className={request.status === 'pending' ? 'border-primary/50' : ''}>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold">{request.equipmentName}</h4>
                              <Badge
                                variant={
                                  request.status === 'pending'
                                    ? 'secondary'
                                    : request.status === 'accepted'
                                    ? 'default'
                                    : 'destructive'
                                }
                              >
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {request.farmerName} • {request.farmerPhone}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {request.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {request.duration}
                              </span>
                              {request.withOperator && (
                                <Badge variant="outline" className="text-xs py-0">
                                  With Operator
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-lg font-bold text-primary">
                              ₹{request.totalAmount.toLocaleString()}
                            </p>
                            {request.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleBookingAction(request, 'reject')}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleBookingAction(request, 'accept')}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </TabsContent>

            {/* Earnings Tab */}
            <TabsContent value="earnings" className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Monthly Earnings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">This Month</span>
                        <span className="font-semibold">₹{mockEarnings.thisMonth.toLocaleString()}</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Month</span>
                        <span className="font-semibold">₹{mockEarnings.lastMonth.toLocaleString()}</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div className="pt-2 border-t flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Growth</span>
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        +{mockEarnings.growth}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Pending Payout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary mb-4">
                      ₹{mockEarnings.pending.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your earnings will be transferred to your bank account within 2-3 business days.
                    </p>
                    <Button className="w-full">Request Payout</Button>
                  </CardContent>
                </Card>
              </div>

              {/* Equipment Performance */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Equipment Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {equipment.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.totalBookings} bookings</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{item.totalEarnings.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Total earned</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {/* Confirm Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'accept' ? 'Accept Booking' : 'Decline Booking'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'accept'
                ? `Accept booking from ${selectedRequest?.farmerName} for ${selectedRequest?.equipmentName}?`
                : `Decline booking from ${selectedRequest?.farmerName}?`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant={dialogAction === 'accept' ? 'default' : 'destructive'}
              onClick={confirmAction}
            >
              {dialogAction === 'accept' ? 'Accept' : 'Decline'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default OwnerDashboard;
