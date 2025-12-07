import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Star,
  MapPin,
  Clock,
  UserCheck,
  Fuel,
  Truck,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Wrench,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { equipmentService, Equipment } from '@/services/api';
import { BookingModal } from '@/components/booking/BookingModal';

const EquipmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    loadEquipment();
  }, [id]);

  const loadEquipment = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await equipmentService.getById(id);
      if (data) {
        setEquipment(data);
      }
    } catch (error) {
      console.error('Failed to load equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Equipment not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Equipment
          </Button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                <img
                  src={equipment.images[currentImage]}
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                />
                
                {equipment.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage((prev) => (prev - 1 + equipment.images.length) % equipment.images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImage((prev) => (prev + 1) % equipment.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-secondary text-secondary-foreground">
                    {equipment.status === 'available' ? t('common.available') : t('common.booked')}
                  </Badge>
                </div>
              </div>

              {/* Thumbnail Strip */}
              {equipment.images.length > 1 && (
                <div className="flex gap-2 mt-4">
                  {equipment.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        idx === currentImage ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span>{equipment.brand}</span>
                  <span>•</span>
                  <span>{equipment.model}</span>
                  <span>•</span>
                  <span>{equipment.year}</span>
                </div>
                <h1 className="text-3xl font-bold mb-3">{equipment.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span className="font-medium">{equipment.rating}</span>
                    <span className="text-muted-foreground">({equipment.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{equipment.location.village}, {equipment.location.district}</span>
                  </div>
                </div>
              </div>

              {/* Price Card */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">₹{equipment.pricePerHour}</div>
                    <div className="text-sm text-muted-foreground">{t('common.perHour')}</div>
                  </div>
                  <div className="text-center border-x border-border">
                    <div className="text-2xl font-bold text-primary">₹{equipment.pricePerDay}</div>
                    <div className="text-sm text-muted-foreground">{t('common.perDay')}</div>
                  </div>
                  {equipment.pricePerAcre && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">₹{equipment.pricePerAcre}</div>
                      <div className="text-sm text-muted-foreground">{t('common.perAcre')}</div>
                    </div>
                  )}
                </div>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => setShowBooking(true)}
                  disabled={equipment.status !== 'available'}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {t('common.bookNow')}
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{equipment.power}</div>
                    <div className="text-sm text-muted-foreground">Power</div>
                  </div>
                </div>
                {equipment.operatorAvailable && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <div className="font-medium">Operator</div>
                      <div className="text-sm text-muted-foreground">Available</div>
                    </div>
                  </div>
                )}
                {equipment.fuelIncluded && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Fuel className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">Fuel Included</div>
                      <div className="text-sm text-muted-foreground">No extra cost</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">₹{equipment.transportCharge}</div>
                    <div className="text-sm text-muted-foreground">Transport</div>
                  </div>
                </div>
              </div>

              {/* Equipment Features */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {equipment.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1.5 bg-muted rounded-lg text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Maintenance Info */}
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl mb-6">
                <Wrench className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Last Service: {equipment.lastService}</div>
                  <div className="text-sm text-muted-foreground">Regular maintenance kept up to date</div>
                </div>
              </div>

              {/* Owner Card */}
              <div className="border border-border rounded-2xl p-4">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={equipment.owner.avatar}
                    alt={equipment.owner.name}
                    className="w-14 h-14 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{equipment.owner.name}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span>{equipment.owner.rating}</span>
                      <span>•</span>
                      <span>{equipment.owner.totalRentals} rentals</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        equipment={equipment}
        open={showBooking}
        onClose={() => setShowBooking(false)}
      />
    </div>
  );
};

export default EquipmentDetailPage;