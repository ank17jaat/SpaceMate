import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { SignInButton } from '@clerk/clerk-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Banknote } from 'lucide-react';
import { Property } from '@shared/schema';
import { format, differenceInDays } from 'date-fns';

interface BookingFormProps {
  property: Property;
  onBook: (bookingData: any) => void;
  isPending?: boolean;
}

export function BookingForm({ property, onBook, isPending }: BookingFormProps) {
  const { isSignedIn } = useAuth();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const today = new Date().toISOString().split('T')[0];
  const minCheckOut = checkIn || today;

  const nights = checkIn && checkOut 
    ? differenceInDays(new Date(checkOut), new Date(checkIn))
    : 0;
  
  const totalPrice = nights > 0 ? nights * property.pricePerNight : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || nights <= 0) return;

    onBook({
      propertyId: property.id,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests,
      totalPrice,
    });
  };

  return (
    <Card className="p-6 sticky top-24">
      <div className="mb-4 pb-4 border-b">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.pricePerNight)}</span>
          <span className="text-muted-foreground">
            / {property.type === 'hotel' ? 'night' : 'day'}
          </span>
        </div>
        <Badge variant="outline" className="gap-1">
          <Banknote className="h-3 w-3" />
          Pay Cash at Arrival
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="checkIn" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Check-in
            </Label>
            <Input
              id="checkIn"
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
              data-testid="input-checkin"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkOut" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Check-out
            </Label>
            <Input
              id="checkOut"
              type="date"
              min={minCheckOut}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
              data-testid="input-checkout"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guests" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {property.type === 'hotel' ? 'Guests' : 'People'}
          </Label>
          <Input
            id="guests"
            type="number"
            min={1}
            max={property.maxGuests || property.maxOccupancy || 10}
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            required
            data-testid="input-guests"
          />
        </div>

        {nights > 0 && (
          <div className="space-y-2 py-4 border-t border-b">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.pricePerNight)} × {nights} {property.type === 'hotel' ? 'nights' : 'days'}
              </span>
              <span className="font-medium">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalPrice)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span data-testid="text-total-price">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalPrice)}</span>
            </div>
          </div>
        )}

        {isSignedIn ? (
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isPending || !checkIn || !checkOut || nights <= 0}
            data-testid="button-reserve"
          >
            {isPending ? 'Processing...' : 'Reserve - Pay Cash at Arrival'}
          </Button>
        ) : (
          <SignInButton mode="modal">
            <Button type="button" className="w-full" size="lg" data-testid="button-signin-to-book">
              Sign In to Book
            </Button>
          </SignInButton>
        )}
      </form>

      <div className="mt-4 pt-4 border-t space-y-2 text-sm text-muted-foreground">
        <p className="flex items-start gap-2">
          <span className="text-primary">✓</span>
          Free cancellation up to 24 hours before check-in
        </p>
        <p className="flex items-start gap-2">
          <span className="text-primary">✓</span>
          Pay in cash at the property upon arrival
        </p>
        <p className="flex items-start gap-2">
          <span className="text-primary">✓</span>
          Instant booking confirmation
        </p>
      </div>
    </Card>
  );
}
