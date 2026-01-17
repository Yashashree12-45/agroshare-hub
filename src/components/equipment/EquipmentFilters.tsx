import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterState {
  type: string;
  priceRange: [number, number];
  status: string;
  operatorAvailable: boolean;
  fuelIncluded: boolean;
}

interface EquipmentFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const equipmentTypes = [
  { value: 'tractor', label: 'Tractors' },
  { value: 'harvester', label: 'Harvesters' },
  { value: 'drone', label: 'Drones' },
  { value: 'tiller', label: 'Tillers' },
  { value: 'sprayer', label: 'Sprayers' },
  { value: 'pump', label: 'Water Pumps' },
];

export function EquipmentFilters({ filters, onFilterChange }: EquipmentFiltersProps) {
  const { t } = useTranslation();

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      type: '',
      priceRange: [0, 5000],
      status: '',
      operatorAvailable: false,
      fuelIncluded: false,
    });
  };

  const hasActiveFilters =
    filters.type ||
    filters.status ||
    filters.operatorAvailable ||
    filters.fuelIncluded ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 5000;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">{t('common.filter')}</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search equipment..."
          className="pl-10"
        />
      </div>

      {/* Equipment Type */}
      <div className="mb-6">
        <Label className="mb-2 block">Equipment Type</Label>
        <Select
          value={filters.type || 'all'}
          onValueChange={(value) => updateFilter('type', value === 'all' ? '' : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {equipmentTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <Label className="mb-3 block font-medium">Max Price</Label>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">₹0</span>
            <span className="font-semibold text-primary">₹{filters.priceRange[1]}/hr</span>
          </div>
          <Slider
            value={[filters.priceRange[1]]}
            onValueChange={(value) => updateFilter('priceRange', [0, value[0]])}
            min={100}
            max={5000}
            step={100}
            className="mt-2"
          />
          <div className="flex gap-2 flex-wrap">
            {[500, 1000, 2000, 3000, 5000].map((price) => (
              <button
                key={price}
                onClick={() => updateFilter('priceRange', [0, price])}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  filters.priceRange[1] === price 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-muted hover:bg-muted/80 border-border'
                }`}
              >
                ₹{price}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mb-6">
        <Label className="mb-2 block">Availability</Label>
        <Select
          value={filters.status || 'any'}
          onValueChange={(value) => updateFilter('status', value === 'any' ? '' : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any status</SelectItem>
            <SelectItem value="available">Available Now</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="operator">Operator Available</Label>
          <Switch
            id="operator"
            checked={filters.operatorAvailable}
            onCheckedChange={(checked) => updateFilter('operatorAvailable', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="fuel">Fuel Included</Label>
          <Switch
            id="fuel"
            checked={filters.fuelIncluded}
            onCheckedChange={(checked) => updateFilter('fuelIncluded', checked)}
          />
        </div>
      </div>
    </div>
  );
}