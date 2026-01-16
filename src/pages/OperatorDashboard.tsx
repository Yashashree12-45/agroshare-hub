import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Briefcase, Star, Clock, MapPin, CheckCircle2, XCircle,
  TrendingUp, Calendar, Settings, Award, Phone, Mail, Edit2, Save, User
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/authStore';
import { useOperatorStore, Operator } from '@/store/operatorStore';
import { toast } from '@/hooks/use-toast';

// Mock job requests for operator
const mockJobRequests = [
  {
    id: '1',
    farmerName: 'Ramesh Jadhav',
    farmerPhone: '+91 98765 12345',
    equipment: 'John Deere 5050D Tractor',
    date: new Date('2024-02-20'),
    duration: '4 hours',
    location: 'Village Khed, Pune',
    payment: 2000,
    status: 'pending'
  },
  {
    id: '2',
    farmerName: 'Sunita Patil',
    farmerPhone: '+91 87654 23456',
    equipment: 'Mahindra Arjun 605',
    date: new Date('2024-02-22'),
    duration: '8 hours',
    payment: 4000,
    location: 'Village Shirur, Pune',
    status: 'pending'
  }
];

const mockCompletedJobs = [
  {
    id: '3',
    farmerName: 'Vijay Kumar',
    equipment: 'Harvester Pro 500',
    date: new Date('2024-02-10'),
    duration: '6 hours',
    payment: 3000,
    rating: 5,
    review: 'Excellent work, very professional!'
  },
  {
    id: '4',
    farmerName: 'Ganesh Bhosale',
    equipment: 'John Deere Tractor',
    date: new Date('2024-02-05'),
    duration: '4 hours',
    payment: 2000,
    rating: 4,
    review: 'Good operator, on time delivery'
  }
];

const OperatorDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { operators, updateOperator, setOperatorAvailability } = useOperatorStore();
  
  // Find current operator profile
  const currentOperator = operators.find(op => op.email === user?.email);
  
  const [isAvailable, setIsAvailable] = useState(currentOperator?.available ?? true);
  const [jobRequests, setJobRequests] = useState(mockJobRequests);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: currentOperator?.name || user?.name || '',
    phone: currentOperator?.phone || '',
    location: currentOperator?.location || '',
    hourlyRate: currentOperator?.hourlyRate?.toString() || '500',
    experience: currentOperator?.experience?.toString() || '0',
    bio: currentOperator?.bio || '',
    specializations: currentOperator?.specializations?.join(', ') || ''
  });

  useEffect(() => {
    if (currentOperator) {
      setIsAvailable(currentOperator.available);
      setProfileForm({
        name: currentOperator.name,
        phone: currentOperator.phone,
        location: currentOperator.location,
        hourlyRate: currentOperator.hourlyRate.toString(),
        experience: currentOperator.experience.toString(),
        bio: currentOperator.bio || '',
        specializations: currentOperator.specializations.join(', ')
      });
    }
  }, [currentOperator]);

  const stats = {
    completedJobs: currentOperator?.completedJobs || 0,
    rating: currentOperator?.rating || 0,
    earnings: 78500,
    thisMonth: 12500
  };

  const handleAvailabilityChange = (available: boolean) => {
    setIsAvailable(available);
    if (currentOperator) {
      setOperatorAvailability(currentOperator.id, available);
    }
  };

  const handleAcceptJob = (jobId: string) => {
    setJobRequests(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'accepted' } : job
    ));
    toast({
      title: 'Job Accepted',
      description: 'You have accepted this job request.',
    });
  };

  const handleRejectJob = (jobId: string) => {
    setJobRequests(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'rejected' } : job
    ));
  };

  const handleSaveProfile = () => {
    if (currentOperator) {
      updateOperator(currentOperator.id, {
        name: profileForm.name,
        phone: profileForm.phone,
        location: profileForm.location,
        hourlyRate: parseInt(profileForm.hourlyRate) || 500,
        experience: parseInt(profileForm.experience) || 0,
        bio: profileForm.bio,
        specializations: profileForm.specializations.split(',').map(s => s.trim()).filter(s => s)
      });
      toast({
        title: t('operator.profileUpdated'),
        description: 'Your profile has been updated successfully.',
      });
      setIsEditingProfile(false);
    }
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={currentOperator?.avatar || user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=operator'}
                alt={currentOperator?.name || user?.name}
                className="w-16 h-16 rounded-full ring-4 ring-primary/20"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {t('operator.welcome')}, {currentOperator?.name || user?.name || 'Operator'}!
                </h1>
                <p className="text-muted-foreground">{t('operator.dashboardSubtitle')}</p>
                {currentOperator?.verified && (
                  <Badge variant="secondary" className="mt-1 gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {t('operator.verified')}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl">
                <Switch
                  checked={isAvailable}
                  onCheckedChange={handleAvailabilityChange}
                  id="availability"
                />
                <Label htmlFor="availability" className={isAvailable ? 'text-secondary font-medium' : 'text-muted-foreground'}>
                  {isAvailable ? t('operator.available') : t('operator.unavailable')}
                </Label>
              </div>
              <Button variant="outline" onClick={() => navigate('/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                {t('nav.settings')}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('operator.completedJobs')}</p>
                    <p className="text-2xl font-bold">{stats.completedJobs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <Star className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('operator.rating')}</p>
                    <p className="text-2xl font-bold">{stats.rating > 0 ? stats.rating : 'New'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('operator.totalEarnings')}</p>
                    <p className="text-2xl font-bold">₹{stats.earnings.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-muted to-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-foreground/10 rounded-lg">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('operator.thisMonth')}</p>
                    <p className="text-2xl font-bold">₹{stats.thisMonth.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="requests">{t('operator.jobRequests')}</TabsTrigger>
            <TabsTrigger value="history">{t('operator.jobHistory')}</TabsTrigger>
            <TabsTrigger value="reviews">{t('operator.reviews')}</TabsTrigger>
            <TabsTrigger value="profile">{t('operator.profile')}</TabsTrigger>
          </TabsList>

          {/* Job Requests Tab */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  {t('operator.pendingRequests')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobRequests.filter(j => j.status === 'pending').length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{t('operator.noRequests')}</p>
                  </div>
                ) : (
                  jobRequests.filter(j => j.status === 'pending').map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-lg">{job.equipment}</h4>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(job.date, 'PPP')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {job.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium">{job.farmerName}</span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {job.farmerPhone}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xl font-bold text-primary">₹{job.payment}</span>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectJob(job.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              {t('operator.decline')}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptJob(job.id)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              {t('operator.accept')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  {t('operator.completedJobsList')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCompletedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-xl border bg-muted/30"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{job.equipment}</h4>
                        <p className="text-sm text-muted-foreground">
                          {job.farmerName} • {format(job.date, 'PP')} • {job.duration}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < job.rating ? 'fill-accent text-accent' : 'text-muted'}`}
                            />
                          ))}
                        </div>
                        <Badge variant="secondary">₹{job.payment}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  {t('operator.customerReviews')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCompletedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-xl border"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${job.farmerName}`}
                        alt={job.farmerName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{job.farmerName}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(job.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{job.review}</p>
                        <p className="text-xs text-muted-foreground mt-2">{format(job.date, 'PP')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    {t('operator.profile')}
                  </CardTitle>
                  {!isEditingProfile ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <Button size="sm" onClick={handleSaveProfile}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <img
                    src={currentOperator?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                    alt={profileForm.name}
                    className="w-24 h-24 rounded-full ring-4 ring-primary/20"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{profileForm.name}</h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                    {currentOperator?.verified ? (
                      <Badge variant="secondary" className="mt-2 gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Operator
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="mt-2">
                        Pending Verification
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      disabled={!isEditingProfile}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      disabled={!isEditingProfile}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      disabled={!isEditingProfile}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hourly Rate (₹)</Label>
                    <Input
                      type="number"
                      value={profileForm.hourlyRate}
                      onChange={(e) => setProfileForm({ ...profileForm, hourlyRate: e.target.value })}
                      disabled={!isEditingProfile}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Experience (years)</Label>
                    <Input
                      type="number"
                      value={profileForm.experience}
                      onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                      disabled={!isEditingProfile}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Specializations (comma-separated)</Label>
                    <Input
                      value={profileForm.specializations}
                      onChange={(e) => setProfileForm({ ...profileForm, specializations: e.target.value })}
                      disabled={!isEditingProfile}
                      placeholder="Tractor, Harvester, Drone"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    disabled={!isEditingProfile}
                    placeholder="Tell farmers about your experience and skills..."
                    rows={3}
                  />
                </div>

                {currentOperator?.certifications && currentOperator.certifications.length > 0 && (
                  <div className="space-y-2">
                    <Label>Certifications</Label>
                    <div className="flex flex-wrap gap-2">
                      {currentOperator.certifications.map((cert, idx) => (
                        <Badge key={idx} variant="secondary" className="gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default OperatorDashboard;
