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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Wheat, 
  LandPlot, 
  IndianRupee, 
  Loader2, 
  Tractor, 
  Star,
  MapPin,
  Clock
} from 'lucide-react';

const cropTypes = [
  { value: 'rice', label: 'Rice / धान' },
  { value: 'wheat', label: 'Wheat / गेहूं' },
  { value: 'cotton', label: 'Cotton / कपास' },
  { value: 'sugarcane', label: 'Sugarcane / गन्ना' },
  { value: 'vegetables', label: 'Vegetables / सब्जियां' },
  { value: 'fruits', label: 'Fruits / फल' },
  { value: 'pulses', label: 'Pulses / दालें' },
  { value: 'oilseeds', label: 'Oilseeds / तिलहन' },
  { value: 'maize', label: 'Maize / मक्का' },
  { value: 'soybean', label: 'Soybean / सोयाबीन' },
];

const soilTypes = [
  { value: 'clay', label: 'Clay / मिट्टी' },
  { value: 'sandy', label: 'Sandy / रेतीली' },
  { value: 'loamy', label: 'Loamy / दोमट' },
  { value: 'black', label: 'Black / काली मिट्टी' },
  { value: 'red', label: 'Red / लाल मिट्टी' },
];

const farmingStages = [
  { value: 'preparation', label: 'Land Preparation / भूमि तैयारी' },
  { value: 'sowing', label: 'Sowing / बुवाई' },
  { value: 'irrigation', label: 'Irrigation / सिंचाई' },
  { value: 'fertilizing', label: 'Fertilizing / उर्वरक' },
  { value: 'harvesting', label: 'Harvesting / कटाई' },
  { value: 'post-harvest', label: 'Post Harvest / कटाई के बाद' },
];

interface Recommendation {
  id: string;
  name: string;
  type: string;
  reason: string;
  pricePerDay: number;
  rating: number;
  distance: string;
  availability: string;
  image: string;
  matchScore: number;
}

const AIRecommendation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const [formData, setFormData] = useState({
    cropType: '',
    landSize: 5,
    budget: [1000, 5000] as [number, number],
    soilType: '',
    farmingStage: '',
  });

  const handleGetRecommendations = async () => {
    setLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI recommendations based on inputs
    const mockRecommendations: Recommendation[] = [
      {
        id: '1',
        name: formData.farmingStage === 'harvesting' ? 'John Deere Combine Harvester' : 'Mahindra 575 DI Tractor',
        type: formData.farmingStage === 'harvesting' ? 'Harvester' : 'Tractor',
        reason: `Perfect for ${formData.cropType} farming on ${formData.landSize} acres. High efficiency and fuel economy.`,
        pricePerDay: 2500,
        rating: 4.8,
        distance: '3.2 km',
        availability: 'Available Tomorrow',
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400',
        matchScore: 95,
      },
      {
        id: '2',
        name: formData.farmingStage === 'sowing' ? 'Seed Drill Machine' : 'Rotavator 6ft',
        type: formData.farmingStage === 'sowing' ? 'Seeder' : 'Tiller',
        reason: `Recommended for ${formData.soilType || 'your'} soil type. Great for ${formData.landSize}+ acres.`,
        pricePerDay: 1800,
        rating: 4.6,
        distance: '5.1 km',
        availability: 'Available Now',
        image: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=400',
        matchScore: 88,
      },
      {
        id: '3',
        name: 'Agricultural Drone Sprayer',
        type: 'Drone',
        reason: 'AI-powered precision spraying reduces pesticide costs by 30%. Ideal for large farms.',
        pricePerDay: 3500,
        rating: 4.9,
        distance: '8.4 km',
        availability: 'Available in 2 days',
        image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400',
        matchScore: 82,
      },
      {
        id: '4',
        name: 'Water Pump Set 5HP',
        type: 'Pump',
        reason: `Efficient irrigation solution within your budget of ₹${formData.budget[0]}-${formData.budget[1]}/day.`,
        pricePerDay: 800,
        rating: 4.5,
        distance: '2.1 km',
        availability: 'Available Now',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
        matchScore: 78,
      },
    ];
    
    setRecommendations(mockRecommendations);
    setShowResults(true);
    setLoading(false);
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
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">AI-Powered Recommendations</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Find the Perfect Equipment for Your Farm
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our AI analyzes your crop type, land size, budget, and farming stage to recommend the best equipment for maximum efficiency.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Tell Us About Your Farm
                  </CardTitle>
                  <CardDescription>
                    Fill in the details to get personalized equipment recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Crop Type */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Wheat className="w-4 h-4" />
                      Crop Type
                    </Label>
                    <Select
                      value={formData.cropType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, cropType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your crop type" />
                      </SelectTrigger>
                      <SelectContent>
                        {cropTypes.map((crop) => (
                          <SelectItem key={crop.value} value={crop.value}>
                            {crop.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Land Size */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <LandPlot className="w-4 h-4" />
                      Land Size: {formData.landSize} Acres
                    </Label>
                    <Slider
                      value={[formData.landSize]}
                      onValueChange={([value]) => setFormData(prev => ({ ...prev, landSize: value }))}
                      min={1}
                      max={100}
                      step={1}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 Acre</span>
                      <span>100 Acres</span>
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />
                      Daily Budget: ₹{formData.budget[0]} - ₹{formData.budget[1]}
                    </Label>
                    <Slider
                      value={formData.budget}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value as [number, number] }))}
                      min={500}
                      max={10000}
                      step={100}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹500/day</span>
                      <span>₹10,000/day</span>
                    </div>
                  </div>

                  {/* Soil Type */}
                  <div className="space-y-2">
                    <Label>Soil Type (Optional)</Label>
                    <Select
                      value={formData.soilType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, soilType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        {soilTypes.map((soil) => (
                          <SelectItem key={soil.value} value={soil.value}>
                            {soil.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Farming Stage */}
                  <div className="space-y-2">
                    <Label>Current Farming Stage</Label>
                    <Select
                      value={formData.farmingStage}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, farmingStage: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select farming stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {farmingStages.map((stage) => (
                          <SelectItem key={stage.value} value={stage.value}>
                            {stage.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleGetRecommendations}
                    disabled={!formData.cropType || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get AI Recommendations
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {!showResults ? (
                <Card className="border-dashed">
                  <CardContent className="py-20 text-center">
                    <Tractor className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
                    <p className="text-muted-foreground">
                      Fill in your farm details to get AI-powered equipment recommendations
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      Recommended for You
                    </h2>
                    <Badge variant="secondary">
                      {recommendations.length} matches
                    </Badge>
                  </div>

                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-48 h-48 md:h-auto relative">
                            <img
                              src={rec.image}
                              alt={rec.name}
                              className="w-full h-full object-cover"
                            />
                            <Badge 
                              className="absolute top-2 left-2"
                              variant={rec.matchScore >= 90 ? 'default' : 'secondary'}
                            >
                              {rec.matchScore}% Match
                            </Badge>
                          </div>
                          <CardContent className="flex-1 p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <Badge variant="outline" className="mb-2">
                                  {rec.type}
                                </Badge>
                                <h3 className="font-semibold text-lg">{rec.name}</h3>
                              </div>
                              <div className="flex items-center gap-1 text-amber-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="font-medium">{rec.rating}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {rec.reason}
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm mb-4">
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                {rec.distance}
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                {rec.availability}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-lg font-bold text-primary">
                                ₹{rec.pricePerDay.toLocaleString()}/day
                              </div>
                              <Button onClick={() => navigate(`/equipment/${rec.id}`)}>
                                Book Now
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AIRecommendation;
