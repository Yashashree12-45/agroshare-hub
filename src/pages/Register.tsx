import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Tractor, Mail, Lock, User, Loader2, Phone, Wrench, Package, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore, UserRole } from '@/store/authStore';
import { useOperatorStore } from '@/store/operatorStore';
import { toast } from '@/hooks/use-toast';

const roleConfig = {
  farmer: { 
    icon: User, 
    label: 'register.farmer', 
    desc: 'register.farmerDesc', 
    color: 'from-primary to-primary/80' 
  },
  owner: { 
    icon: Package, 
    label: 'register.owner', 
    desc: 'register.ownerDesc', 
    color: 'from-secondary to-secondary/80' 
  },
  operator: { 
    icon: Wrench, 
    label: 'register.operator', 
    desc: 'register.operatorDesc', 
    color: 'from-accent to-accent/80' 
  },
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { register, isLoading } = useAuthStore();
  const { addOperator } = useOperatorStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [specializations, setSpecializations] = useState('');
  const [hourlyRate, setHourlyRate] = useState('500');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState<UserRole>(
    (searchParams.get('role') as UserRole) || 'farmer'
  );

  const getDashboardPath = (userRole: UserRole) => {
    switch (userRole) {
      case 'operator': return '/operator-dashboard';
      case 'owner': return '/owner-dashboard';
      default: return '/dashboard';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast({
        title: t('register.error'),
        description: t('register.fillRequired'),
        variant: 'destructive',
      });
      return;
    }

    if (role === 'operator' && (!location || !experience)) {
      toast({
        title: t('register.error'),
        description: t('register.operatorFieldsRequired'),
        variant: 'destructive',
      });
      return;
    }

    try {
      await register(name, email, password, role);
      
      // If registering as operator, add to operator store
      if (role === 'operator') {
        addOperator({
          id: Date.now().toString(),
          name,
          email,
          phone,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          experience: parseInt(experience) || 0,
          rating: 0,
          completedJobs: 0,
          specializations: specializations.split(',').map(s => s.trim()).filter(s => s),
          location,
          hourlyRate: parseInt(hourlyRate) || 500,
          available: true,
          verified: false,
          bio,
          languages: ['Hindi', 'Marathi'],
          certifications: []
        });
      }

      toast({
        title: t('register.accountCreated'),
        description: t('register.welcomeMessage'),
      });
      navigate(getDashboardPath(role));
    } catch {
      toast({
        title: t('register.failed'),
        description: t('register.tryAgain'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/30 flex items-center justify-center p-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg"
          >
            <Tractor className="w-7 h-7 text-primary-foreground" />
          </motion.div>
          <span className="font-bold text-2xl">
            Agro<span className="text-primary">Tool</span><span className="text-secondary">Access</span>
          </span>
        </Link>

        {/* Form Card */}
        <div className="bg-card rounded-3xl border border-border p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">{t('nav.signup')}</h1>
            <p className="text-muted-foreground">{t('register.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <Label className="mb-3 block text-sm font-medium">{t('register.iWantTo')}</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['farmer', 'owner', 'operator'] as UserRole[]).map((r) => {
                  const config = roleConfig[r];
                  const Icon = config.icon;
                  return (
                    <motion.button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative py-3 px-2 rounded-xl border-2 text-center transition-all ${
                        role === r
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <span className={`text-xs font-medium ${role === r ? 'text-primary' : ''}`}>
                        {t(config.label)}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name">{t('register.fullName')}</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder={t('register.namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11 rounded-xl"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">{t('register.email')}</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('register.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">{t('register.phone')}</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 h-11 rounded-xl"
                />
              </div>
            </div>

            {/* Operator-specific fields */}
            {role === 'operator' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 p-4 bg-accent/10 rounded-xl border border-accent/20"
              >
                <p className="text-sm font-medium text-accent">{t('register.operatorDetails')}</p>
                
                <div>
                  <Label htmlFor="location">{t('register.location')}</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      type="text"
                      placeholder={t('register.locationPlaceholder')}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10 h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="experience">{t('register.experience')}</Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder={t('register.experiencePlaceholder')}
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="specializations">{t('register.specializations')}</Label>
                  <Textarea
                    id="specializations"
                    placeholder={t('register.specializationsPlaceholder')}
                    value={specializations}
                    onChange={(e) => setSpecializations(e.target.value)}
                    className="rounded-xl resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="hourlyRate">{t('register.hourlyRate')}</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      id="hourlyRate"
                      type="number"
                      placeholder="500"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="pl-8 h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">{t('register.bio')}</Label>
                  <Textarea
                    id="bio"
                    placeholder={t('register.bioPlaceholder')}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="rounded-xl resize-none"
                    rows={2}
                  />
                </div>
              </motion.div>
            )}

            {/* Password */}
            <div>
              <Label htmlFor="password">{t('register.password')}</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 rounded-xl"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                t('register.createAccount')
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('register.haveAccount')}{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              {t('nav.login')}
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground mt-4">
            {t('register.agreeTerms')}{' '}
            <Link to="/terms" className="underline">{t('register.terms')}</Link>
            {' '}{t('register.and')}{' '}
            <Link to="/privacy" className="underline">{t('register.privacy')}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
