export interface LocalStorageBooking {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyLocation: string;
  propertyCity: string;
  propertyType: string;
  propertyImages: string[];
  checkIn: string | Date;
  checkOut: string | Date;
  guests: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

const BOOKINGS_KEY = 'stayu_bookings';

export function getLocalBookings(): LocalStorageBooking[] {
  try {
    const data = localStorage.getItem(BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading local bookings:', error);
    return [];
  }
}

export function saveLocalBooking(booking: LocalStorageBooking): void {
  try {
    const bookings = getLocalBookings();
    bookings.push(booking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (error) {
    console.error('Error saving local booking:', error);
  }
}

export function updateLocalBooking(bookingId: string, updates: Partial<LocalStorageBooking>): void {
  try {
    const bookings = getLocalBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updates };
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    }
  } catch (error) {
    console.error('Error updating local booking:', error);
  }
}

export function deleteLocalBooking(bookingId: string): void {
  try {
    const bookings = getLocalBookings();
    const filtered = bookings.filter(b => b.id !== bookingId);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting local booking:', error);
  }
}

export function mergeBookings(serverBookings: any[], localBookings: LocalStorageBooking[]): any[] {
  const serverIds = new Set(serverBookings.map(b => b.id));
  const uniqueLocalBookings = localBookings
    .filter(lb => !serverIds.has(lb.id))
    .map(lb => ({
      id: lb.id,
      propertyId: lb.propertyId,
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
  
  return [...serverBookings, ...uniqueLocalBookings];
}
