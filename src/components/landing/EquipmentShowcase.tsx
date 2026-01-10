import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const featuredEquipment = [
  {
    id: '1',
    name: 'John Deere 5050D',
    type: 'Tractor',
    price: 600,
    rating: 4.9,
    reviews: 89,
    location: 'Pune, Maharashtra',
    image: 'https://images.unsplash.com/photo-1605002989198-39d64e57520c?w=800',
    features: ['50 HP', 'GPS', 'AC Cabin'],
  },
  {
    id: '3',
    name: 'DJI Agras T30',
    type: 'Drone',
    price: 1500,
    rating: 4.9,
    reviews: 156,
    location: 'Pune, Maharashtra',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800',
    features: ['30L Tank', 'AI Precision', 'Auto Mode'],
  },
  {
    id: '4',
    name: 'Kubota DC-70',
    type: 'Harvester',
    price: 2000,
    rating: 4.8,
    reviews: 45,
    location: 'Baramati, Maharashtra',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
    features: ['70 HP', 'Auto Thresh', '1400L Tank'],
  },
];

export function EquipmentShowcase() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % featuredEquipment.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % featuredEquipment.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + featuredEquipment.length) % featuredEquipment.length);
  };

  const currentEquipment = featuredEquipment[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section className="py-20 md:py-28 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('showcase.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('showcase.subtitle')}
          </p>
        </motion.div>

        <div className="relative">
          {/* Main Showcase Card */}
          <div className="relative h-[500px] md:h-[400px] overflow-hidden rounded-3xl">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute inset-0"
              >
                <div className="h-full grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative h-64 md:h-full">
                    <img
                      src={currentEquipment.image}
                      alt={currentEquipment.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80 md:to-background" />
                  </div>

                  {/* Content */}
                  <div className="relative p-8 md:p-12 flex flex-col justify-center bg-card md:bg-transparent">
                    <Badge className="w-fit mb-4" variant="secondary">
                      {currentEquipment.type}
                    </Badge>
                    
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">
                      {currentEquipment.name}
                    </h3>

                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-medium">{currentEquipment.rating}</span>
                        <span className="text-muted-foreground">({currentEquipment.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{currentEquipment.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {currentEquipment.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 bg-muted rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-3xl font-bold text-primary">
                          ₹{currentEquipment.price}
                        </span>
                        <span className="text-muted-foreground">{t('common.perHour')}</span>
                      </div>
                      <Button 
                        size="lg"
                        onClick={() => navigate(`/equipment/${currentEquipment.id}`)}
                        className="group"
                      >
                        {t('common.viewDetails')}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {featuredEquipment.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/equipment')}
            className="group"
          >
            {t('showcase.viewAll')}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
