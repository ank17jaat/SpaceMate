export function serializeProperty(doc: any) {
  return {
    id: String(doc._id),
    ownerId: doc.ownerId || undefined,
    title: doc.title || "",
    description: doc.description || "",
    city: doc.city || "",
    address: doc.address || "",
    price: doc.price ?? 0,
    rating: doc.rating ?? 0,
    reviewCount: doc.reviewCount ?? 0,
    amenities: Array.isArray(doc.amenities) ? doc.amenities : [],
    images: Array.isArray(doc.images) ? doc.images : [],
    type: doc.type || "office",
    maxGuests: doc.capacity ?? 1,
    createdAt: doc.createdAt?.toISOString?.(),
  };
}

export function serializeBooking(doc: any) {
  return {
    id: String(doc._id),
    propertyId: doc.propertyId,
    userId: doc.userId,
    userEmail: doc.userEmail,
    checkIn: new Date(doc.checkIn).toISOString(),
    checkOut: new Date(doc.checkOut).toISOString(),
    guests: doc.guests,
    totalPrice: doc.totalPrice,
    status: doc.status,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
    property: {
      id: doc.propertyId,
      name: doc.propertySnapshot.title,
      location: doc.propertySnapshot.address,
      city: doc.propertySnapshot.city,
      type: doc.propertySnapshot.type,
      images: Array.isArray(doc.propertySnapshot.images) ? doc.propertySnapshot.images : [],
    },
  };
}
