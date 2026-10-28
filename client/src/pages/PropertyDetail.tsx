import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { CreateBookingInput, Property } from '@shared/schema';
import {
  Car,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Dumbbell,
  Loader2,
  MapPin,
  Star,
  Users,
  Utensils,
  Wifi,
} from 'lucide-react';
import { bookingsApi, propertiesApi } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { BookingForm } from '@/components/BookingForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const amenityIcons: Record<string, any> = {
  WiFi: Wifi,
  Parking: Car,
  Breakfast: Utensils,
  Coffee: Coffee,
  Gym: Dumbbell,
  'Meeting Rooms': Users,
  Pool: Users,
  Restaurant: Utensils,
  'Room Service': Utensils,
  Spa: Users,
  '24/7 Access': CheckCircle2,
  Printer: Users,
  Kitchen: Utensils,
  Lounge: Users,
};

export default function PropertyDetail() {
  const [, params] = useRoute('/property/:id');
  const [, setLocation] = useLocation();
  const { getToken } = useAuth();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: property, isLoading } = useQuery<Property>({
    queryKey: ['property', params?.id],
    queryFn: () => propertiesApi.getById(params!.id),
    enabled: !!params?.id,
  });

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: CreateBookingInput) => bookingsApi.create(bookingData, getToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      toast({
        title: 'Booking Confirmed!',
        description: 'Your reservation has been confirmed. Check your email.',
      });
      setLocation('/my-bookings');
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
        <Button variant="ghost" onClick={() => window.history.back()} className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <div className="relative aspect-[21/9] rounded-lg overflow-hidden mb-8 group">
          <img src={property.images[currentImageIndex]} alt={property.title} className="w-full h-full object-cover" />
          {property.images.length > 1 && (
            <>
              <Button
                size="icon"
                variant="secondary"
                className="absolute left-4 top-1/2 -translate-y-1/2"
                onClick={prevImage}
              >
                <ChevronLeft />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onClick={nextImage}
              >
                <ChevronRight />
              </Button>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">{property.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin />
                  <span>{property.address}, {property.city}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
                <Star className="fill-primary text-primary" />
                <span className="font-bold text-xl">{property.rating}</span>
                <span className="text-muted-foreground">({property.reviewCount} reviews)</span>
              </div>
            </div>

            <Badge variant="secondary">
              {property.type === 'hotel' ? 'Hotel' : 'Office Space'}
            </Badge>

            <Separator />

            <h2 className="text-2xl font-semibold mb-4">About this property</h2>
            <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>

            <Separator />

            <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {property.amenities.map((amenity, idx) => {
                const Icon = amenityIcons[amenity] || CheckCircle2;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span>{amenity}</span>
                  </div>
                );
              })}
            </div>
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
