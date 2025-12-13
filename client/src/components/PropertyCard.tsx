import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Wifi, Car, Coffee, Utensils, Dumbbell, Users, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Property } from '@shared/schema';
import { Link } from 'wouter';
import { useState } from 'react';

interface PropertyCardProps {
  property: Property;
}

const amenityIcons: Record<string, any> = {
  'WiFi': Wifi,
  'Parking': Car,
  'Breakfast': Utensils,
  'Coffee': Coffee,
  'Gym': Dumbbell,
  'Meeting Rooms': Users,
};

export function PropertyCard({ property }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link href={`/property/${property.id}`}>
      <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all h-full flex flex-col cursor-pointer" data-testid={`card-property-${property.id}`}>
          <div className="relative aspect-[4/3] overflow-hidden group">
            <img 
              src={property.images[currentImageIndex]} 
              alt={property.name}
              className="w-full h-full object-cover"
            />
            {property.images.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 bg-white/90 hover:bg-white"
                  onClick={prevImage}
                  data-testid="button-prev-image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 bg-white/90 hover:bg-white"
                  onClick={nextImage}
                  data-testid="button-next-image"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              size="icon"
              variant="secondary"
              className={`absolute top-3 right-3 h-9 w-9 bg-white/90 hover:bg-white ${isWishlisted ? 'text-red-500' : ''}`}
              onClick={toggleWishlist}
              data-testid="button-wishlist"
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </Button>
            <div className="absolute bottom-3 left-3 flex gap-1">
              {property.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all ${
                    idx === currentImageIndex ? 'w-6 bg-white' : 'w-1 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col gap-3">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-lg line-clamp-1" data-testid="text-property-name">
                  {property.name}
                </h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold text-sm">{property.rating}</span>
                  <span className="text-muted-foreground text-sm">
                    ({property.reviewCount})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{property.location}, {property.city}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {property.amenities.slice(0, 4).map((amenity, idx) => {
                const Icon = amenityIcons[amenity] || Wifi;
                return (
                  <Badge key={idx} variant="secondary" className="gap-1">
                    <Icon className="h-3 w-3" />
                    {amenity}
                  </Badge>
                );
              })}
            </div>

            <div className="mt-auto pt-3 border-t flex items-end justify-between">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold" data-testid="text-price">
                    ₹{property.pricePerNight}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    / {property.type === 'hotel' ? 'night' : 'day'}
                  </span>
                </div>
                <Badge variant="outline" className="mt-1 text-xs">
                  Pay Cash at Arrival
                </Badge>
              </div>
            </div>
          </div>
        </Card>
    </Link>
  );
}
