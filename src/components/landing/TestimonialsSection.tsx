import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Star, Quote } from 'lucide-react';

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
];

export function TestimonialsSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-32 bg-muted/50">
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

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-6 rounded-2xl bg-card border border-border"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground/80 mb-6 relative z-10">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full bg-muted"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}