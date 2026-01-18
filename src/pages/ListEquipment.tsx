import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Tractor, 
  Upload, 
  MapPin, 
  IndianRupee, 
  CheckCircle2,
  Clock,
  Users,
  Shield,
  TrendingUp,
  Camera,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const equipmentTypes = [
  { value: 'tractor', label: 'Tractor', icon: '🚜' },
  { value: 'harvester', label: 'Harvester', icon: '🌾' },
  { value: 'drone', label: 'Agricultural Drone', icon: '🚁' },
  { value: 'tiller', label: 'Tiller / Rotavator', icon: '⚙️' },
  { value: 'pump', label: 'Water Pump', icon: '💧' },
  { value: 'sprayer', label: 'Sprayer', icon: '💨' },
  { value: 'seeder', label: 'Seeder / Planter', icon: '🌱' },
  { value: 'cultivator', label: 'Cultivator', icon: '🔧' },
  { value: 'trailer', label: 'Trailer', icon: '🚛' },
  { value: 'other', label: 'Other', icon: '📦' },
];

const conditions = [
  { value: 'excellent', label: 'Excellent - Like New', description: 'Less than 1 year old, minimal usage' },
  { value: 'good', label: 'Good - Well Maintained', description: 'Regular maintenance, good working condition' },
  { value: 'fair', label: 'Fair - Working Condition', description: 'Older but functional, may need minor repairs' },
];

const benefits = [
  { icon: IndianRupee, title: 'Earn ₹15K+/month', description: 'Average owner earnings' },
  { icon: Shield, title: 'Full Insurance', description: 'Damage & theft covered' },
  { icon: Users, title: 'Verified Renters', description: 'Only verified farmers' },
  { icon: TrendingUp, title: 'You Set Prices', description: 'Full control over rates' },
];

const ListEquipment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    brand: '',
    model: '',
    year: '',
    condition: '',
    description: '',
    pricePerHour: '',
    pricePerDay: '',
    location: '',
    operatorAvailable: false,
    fuelIncluded: false,
    deliveryAvailable: true,
    images: [] as string[],
  });

  const handleSubmit = () => {
    toast({
      title: 'Equipment Listed Successfully!',
      description: 'Your equipment is now visible to farmers.',
    });
    navigate('/owner-dashboard');
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStep1Valid = formData.name && formData.type && formData.condition && formData.location;
  const isStep2Valid = formData.pricePerHour && formData.pricePerDay;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Tractor className="w-5 h-5" />
              <span className="font-medium">List Your Equipment</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Start Earning Today
            </h1>
            <p className="text-muted-foreground">
              Join 5,000+ owners earning by renting their equipment
            </p>
          </motion.div>

          {/* Benefits - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-3 bg-muted/50 rounded-xl">
                <benefit.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="font-medium text-sm">{benefit.title}</p>
                <p className="text-xs text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </motion.div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-1 mx-1 rounded ${step > s ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                  {step === 1 && 'Equipment Details'}
                  {step === 2 && 'Pricing & Options'}
                  {step === 3 && 'Photos & Review'}
                </CardTitle>
                <CardDescription>
                  {step === 1 && 'Tell us about your equipment'}
                  {step === 2 && 'Set your rental rates'}
                  {step === 3 && 'Add photos and submit'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {step === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label>Equipment Name *</Label>
                      <Input
                        placeholder="e.g., Mahindra 575 DI Tractor"
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Equipment Type *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {equipmentTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => updateFormData('type', type.value)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              formData.type === type.value 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <span className="text-lg mr-2">{type.icon}</span>
                            <span className="text-sm font-medium">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label>Brand</Label>
                        <Input
                          placeholder="Mahindra"
                          value={formData.brand}
                          onChange={(e) => updateFormData('brand', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Model</Label>
                        <Input
                          placeholder="575 DI"
                          value={formData.model}
                          onChange={(e) => updateFormData('model', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Input
                          placeholder="2020"
                          value={formData.year}
                          onChange={(e) => updateFormData('year', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Condition *</Label>
                      <div className="space-y-2">
                        {conditions.map((cond) => (
                          <button
                            key={cond.value}
                            type="button"
                            onClick={() => updateFormData('condition', cond.value)}
                            className={`w-full p-3 rounded-xl border text-left transition-all ${
                              formData.condition === cond.value 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <p className="font-medium text-sm">{cond.label}</p>
                            <p className="text-xs text-muted-foreground">{cond.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location *
                      </Label>
                      <Input
                        placeholder="Village/City, District, State"
                        value={formData.location}
                        onChange={(e) => updateFormData('location', e.target.value)}
                      />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <IndianRupee className="w-4 h-4" />
                          Price per Hour *
                        </Label>
                        <Input
                          type="number"
                          placeholder="500"
                          min="0"
                          value={formData.pricePerHour}
                          onChange={(e) => {
                            const value = Math.max(0, Number(e.target.value));
                            updateFormData('pricePerHour', value.toString());
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <IndianRupee className="w-4 h-4" />
                          Price per Day *
                        </Label>
                        <Input
                          type="number"
                          placeholder="3000"
                          min="0"
                          value={formData.pricePerDay}
                          onChange={(e) => {
                            const value = Math.max(0, Number(e.target.value));
                            updateFormData('pricePerDay', value.toString());
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Additional Options
                      </Label>
                      
                      {[
                        { 
                          key: 'operatorAvailable', 
                          label: 'Operator Available', 
                          description: 'Can provide an operator' 
                        },
                        { 
                          key: 'fuelIncluded', 
                          label: 'Fuel Included', 
                          description: 'Fuel cost in rental price' 
                        },
                        { 
                          key: 'deliveryAvailable', 
                          label: 'Delivery Available', 
                          description: 'Can deliver to location' 
                        },
                      ].map((option) => (
                        <div 
                          key={option.key}
                          className="flex items-center justify-between p-3 border rounded-xl"
                        >
                          <div>
                            <div className="font-medium text-sm">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                          <Switch
                            checked={formData[option.key as keyof typeof formData] as boolean}
                            onCheckedChange={(checked) => updateFormData(option.key, checked)}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label>Description (Optional)</Label>
                      <Textarea
                        placeholder="Add any additional details about your equipment..."
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="space-y-2">
                      <Label>Equipment Photos</Label>
                      <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <Camera className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground text-sm mb-2">
                          Tap to add photos
                        </p>
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Files
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          Add at least 3 clear photos
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Review Your Listing</Label>
                      <div className="p-4 bg-muted/50 rounded-xl space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Equipment</span>
                          <span className="font-medium">{formData.name || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Type</span>
                          <span className="font-medium">{equipmentTypes.find(t => t.value === formData.type)?.label || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Location</span>
                          <span className="font-medium">{formData.location || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Hourly Rate</span>
                          <span className="font-medium text-primary">₹{formData.pricePerHour || '0'}/hr</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Daily Rate</span>
                          <span className="font-medium text-primary">₹{formData.pricePerDay || '0'}/day</span>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2 border-t">
                          {formData.operatorAvailable && (
                            <Badge variant="secondary">Operator</Badge>
                          )}
                          {formData.fuelIncluded && (
                            <Badge variant="secondary">Fuel Included</Badge>
                          )}
                          {formData.deliveryAvailable && (
                            <Badge variant="secondary">Delivery</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(s => Math.max(1, s - 1))}
                    disabled={step === 1}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  {step < 3 ? (
                    <Button 
                      onClick={() => setStep(s => s + 1)}
                      disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit}>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      List Equipment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ListEquipment;
