import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void;
  propertyType: 'hotel' | 'office';
}

export function SearchFilters({ onFilterChange, propertyType }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [city, setCity] = useState('');

  const amenities = propertyType === 'hotel' 
    ? ['WiFi', 'Parking', 'Pool', 'Gym', 'Restaurant', 'Room Service', 'Breakfast', 'Spa']
    : ['WiFi', 'Parking', 'Meeting Rooms', 'Coffee', '24/7 Access', 'Printer', 'Kitchen', 'Lounge'];

  // dynamic amenities fetched from server (unique across collections). We merge with defaults above.
  const [fetchedAmenities, setFetchedAmenities] = useState<string[]>([]);

  // Fetch amenities from backend and merge with defaults
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/amenities');
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        if (Array.isArray(data?.amenities)) {
          setFetchedAmenities(data.amenities as string[]);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false };
  }, []);

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const applyFilters = () => {
    onFilterChange({
      city: city || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      rating: selectedRating !== 'all' ? parseInt(selectedRating) : undefined,
    });
    setIsOpen(false);
  };

  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedAmenities([]);
    setSelectedRating('all');
    setCity('');
    onFilterChange({});
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
          data-testid="button-toggle-filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {(selectedAmenities.length > 0 || selectedRating !== 'all' || city) && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
              {selectedAmenities.length + (selectedRating !== 'all' ? 1 : 0) + (city ? 1 : 0)}
            </span>
          )}
        </Button>
        {(selectedAmenities.length > 0 || selectedRating !== 'all' || city) && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="gap-2"
            data-testid="button-clear-filters"
          >
            <X className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <Label>City</Label>
              <Input
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                data-testid="input-filter-city"
              />
            </div>

            <div className="space-y-3">
              <Label>Price Range (₹{priceRange[0]} - ₹{priceRange[1]})</Label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={1000}
                step={10}
                className="mt-2"
                data-testid="slider-price-range"
              />
            </div>

            <div className="space-y-3">
              <Label>Rating</Label>
              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger data-testid="select-rating">
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any rating</SelectItem>
                  <SelectItem value="5">5 stars</SelectItem>
                  <SelectItem value="4">4+ stars</SelectItem>
                  <SelectItem value="3">3+ stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {[...new Set([...amenities, ...fetchedAmenities])].map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <Checkbox
                      id={amenity}
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                      data-testid={`checkbox-amenity-${amenity}`}
                    />
                    <Label htmlFor={amenity} className="text-sm cursor-pointer">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6 pt-6 border-t">
            <Button onClick={applyFilters} className="flex-1" data-testid="button-apply-filters">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)} data-testid="button-cancel-filters">
              Cancel
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
