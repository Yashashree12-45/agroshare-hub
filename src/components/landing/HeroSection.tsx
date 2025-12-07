import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Star, Users, Tractor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-farm.jpg';

const stats = [
  { key: 'equipment', value: '2,500+', icon: Tractor },
  { key: 'farmers', value: '15,000+', icon: Users },
  { key: 'villages', value: '500+', icon: MapPin },
  { key: 'saved', value: '₹2Cr+', icon: Star },
];

export function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Farm field with tractor"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 backdrop-blur-sm rounded-full text-secondary text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              Trusted by 15,000+ farmers
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-6 leading-tight"
          >
            {t('hero.title')}{' '}
            <span className="text-accent">{t('hero.titleHighlight')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-background/80 mb-8 max-w-xl"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="xl"
              variant="hero"
              onClick={() => navigate('/equipment')}
              className="group"
            >
              {t('hero.cta')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="xl"
              variant="heroOutline"
              onClick={() => navigate('/register?role=owner')}
            >
              {t('hero.ctaSecondary')}
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-background/20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-background">
                  {stat.value}
                </div>
                <div className="text-sm text-background/60">
                  {t(`hero.stats.${stat.key}`)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 rounded-full border-2 border-background/40 flex items-start justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-background/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}