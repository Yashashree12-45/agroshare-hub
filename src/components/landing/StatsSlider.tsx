import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Tractor, 
  Users, 
  MapPin, 
  IndianRupee,
  TrendingUp,
  Clock,
  Shield,
  Star
} from 'lucide-react';

const stats = [
  {
    key: 'equipment',
    value: 2500,
    suffix: '+',
    icon: Tractor,
    color: 'from-primary to-secondary',
  },
  {
    key: 'farmers',
    value: 15000,
    suffix: '+',
    icon: Users,
    color: 'from-secondary to-accent',
  },
  {
    key: 'villages',
    value: 500,
    suffix: '+',
    icon: MapPin,
    color: 'from-accent to-primary',
  },
  {
    key: 'saved',
    value: 200,
    prefix: '₹',
    suffix: 'L+',
    icon: IndianRupee,
    color: 'from-primary to-accent',
  },
];

const achievements = [
  { key: 'bookingsToday', value: '150+', icon: Clock },
  { key: 'rating', value: '4.8★', icon: Star },
  { key: 'uptime', value: '99.9%', icon: Shield },
  { key: 'growth', value: '+45%', icon: TrendingUp },
];

export function StatsSlider() {
  const { t } = useTranslation();
  const [currentStat, setCurrentStat] = useState(0);
  const [counts, setCounts] = useState(stats.map(() => 0));

  // Auto-rotate stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animate counting
  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setCounts((prev) =>
        prev.map((count, index) => {
          const target = stats[index].value;
          const increment = target / steps;
          return Math.min(count + increment, target);
        })
      );
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Main Stats Carousel */}
        <div className="relative h-32 mb-8">
          <AnimatePresence mode="wait">
            {stats.map((stat, index) =>
              index === currentStat ? (
                <motion.div
                  key={stat.key}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} mb-3`}>
                      <stat.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-foreground">
                      {stat.prefix}
                      {Math.floor(counts[index]).toLocaleString()}
                      {stat.suffix}
                    </div>
                    <p className="text-muted-foreground mt-1">
                      {t(`hero.stats.${stat.key}`)}
                    </p>
                  </div>
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {stats.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStat(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStat
                  ? 'bg-primary w-8'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>

        {/* Achievement Badges - Scrolling Marquee */}
        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="flex gap-6"
          >
            {[...achievements, ...achievements, ...achievements].map((achievement, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-full whitespace-nowrap"
              >
                <achievement.icon className="h-5 w-5 text-primary" />
                <span className="font-semibold">{achievement.value}</span>
                <span className="text-muted-foreground">{t(`stats.${achievement.key}`)}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
