import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

interface ReserveCashButtonProps {
  workspaceId: string;
  userId: string;
  bookingDate: string; // ISO date or display string
  timeSlot?: string; // optional time slot
  fullDay?: boolean;
}

export default function ReserveCashButton({ workspaceId, userId, bookingDate, timeSlot, fullDay }: ReserveCashButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleReserve = async () => {
    setIsLoading(true);
    try {
      const payload: any = {
        workspaceId,
        userId,
        bookingDate,
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
      };

      if (fullDay) payload.fullDay = true;
      if (timeSlot) payload.timeSlot = timeSlot;

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to create booking');
      }

      const booking = await res.json();

      toast({ title: 'Booking created', description: 'Your reservation is confirmed. Pay cash on arrival.' });

      const id = booking.id || booking._id || booking._id?.toString();
      if (id) {
        setLocation(`/booking-confirmation/${id}`);
      } else {
        // fallback: navigate to bookings list
        setLocation('/my-bookings');
      }
    } catch (err: any) {
      console.error('Reserve failed', err);
      toast({ title: 'Booking failed', description: err?.message || 'Unable to create booking' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleReserve} disabled={isLoading} data-testid="button-reserve-cash">
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
      Reserve — Pay Cash on Arrival
    </Button>
  );
}
