import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Users, Loader2, CalendarX } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'wouter';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { getLocalBookings, updateLocalBooking, mergeBookings } from '@/lib/localStorage';

interface BookingWithProperty {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  property: {
    id: string;
    name: string;
    location: string;
    city: string;
    type: string;
    images: string[];
  };
}

export default function MyBookings() {
  const { userId } = useAuth();
  const { toast } = useToast();

  const { data: serverBookings, isLoading } = useQuery<BookingWithProperty[]>({
    queryKey: ['/api/bookings'],
    enabled: !!userId,
  });

  const localBookings = getLocalBookings();
  const bookings = serverBookings ? mergeBookings(serverBookings, localBookings) : localBookings.map(lb => ({
    id: lb.id,
    propertyId: lb.propertyId,
    userId: userId || '',
    checkIn: lb.checkIn,
    checkOut: lb.checkOut,
    guests: lb.guests,
    totalPrice: lb.totalPrice,
    status: lb.status,
    createdAt: lb.createdAt,
    property: {
      id: lb.propertyId,
      name: lb.propertyName,
      location: lb.propertyLocation,
      city: lb.propertyCity,
      type: lb.propertyType,
      images: lb.propertyImages,
    },
  }));

  const cancelMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      updateLocalBooking(bookingId, { status: 'cancelled' });
      return apiRequest('DELETE', `/api/bookings/${bookingId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      toast({
        title: 'Booking Cancelled',
        description: 'Your booking has been successfully cancelled.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Cancellation Failed',
        description: error?.message || 'There was an error cancelling your booking.',
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

  const upcomingBookings = bookings?.filter(b => 
    b.status === 'confirmed' && new Date(b.checkIn) >= new Date()
  ) || [];
  
  const pastBookings = bookings?.filter(b => 
    b.status === 'confirmed' && new Date(b.checkIn) < new Date()
  ) || [];

  const cancelledBookings = bookings?.filter(b => b.status === 'cancelled') || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">My Bookings</h1>
          <p className="text-lg text-muted-foreground">
            Manage your reservations and view booking history
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {bookings && bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <CalendarX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No bookings yet</h2>
            <p className="text-muted-foreground mb-6">
              Start exploring and book your perfect stay or workspace
            </p>
            <Link href="/">
              <Button>Browse Properties</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-12">
            {upcomingBookings.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Upcoming Bookings</h2>
                <div className="grid gap-6">
                  {upcomingBookings.map((booking) => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      onCancel={cancelMutation.mutate}
                      isPending={cancelMutation.isPending}
                    />
                  ))}
                </div>
              </div>
            )}

            {pastBookings.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Past Bookings</h2>
                <div className="grid gap-6">
                  {pastBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} isPast />
                  ))}
                </div>
              </div>
            )}

            {cancelledBookings.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Cancelled Bookings</h2>
                <div className="grid gap-6">
                  {cancelledBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} isCancelled />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({ 
  booking, 
  onCancel, 
  isPending,
  isPast = false,
  isCancelled = false
}: { 
  booking: BookingWithProperty;
  onCancel?: (id: string) => void;
  isPending?: boolean;
  isPast?: boolean;
  isCancelled?: boolean;
}) {
  const canCancel = !isPast && !isCancelled && new Date(booking.checkIn) > new Date();

  return (
    <Card className="overflow-hidden" data-testid={`booking-card-${booking.id}`}>
      <div className="grid md:grid-cols-4 gap-6 p-6">
        <div className="md:col-span-1">
          <img
            src={booking.property.images[0]}
            alt={booking.property.name}
            className="w-full h-48 md:h-full object-cover rounded-md"
          />
        </div>

        <div className="md:col-span-3 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link href={`/property/${booking.property.id}`}>
                <span className="text-2xl font-bold hover:text-primary transition-colors cursor-pointer" data-testid="link-property">
                  {booking.property.name}
                </span>
              </Link>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span>{booking.property.location}, {booking.property.city}</span>
              </div>
            </div>
            <Badge variant={isCancelled ? 'destructive' : isPast ? 'secondary' : 'default'}>
              {isCancelled ? 'Cancelled' : isPast ? 'Completed' : 'Confirmed'}
            </Badge>
          </div>

          <Separator />

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">Check-in</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(booking.checkIn), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">Check-out</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">{booking.property.type === 'hotel' ? 'Guests' : 'People'}</p>
                <p className="text-sm text-muted-foreground">{booking.guests}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
              <p className="text-2xl font-bold" data-testid="text-booking-total">
                ₹{booking.totalPrice}
              </p>
              <Badge variant="outline" className="mt-2">Pay Cash at Arrival</Badge>
            </div>
            <div className="flex gap-2">
              <Link href={`/property/${booking.property.id}`}>
                <Button variant="outline" data-testid="button-view-property">
                  View Property
                </Button>
              </Link>
              {canCancel && onCancel && (
                <Button
                  variant="destructive"
                  onClick={() => onCancel(booking.id)}
                  disabled={isPending}
                  data-testid="button-cancel-booking"
                >
                  {isPending ? 'Cancelling...' : 'Cancel Booking'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
