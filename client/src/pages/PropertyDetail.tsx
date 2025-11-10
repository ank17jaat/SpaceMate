import { useQuery, useMutation } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { Property } from '@shared/schema';
import { BookingForm } from '@/components/BookingForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin, Wifi, Car, Coffee, Utensils, Dumbbell, Users, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@clerk/clerk-react';

const amenityIcons: Record<string, any> = {
  'WiFi': Wifi,
  'Parking': Car,
  'Breakfast': Utensils,
  'Coffee': Coffee,
  'Gym': Dumbbell,
  'Meeting Rooms': Users,
  'Pool': Users,
  'Restaurant': Utensils,
  'Room Service': Utensils,
  'Spa': Users,
  '24/7 Access': CheckCircle2,
  'Printer': Users,
  'Kitchen': Utensils,
  'Lounge': Users,
};

export default function PropertyDetail() {
  const [, params] = useRoute('/property/:id');
  const [, setLocation] = useLocation();
  const { userId } = useAuth();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: property, isLoading } = useQuery<Property>({
    queryKey: [`/api/properties/${params?.id}`],
    enabled: !!params?.id,
  });

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const localBooking = {
        id: `local-${Date.now()}`,
        ...bookingData,
        propertyName: property!.name,
        propertyLocation: property!.location,
        propertyCity: property!.city,
        propertyType: property!.type,
        propertyImages: property!.images,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      
      const savedBookings = JSON.parse(localStorage.getItem('stayu_bookings') || '[]');
      savedBookings.push(localBooking);
      localStorage.setItem('stayu_bookings', JSON.stringify(savedBookings));
      
      return apiRequest('POST', '/api/bookings', bookingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      toast({
        title: 'Booking Confirmed!',
        description: 'Your reservation has been confirmed. Pay in cash when you arrive.',
      });
      setLocation('/my-bookings' as any);
    },
    onError: () => {
      toast({
        title: 'Booking Failed',
        description: 'There was an error processing your booking. Please try again.',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
        <Button onClick={() => setLocation('/')}>Go Home</Button>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation(-1)}
          className="mb-6"
          data-testid="button-back"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <div className="relative aspect-[21/9] rounded-lg overflow-hidden mb-8 group">
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
                className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 hover:bg-white"
                onClick={prevImage}
                data-testid="button-prev-detail-image"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 hover:bg-white"
                onClick={nextImage}
                data-testid="button-next-detail-image"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {property.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
                }`}
                data-testid={`button-image-dot-${idx}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2" data-testid="text-property-title">
                    {property.name}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <span className="text-lg">{property.location}, {property.city}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="font-bold text-xl">{property.rating}</span>
                  <span className="text-muted-foreground">
                    ({property.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm">
                {property.type === 'hotel' ? 'Hotel' : 'Office Space'}
              </Badge>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-semibold mb-4">About this property</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {property.amenities.map((amenity, idx) => {
                  const Icon = amenityIcons[amenity] || CheckCircle2;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {(property.maxGuests || property.maxOccupancy) && (
              <>
                <Separator />
                <Card className="p-6 bg-muted/50">
                  <h3 className="font-semibold mb-3">Property Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {property.maxGuests && (
                      <div>
                        <span className="text-muted-foreground">Max Guests:</span>
                        <span className="ml-2 font-medium">{property.maxGuests}</span>
                      </div>
                    )}
                    {property.maxOccupancy && (
                      <div>
                        <span className="text-muted-foreground">Max Occupancy:</span>
                        <span className="ml-2 font-medium">{property.maxOccupancy}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </>
            )}
          </div>

          <div>
            <BookingForm 
              property={property} 
              onBook={(data) => bookingMutation.mutate(data)}
              isPending={bookingMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
