import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Tractor, Plane, Droplets, Cog, Users, Star, ArrowRight } from 'lucide-react';

const equipmentPricing = [
  {
    category: 'Tractors',
    icon: Tractor,
    items: [
      { name: 'Mini Tractor (15-25 HP)', hourly: 300, daily: 2000, weekly: 10000 },
      { name: 'Medium Tractor (30-45 HP)', hourly: 450, daily: 3000, weekly: 15000 },
      { name: 'Heavy Tractor (50+ HP)', hourly: 600, daily: 4000, weekly: 22000 },
    ],
  },
  {
    category: 'Drones',
    icon: Plane,
    items: [
      { name: 'Agricultural Sprayer Drone', hourly: 500, daily: 3500, weekly: 18000 },
      { name: 'Survey/Mapping Drone', hourly: 400, daily: 2800, weekly: 14000 },
    ],
  },
  {
    category: 'Irrigation',
    icon: Droplets,
    items: [
      { name: 'Water Pump (3 HP)', hourly: 100, daily: 600, weekly: 3000 },
      { name: 'Water Pump (5 HP)', hourly: 150, daily: 900, weekly: 4500 },
      { name: 'Sprinkler System', hourly: 200, daily: 1200, weekly: 6000 },
    ],
  },
  {
    category: 'Tillers & Attachments',
    icon: Cog,
    items: [
      { name: 'Power Tiller', hourly: 250, daily: 1500, weekly: 8000 },
      { name: 'Rotavator (5ft)', hourly: 300, daily: 1800, weekly: 9000 },
      { name: 'Cultivator', hourly: 200, daily: 1200, weekly: 6000 },
      { name: 'Plough', hourly: 150, daily: 900, weekly: 4500 },
    ],
  },
];

const membershipPlans = [
  {
    name: 'Basic',
    price: 0,
    period: 'Free Forever',
    description: 'For occasional farmers',
    features: [
      'Browse all equipment',
      'Standard booking',
      'Email support',
      'Payment protection',
    ],
    popular: false,
  },
  {
    name: 'Farmer Pro',
    price: 299,
    period: '/month',
    description: 'For active farmers',
    features: [
      'Everything in Basic',
      '10% discount on all rentals',
      'Priority booking access',
      'Free operator (2 bookings/month)',
      'WhatsApp support',
      'Group booking feature',
    ],
    popular: true,
  },
  {
    name: 'Village Group',
    price: 999,
    period: '/month',
    description: 'For farming communities',
    features: [
      'Everything in Farmer Pro',
      '15% discount on all rentals',
      'Up to 10 farmer accounts',
      'Shared wallet & split payments',
      'Dedicated account manager',
      'Custom equipment requests',
      'Priority 24/7 support',
    ],
    popular: false,
  },
];

const Pricing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Transparent Pricing
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              No hidden fees. Pay only for what you use. All prices include insurance and basic maintenance.
            </p>
          </motion.div>

          {/* Membership Plans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Membership Plans
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {membershipPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <Card className={`relative h-full ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">
                          {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                        </span>
                        <span className="text-muted-foreground">{plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className="w-full" 
                        variant={plan.popular ? 'default' : 'outline'}
                        onClick={() => navigate('/register')}
                      >
                        {plan.price === 0 ? 'Get Started' : 'Subscribe Now'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Equipment Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-center mb-8">
              Equipment Rental Rates
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {equipmentPricing.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <category.icon className="w-5 h-5 text-primary" />
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {category.items.map((item) => (
                          <div
                            key={item.name}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <span className="font-medium text-sm">{item.name}</span>
                            <div className="flex gap-4 text-sm">
                              <div className="text-center">
                                <div className="font-semibold">₹{item.hourly}</div>
                                <div className="text-xs text-muted-foreground">/hr</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-primary">₹{item.daily}</div>
                                <div className="text-xs text-muted-foreground">/day</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold">₹{item.weekly.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">/week</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Additional Services</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="font-semibold">Operator</div>
                      <div className="text-muted-foreground">+₹200/hr</div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="font-semibold">Fuel</div>
                      <div className="text-muted-foreground">At actual cost</div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="font-semibold">Delivery</div>
                      <div className="text-muted-foreground">₹10/km</div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="font-semibold">Insurance</div>
                      <div className="text-muted-foreground">Included</div>
                    </div>
                  </div>
                  <Button className="mt-6" onClick={() => navigate('/equipment')}>
                    Browse Equipment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
