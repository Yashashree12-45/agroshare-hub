import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    name: 'Ramesh Jadhav',
    role: 'Farmer, Nashik',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ramesh',
    rating: 5,
    text: 'AgroToolAccess saved me ₹50,000 on harvester rental. The GPS tracking feature gave me peace of mind knowing exactly when the equipment would arrive.',
  },
  {
    name: 'Sunita Patil',
    role: 'Equipment Owner, Pune',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunita',
    rating: 5,
    text: 'My tractor now earns money even when I am not using it. The booking system is simple and payments are always on time.',
  },
  {
    name: 'Vijay Kumar',
    role: 'Farmer, Kolhapur',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vijay',
    rating: 5,
    text: 'The group booking feature let us share a drone among 5 farmers. We each paid only ₹400 per acre instead of buying our own.',
  },
  {
    name: 'Ganesh Bhosale',
    role: 'Farmer, Satara',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ganesh',
    rating: 5,
    text: 'Found a skilled operator through this platform. He handled my harvester with such expertise that I got 20% more yield!',
  },
  {
    name: 'Priya Deshmukh',
    role: 'Equipment Owner, Nagpur',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    rating: 4,
    text: 'Excellent platform! My idle equipment is now generating extra income. Customer support is very responsive.',
  },
];

export function TestimonialsSection() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Main Slider */}
          <div className="relative">
            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 rounded-full shadow-lg bg-background"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 rounded-full shadow-lg bg-background"
              onClick={handleNext}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Testimonial Card */}
            <div className="relative h-[320px] md:h-[280px]">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute inset-0"
                >
                  <div className="h-full p-8 md:p-10 rounded-3xl bg-card border border-border shadow-xl">
                    <div className="flex flex-col md:flex-row gap-6 h-full">
                      {/* Left side - Avatar and Info */}
                      <div className="flex md:flex-col items-center gap-4 md:w-48 md:border-r md:border-border md:pr-6">
                        <div className="relative">
                          <img
                            src={currentTestimonial.avatar}
                            alt={currentTestimonial.name}
                            className="w-16 h-16 md:w-20 md:h-20 rounded-full ring-4 ring-primary/20"
                          />
                          <Quote className="absolute -bottom-1 -right-1 w-6 h-6 text-primary bg-background rounded-full p-1" />
                        </div>
                        <div className="text-center md:mt-2">
                          <div className="font-semibold text-lg">{currentTestimonial.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {currentTestimonial.role}
                          </div>
                          <div className="flex gap-1 justify-center mt-2">
                            {[...Array(currentTestimonial.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 fill-accent text-accent"
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right side - Quote */}
                      <div className="flex-1 flex items-center">
                        <p className="text-lg md:text-xl text-foreground/80 italic leading-relaxed">
                          "{currentTestimonial.text}"
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          {/* Mini Cards Preview */}
          <div className="hidden md:flex justify-center gap-4 mt-8">
            {testimonials.map((testimonial, index) => (
              <motion.button
                key={testimonial.name}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`p-3 rounded-xl border transition-all ${
                  index === currentIndex
                    ? 'border-primary bg-primary/5 scale-105'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full"
                />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
