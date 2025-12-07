import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Tractor, Wheat, Plane, Shovel, SprayCan, Droplet } from 'lucide-react';

const categories = [
  { key: 'tractors', icon: Tractor, count: 850 },
  { key: 'harvesters', icon: Wheat, count: 320 },
  { key: 'drones', icon: Plane, count: 180 },
  { key: 'tillers', icon: Shovel, count: 450 },
  { key: 'sprayers', icon: SprayCan, count: 290 },
  { key: 'pumps', icon: Droplet, count: 410 },
];

export function CategoriesSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
            {t('categories.title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <motion.button
              key={category.key}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/equipment?type=${category.key}`)}
              className="group p-6 rounded-2xl bg-card border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors">
                <category.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">
                {t(`categories.${category.key}`)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {category.count}+ available
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}