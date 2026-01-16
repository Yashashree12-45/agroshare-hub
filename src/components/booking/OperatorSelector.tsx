import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Clock, CheckCircle2, Award, ChevronDown, Phone, Shield, Languages, BadgeCheck } from 'lucide-react';
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
  const [expanded, setExpanded] = useState(true);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Filter operators based on equipment specialization
  const availableOperators = operators.filter(
    op => op.available && op.specializations.some(s => 
      equipmentType.toLowerCase().includes(s.toLowerCase()) ||
      s.toLowerCase().includes(equipmentType.toLowerCase().split(' ')[0])
    )
  );

  // Also show all available operators if no matches found
  const displayOperators = availableOperators.length > 0 
    ? availableOperators 
    : operators.filter(op => op.available);

  if (displayOperators.length === 0) {
    return (
      <div className="p-6 bg-muted/50 rounded-xl text-center">
        <Award className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
        <p className="text-muted-foreground">{t('operator.noOperatorsAvailable')}</p>
        <p className="text-sm text-muted-foreground/70 mt-1">{t('operator.checkBackLater')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        variant="ghost"
        className="w-full justify-between p-0 h-auto hover:bg-transparent"
        onClick={() => setExpanded(!expanded)}
      >
        <Label className="text-sm font-semibold cursor-pointer flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          {t('operator.selectOperator')} 
          <Badge variant="secondary" className="ml-1">
            {displayOperators.length} {t('operator.available')}
          </Badge>
        </Label>
        <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-3 overflow-hidden"
          >
            <RadioGroup
              value={selectedOperator?.id || ''}
              onValueChange={(value) => {
                const operator = displayOperators.find(op => op.id === value);
                onSelect(operator || null);
              }}
            >
              {displayOperators.map((operator) => (
                <motion.div
                  key={operator.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${
                    selectedOperator?.id === operator.id
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50 hover:shadow-sm'
                  }`}
                >
                  <div 
                    className="p-4"
                    onClick={() => onSelect(operator)}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value={operator.id} id={operator.id} className="mt-1" />
                      <div className="relative">
                        <img
                          src={operator.avatar}
                          alt={operator.name}
                          className="w-14 h-14 rounded-full ring-2 ring-primary/20"
                        />
                        {operator.verified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-secondary-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-lg">{operator.name}</span>
                          {operator.verified && (
                            <Badge variant="secondary" className="text-xs gap-1">
                              <BadgeCheck className="w-3 h-3" />
                              {t('operator.verified')}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-accent text-accent" />
                            <span className="font-medium text-foreground">{operator.rating}</span>
                            <span className="text-xs">({operator.completedJobs})</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-primary" />
                            {operator.experience} {t('operator.years')}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1.5">
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{operator.location}</span>
                        </div>

                        {/* Specializations */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {operator.specializations.slice(0, 3).map((spec, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs py-0">
                              {spec}
                            </Badge>
                          ))}
                          {operator.specializations.length > 3 && (
                            <Badge variant="outline" className="text-xs py-0">
                              +{operator.specializations.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <div className="text-lg font-bold text-primary">₹{operator.hourlyRate}</div>
                        <div className="text-xs text-muted-foreground">{t('operator.perHour')}</div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedOperator?.id === operator.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="px-4 pb-4 border-t border-primary/20 bg-primary/5"
                    >
                      <div className="pt-3 space-y-3">
                        {operator.bio && (
                          <p className="text-sm text-muted-foreground">{operator.bio}</p>
                        )}
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-primary" />
                            <span>{operator.phone}</span>
                          </div>
                          {operator.languages && (
                            <div className="flex items-center gap-2">
                              <Languages className="w-4 h-4 text-primary" />
                              <span>{operator.languages.join(', ')}</span>
                            </div>
                          )}
                        </div>

                        {operator.certifications && operator.certifications.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-muted-foreground">{t('operator.certifications')}:</span>
                            <div className="flex flex-wrap gap-1">
                              {operator.certifications.map((cert, idx) => (
                                <Badge key={idx} className="text-xs gap-1 bg-secondary/20 text-secondary-foreground">
                                  <CheckCircle2 className="w-3 h-3" />
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </RadioGroup>

            {availableOperators.length === 0 && displayOperators.length > 0 && (
              <p className="text-xs text-muted-foreground text-center py-2">
                {t('operator.showingAllOperators')}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
