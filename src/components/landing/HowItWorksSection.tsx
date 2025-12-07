import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, CalendarCheck, Tractor } from 'lucide-react';

const steps = [
  {
    key: 'step1',
    icon: Search,
    number: '01',
  },
  {
    key: 'step2',
    icon: CalendarCheck,
    number: '02',
  },
  {
    key: 'step3',
    icon: Tractor,
    number: '03',
  },
];

export function HowItWorksSection() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {steps.map((step, index) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative text-center"
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-7xl font-bold text-primary/10">
                {step.number}
              </div>

              {/* Icon */}
              <div className="relative z-10 w-20 h-20 mx-auto rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-lg">
                <step.icon className="w-10 h-10 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3">
                {t(`howItWorks.${step.key}`)}
              </h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                {t(`howItWorks.${step.key}Desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}