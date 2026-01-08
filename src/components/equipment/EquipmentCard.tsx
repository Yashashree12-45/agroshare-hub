import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, MapPin, UserCheck, Fuel } from 'lucide-react';
import { Equipment } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EquipmentCardProps {
  equipment: Equipment;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const statusColors = {
    available: 'bg-secondary text-secondary-foreground',
    booked: 'bg-accent text-accent-foreground',
    'in-use': 'bg-destructive text-destructive-foreground',
    maintenance: 'bg-muted text-muted-foreground',
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on the button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/equipment/${equipment.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={equipment.images[0]}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={statusColors[equipment.status]}>
            {t(`common.${equipment.status === 'in-use' ? 'inUse' : equipment.status}`)}
          </Badge>
        </div>
        {equipment.operatorAvailable && (
          <div className="absolute top-3 right-3">
            <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground px-2 py-1 rounded-lg text-xs flex items-center gap-1">
              <UserCheck className="w-3 h-3" />
              {t('equipment.operator')}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name & Rating */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {equipment.name}
          </h3>
          <div className="flex items-center gap-1 text-sm flex-shrink-0">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-medium">{equipment.rating}</span>
            <span className="text-muted-foreground">({equipment.totalReviews})</span>
          </div>
        </div>

        {/* Location & Distance */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span>{equipment.location.village}, {equipment.location.district}</span>
          {equipment.distance && (
            <>
              <span className="mx-1">•</span>
              <span>{equipment.distance} km</span>
            </>
          )}
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs px-2 py-1 bg-muted rounded-md">{equipment.power}</span>
          {equipment.fuelIncluded && (
            <span className="text-xs px-2 py-1 bg-muted rounded-md flex items-center gap-1">
              <Fuel className="w-3 h-3" />
              {t('equipment.fuelIncluded')}
            </span>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-end justify-between pt-3 border-t border-border">
          <div>
            <div className="text-2xl font-bold text-primary">
              ₹{equipment.pricePerHour}
              <span className="text-sm font-normal text-muted-foreground">
                {t('common.perHour')}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              ₹{equipment.pricePerDay}{t('common.perDay')}
            </div>
          </div>
          <Button asChild size="sm" className="group-hover:bg-primary group-hover:shadow-md transition-all">
            <Link to={`/equipment/${equipment.id}`}>
              {t('common.bookNow')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}