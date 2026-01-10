import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  Award, 
  CheckCircle2, 
  Zap,
  Lock,
  Headphones
} from 'lucide-react';

const badges = [
  {
    key: 'verified',
    icon: CheckCircle2,
    color: 'text-secondary',
  },
  {
    key: 'secure',
    icon: Lock,
    color: 'text-primary',
  },
  {
    key: 'fast',
    icon: Zap,
    color: 'text-accent',
  },
  {
    key: 'certified',
    icon: Award,
    color: 'text-secondary',
  },
  {
    key: 'protected',
    icon: Shield,
    color: 'text-primary',
  },
  {
    key: 'support',
    icon: Headphones,
    color: 'text-accent',
  },
];

export function TrustBadges() {
  const { t } = useTranslation();

  return (
    <section className="py-12 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mb-8"
        >
          {t('trust.trustedBy')}
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all group"
            >
              <badge.icon className={`h-8 w-8 ${badge.color} group-hover:scale-110 transition-transform`} />
              <span className="text-sm font-medium text-center">{t(`trust.${badge.key}`)}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
