import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Tractor, Mail, Lock, Loader2, Wrench, User, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore, UserRole } from '@/store/authStore';
import { toast } from '@/hooks/use-toast';

const roleConfig = {
  farmer: { icon: User, label: 'login.farmer', desc: 'login.farmerDesc', color: 'from-primary to-primary/80' },
  owner: { icon: Package, label: 'login.owner', desc: 'login.ownerDesc', color: 'from-secondary to-secondary/80' },
  operator: { icon: Wrench, label: 'login.operator', desc: 'login.operatorDesc', color: 'from-accent to-accent/80' },
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');

  const getDashboardPath = (userRole: UserRole) => {
    switch (userRole) {
      case 'operator': return '/operator-dashboard';
      case 'owner': return '/owner-dashboard';
      default: return '/dashboard';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: t('login.error'),
        description: t('login.fillAllFields'),
        variant: 'destructive',
      });
      return;
    }

    try {
      await login(email, password, role);
      toast({
        title: t('login.welcomeBack'),
        description: t('login.successMessage'),
      });
      navigate(getDashboardPath(role));
    } catch {
      toast({
        title: t('login.failed'),
        description: t('login.checkCredentials'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/30 flex items-center justify-center p-4">
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
            <h1 className="text-2xl font-bold mb-2">{t('nav.login')}</h1>
            <p className="text-muted-foreground">{t('login.welcomeSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <Label className="mb-3 block text-sm font-medium">{t('login.iAmA')}</Label>
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
                      <span className={`text-sm font-medium ${role === r ? 'text-primary' : ''}`}>
                        {t(config.label)}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">{t('login.email')}</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('login.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="password">{t('login.password')}</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  {t('login.forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
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
                t('nav.login')
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('login.noAccount')}{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              {t('nav.signup')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
