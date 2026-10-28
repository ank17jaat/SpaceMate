import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { bookingsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface ReserveCashButtonProps {
  workspaceId: string;
  bookingDate: string;
  timeSlot?: string;
  fullDay?: boolean;
}

export default function ReserveCashButton({ workspaceId, bookingDate }: ReserveCashButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleReserve = async () => {
    setIsLoading(true);
    try {
      const checkIn = new Date(bookingDate).toISOString();
      const checkOut = new Date(
        new Date(bookingDate).getTime() + 24 * 60 * 60 * 1000,
      ).toISOString();

      await bookingsApi.create(
        {
          propertyId: workspaceId,
          checkIn,
          checkOut,
          guests: 1,
        },
        getToken,
      );

      toast({
        title: 'Booking created',
        description: 'Your reservation is confirmed. Pay cash on arrival.',
      });
      setLocation('/my-bookings');
    } catch (err: any) {
      toast({
        title: 'Booking failed',
        description: err?.message || 'Unable to create booking',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleReserve} disabled={isLoading} data-testid="button-reserve-cash">
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
      Reserve - Pay Cash on Arrival
    </Button>
  );
}
