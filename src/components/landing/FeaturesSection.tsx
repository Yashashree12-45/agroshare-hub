import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  UserCheck,
  Headphones,
} from 'lucide-react';

const features = [
  {
    key: 'smartBooking',
    icon: Calendar,
    color: 'bg-primary',
  },
  {
    key: 'gpsTracking',
    icon: MapPin,
    color: 'bg-secondary',
  },
  {
    key: 'groupSharing',
    icon: Users,
    color: 'bg-accent',
  },
  {
    key: 'securePayments',
    icon: CreditCard,
    color: 'bg-agri-brown',
  },
  {
    key: 'operatorIncluded',
    icon: UserCheck,
    color: 'bg-primary',
  },
  {
    key: 'support',
    icon: Headphones,
    color: 'bg-secondary',
  },
];

export function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t(`features.${feature.key}`)}
              </h3>
              <p className="text-muted-foreground">
                {t(`features.${feature.key}Desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}