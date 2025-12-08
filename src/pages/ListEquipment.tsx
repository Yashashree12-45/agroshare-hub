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
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const equipmentTypes = [
  { value: 'tractor', label: 'Tractor' },
  { value: 'harvester', label: 'Harvester' },
  { value: 'drone', label: 'Agricultural Drone' },
  { value: 'tiller', label: 'Tiller / Rotavator' },
  { value: 'pump', label: 'Water Pump' },
  { value: 'sprayer', label: 'Sprayer' },
  { value: 'seeder', label: 'Seeder / Planter' },
  { value: 'cultivator', label: 'Cultivator' },
  { value: 'trailer', label: 'Trailer' },
  { value: 'other', label: 'Other' },
];

const conditions = [
  { value: 'excellent', label: 'Excellent - Like New' },
  { value: 'good', label: 'Good - Well Maintained' },
  { value: 'fair', label: 'Fair - Working Condition' },
];

const benefits = [
  { icon: IndianRupee, title: 'Earn Extra Income', description: 'Make money from your idle equipment' },
  { icon: Shield, title: 'Full Insurance', description: 'We cover damage and theft' },
  { icon: Users, title: 'Verified Renters', description: 'Only verified farmers can book' },
  { icon: TrendingUp, title: 'Price Control', description: 'You set your own rates' },
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
      description: 'Your equipment is now visible to farmers. You will receive booking requests soon.',
    });
    navigate('/owner-dashboard');
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Tractor className="w-5 h-5" />
              <span className="font-medium">List Your Equipment</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Turn Your Idle Equipment Into Income
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join 5,000+ equipment owners earning an average of ₹15,000/month by renting their farm equipment
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-4 gap-4 mb-12"
          >
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-primary' : 'bg-muted'}`} />
                  )}
                </div>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {step === 1 && 'Equipment Details'}
                  {step === 2 && 'Pricing & Availability'}
                  {step === 3 && 'Photos & Review'}
                </CardTitle>
                <CardDescription>
                  {step === 1 && 'Tell us about your equipment'}
                  {step === 2 && 'Set your rental rates and preferences'}
                  {step === 3 && 'Add photos and review your listing'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
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
                        <Select
                          value={formData.type}
                          onValueChange={(value) => updateFormData('type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {equipmentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Brand</Label>
                        <Input
                          placeholder="e.g., Mahindra"
                          value={formData.brand}
                          onChange={(e) => updateFormData('brand', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Model</Label>
                        <Input
                          placeholder="e.g., 575 DI"
                          value={formData.model}
                          onChange={(e) => updateFormData('model', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Input
                          placeholder="e.g., 2020"
                          value={formData.year}
                          onChange={(e) => updateFormData('year', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Condition *</Label>
                      <Select
                        value={formData.condition}
                        onValueChange={(value) => updateFormData('condition', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {conditions.map((cond) => (
                            <SelectItem key={cond.value} value={cond.value}>
                              {cond.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe your equipment, its features, and any special notes..."
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        rows={4}
                      />
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
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <IndianRupee className="w-4 h-4" />
                          Price per Hour *
                        </Label>
                        <Input
                          type="number"
                          placeholder="e.g., 500"
                          value={formData.pricePerHour}
                          onChange={(e) => updateFormData('pricePerHour', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <IndianRupee className="w-4 h-4" />
                          Price per Day *
                        </Label>
                        <Input
                          type="number"
                          placeholder="e.g., 3000"
                          value={formData.pricePerDay}
                          onChange={(e) => updateFormData('pricePerDay', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Additional Options
                      </h3>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">Operator Available</div>
                          <div className="text-sm text-muted-foreground">
                            Can you provide an operator with the equipment?
                          </div>
                        </div>
                        <Switch
                          checked={formData.operatorAvailable}
                          onCheckedChange={(checked) => updateFormData('operatorAvailable', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">Fuel Included</div>
                          <div className="text-sm text-muted-foreground">
                            Is fuel cost included in the rental price?
                          </div>
                        </div>
                        <Switch
                          checked={formData.fuelIncluded}
                          onCheckedChange={(checked) => updateFormData('fuelIncluded', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">Delivery Available</div>
                          <div className="text-sm text-muted-foreground">
                            Can you deliver equipment to the renter's location?
                          </div>
                        </div>
                        <Switch
                          checked={formData.deliveryAvailable}
                          onCheckedChange={(checked) => updateFormData('deliveryAvailable', checked)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Equipment Photos</Label>
                      <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-2">
                          Drag and drop photos or click to upload
                        </p>
                        <Button variant="outline">Choose Files</Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          Add at least 3 photos. First photo will be the cover.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Review Your Listing</h3>
                      <Card className="bg-muted/50">
                        <CardContent className="pt-6">
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Equipment:</span>
                              <span className="ml-2 font-medium">{formData.name || 'Not set'}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Type:</span>
                              <span className="ml-2 font-medium">{formData.type || 'Not set'}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Location:</span>
                              <span className="ml-2 font-medium">{formData.location || 'Not set'}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Condition:</span>
                              <span className="ml-2 font-medium">{formData.condition || 'Not set'}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Price/Hour:</span>
                              <span className="ml-2 font-medium">₹{formData.pricePerHour || '0'}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Price/Day:</span>
                              <span className="ml-2 font-medium">₹{formData.pricePerDay || '0'}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {formData.operatorAvailable && (
                              <Badge variant="secondary">Operator Available</Badge>
                            )}
                            {formData.fuelIncluded && (
                              <Badge variant="secondary">Fuel Included</Badge>
                            )}
                            {formData.deliveryAvailable && (
                              <Badge variant="secondary">Delivery Available</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setStep(s => Math.max(1, s - 1))}
                    disabled={step === 1}
                  >
                    Previous
                  </Button>
                  {step < 3 ? (
                    <Button onClick={() => setStep(s => s + 1)}>
                      Continue
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

            {/* Testimonial */}
            <Card className="mt-8 bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                    alt="Owner"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm italic mb-2">
                      "I listed my tractor last year and have earned ₹2,50,000+ in rentals. The platform handles everything - bookings, payments, and even insurance!"
                    </p>
                    <p className="text-sm font-medium">- Rajesh Kumar, Tractor Owner from Maharashtra</p>
                  </div>
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
