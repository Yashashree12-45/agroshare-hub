import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Clock, CheckCircle2, Award, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useOperatorStore, Operator } from '@/store/operatorStore';

interface OperatorSelectorProps {
  equipmentType: string;
  onSelect: (operator: Operator | null) => void;
  selectedOperator: Operator | null;
}

export function OperatorSelector({ equipmentType, onSelect, selectedOperator }: OperatorSelectorProps) {
  const { t } = useTranslation();
  const { operators } = useOperatorStore();
  const [expanded, setExpanded] = useState(false);

  // Filter operators based on equipment specialization
  const availableOperators = operators.filter(
    op => op.available && op.specializations.some(s => 
      equipmentType.toLowerCase().includes(s.toLowerCase()) ||
      s.toLowerCase().includes(equipmentType.toLowerCase().split(' ')[0])
    )
  );

  if (availableOperators.length === 0) {
    return (
      <div className="p-4 bg-muted/50 rounded-xl text-center">
        <p className="text-sm text-muted-foreground">{t('operator.noOperatorsAvailable')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        variant="ghost"
        className="w-full justify-between p-0 h-auto"
        onClick={() => setExpanded(!expanded)}
      >
        <Label className="text-sm font-medium cursor-pointer">
          {t('operator.selectOperator')} ({availableOperators.length} {t('operator.available')})
        </Label>
        <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 overflow-hidden"
          >
            <RadioGroup
              value={selectedOperator?.id || ''}
              onValueChange={(value) => {
                const operator = availableOperators.find(op => op.id === value);
                onSelect(operator || null);
              }}
            >
              {availableOperators.map((operator) => (
                <motion.div
                  key={operator.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedOperator?.id === operator.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => onSelect(operator)}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value={operator.id} id={operator.id} className="mt-1" />
                    <img
                      src={operator.avatar}
                      alt={operator.name}
                      className="w-12 h-12 rounded-full ring-2 ring-primary/20"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{operator.name}</span>
                        {operator.verified && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {t('operator.verified')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-accent text-accent" />
                          {operator.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {operator.completedJobs} {t('operator.jobs')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {operator.experience} {t('operator.years')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{operator.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-primary">₹{operator.hourlyRate}</span>
                      <span className="text-xs text-muted-foreground">/hr</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </RadioGroup>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
