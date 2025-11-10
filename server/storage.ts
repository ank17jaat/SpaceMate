import { type Property, type InsertProperty, type Booking, type InsertBooking, type SearchPropertiesParams } from "@shared/schema";
import { randomUUID } from "crypto";

// Image URLs for properties
const hotelRoom = '/attached_assets/generated_images/Modern_hotel_room_b1b4d699.png';
const coworkingSpace = '/attached_assets/generated_images/Modern_coworking_space_4537f3cf.png';
const hotelExterior = '/attached_assets/generated_images/Boutique_hotel_exterior_bb3267f0.png';
const hotelPool = '/attached_assets/generated_images/Hotel_pool_amenity_f8592233.png';
const privateOffice = '/attached_assets/generated_images/Private_office_space_a5b90d09.png';

export interface IStorage {
  // Properties
  getProperties(filters?: SearchPropertiesParams): Promise<Property[]>;
  getPropertyById(id: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;

  // Bookings
  getBookingsByUserId(userId: string): Promise<any[]>;
  getBookingById(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  cancelBooking(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private properties: Map<string, Property>;
  private bookings: Map<string, Booking>;

  constructor() {
    this.properties = new Map();
    this.bookings = new Map();
    this.seedProperties();
  }

  private seedProperties() {
    const mockProperties: InsertProperty[] = [
      {
        name: "Grand Luxe Hotel & Spa",
        type: "hotel",
        description: "Experience unparalleled luxury in the heart of the city. Our 5-star hotel features elegantly appointed rooms with stunning city views, a world-class spa, rooftop pool, and award-winning dining. Perfect for both business and leisure travelers seeking sophistication and comfort.\n\nEach room is equipped with premium amenities, high-speed WiFi, and 24-hour room service. Our concierge team is available around the clock to ensure your stay is nothing short of exceptional.",
        location: "Downtown District",
        city: "New York",
        pricePerNight: 350,
        rating: 5,
        reviewCount: 1247,
        images: [hotelExterior, hotelRoom, hotelPool, hotelExterior],
        amenities: ["WiFi", "Parking", "Pool", "Gym", "Restaurant", "Room Service", "Spa", "Breakfast"],
        maxGuests: 4,
        maxOccupancy: null,
        featured: true,
      },
      {
        name: "Sunset Beach Resort",
        type: "hotel",
        description: "Wake up to the sound of waves at our beachfront paradise. This tropical resort offers direct beach access, multiple pools, water sports, and oceanview rooms with private balconies. Ideal for families and couples looking for a relaxing getaway.\n\nEnjoy fresh seafood at our beachside restaurant, unwind at the spa, or explore nearby coral reefs. Our all-inclusive packages ensure a worry-free vacation experience.",
        location: "Beachfront Avenue",
        city: "Miami",
        pricePerNight: 280,
        rating: 5,
        reviewCount: 892,
        images: [hotelPool, hotelRoom, hotelExterior, hotelPool],
        amenities: ["WiFi", "Parking", "Pool", "Gym", "Restaurant", "Breakfast"],
        maxGuests: 3,
        maxOccupancy: null,
        featured: true,
      },
      {
        name: "Metropolitan Business Hotel",
        type: "hotel",
        description: "Strategically located in the financial district, our business hotel caters to professionals and executives. Modern rooms with ergonomic workspaces, high-speed internet, and express check-in/out services make your business trip seamless.\n\nHost meetings in our state-of-the-art conference rooms, stay connected with complimentary WiFi throughout the property, and enjoy quick access to major corporate offices and convention centers.",
        location: "Financial District",
        city: "San Francisco",
        pricePerNight: 220,
        rating: 4,
        reviewCount: 634,
        images: [hotelRoom, hotelExterior, hotelRoom, hotelExterior],
        amenities: ["WiFi", "Parking", "Gym", "Restaurant", "Breakfast"],
        maxGuests: 2,
        maxOccupancy: null,
        featured: false,
      },
      {
        name: "Boutique Garden Inn",
        type: "hotel",
        description: "Discover charm and tranquility at our boutique hotel surrounded by lush gardens. Each uniquely decorated room tells a story, combining vintage elegance with modern comfort. Perfect for romantic getaways and peaceful retreats.\n\nStroll through our manicured gardens, enjoy afternoon tea on the terrace, and experience personalized service that makes every guest feel special.",
        location: "Garden Quarter",
        city: "Charleston",
        pricePerNight: 180,
        rating: 5,
        reviewCount: 421,
        images: [hotelExterior, hotelRoom, hotelPool, hotelRoom],
        amenities: ["WiFi", "Parking", "Restaurant", "Breakfast"],
        maxGuests: 2,
        maxOccupancy: null,
        featured: false,
      },
      {
        name: "Urban Skyline Suites",
        type: "hotel",
        description: "Towering above the cityscape, our luxury suites offer panoramic views and spacious accommodations. Each suite features a full kitchen, separate living area, and floor-to-ceiling windows. Ideal for extended stays and families.\n\nEnjoy access to our rooftop lounge, fitness center with city views, and convenient location near shopping, dining, and entertainment venues.",
        location: "Uptown",
        city: "Chicago",
        pricePerNight: 320,
        rating: 4,
        reviewCount: 758,
        images: [hotelRoom, hotelExterior, hotelRoom, hotelPool],
        amenities: ["WiFi", "Parking", "Gym", "Pool"],
        maxGuests: 6,
        maxOccupancy: null,
        featured: true,
      },
      {
        name: "Historic Plaza Hotel",
        type: "hotel",
        description: "Step back in time while enjoying modern comforts at our historic landmark hotel. Restored to its original grandeur, featuring ornate architecture, classic furnishings, and timeless elegance. A favorite among culture enthusiasts and history buffs.\n\nLocated steps away from museums, theaters, and historic sites. Our elegant ballroom hosts weddings and special events, making every occasion memorable.",
        location: "Historic Center",
        city: "Boston",
        pricePerNight: 260,
        rating: 4,
        reviewCount: 981,
        images: [hotelExterior, hotelRoom, hotelExterior, hotelRoom],
        amenities: ["WiFi", "Parking", "Restaurant", "Gym", "Breakfast"],
        maxGuests: 2,
        maxOccupancy: null,
        featured: false,
      },
      {
        name: "Innovation Hub Coworking",
        type: "office",
        description: "Join a vibrant community of entrepreneurs, freelancers, and remote workers in our modern coworking space. Featuring high-speed fiber internet, ergonomic workstations, private phone booths, and collaborative areas designed to boost productivity.\n\nEnjoy unlimited coffee, weekly networking events, and 24/7 access. Our flexible membership options cater to solopreneurs and growing teams alike.",
        location: "Tech District",
        city: "Austin",
        pricePerNight: 45,
        rating: 5,
        reviewCount: 342,
        images: [coworkingSpace, privateOffice, coworkingSpace, privateOffice],
        amenities: ["WiFi", "Coffee", "Meeting Rooms", "24/7 Access", "Printer", "Parking"],
        maxGuests: null,
        maxOccupancy: 50,
        featured: true,
      },
      {
        name: "Executive Office Suites",
        type: "office",
        description: "Premium private offices and meeting rooms for professionals who demand excellence. Each suite comes fully furnished with modern desks, comfortable seating, and professional decor. Includes reception services, mail handling, and administrative support.\n\nImpress clients in our elegant conference rooms equipped with presentation technology. On-site cafe and lounge areas provide perfect settings for informal meetings.",
        location: "Business Park",
        city: "Seattle",
        pricePerNight: 120,
        rating: 5,
        reviewCount: 198,
        images: [privateOffice, coworkingSpace, privateOffice, coworkingSpace],
        amenities: ["WiFi", "Meeting Rooms", "Coffee", "Parking", "Printer", "Kitchen"],
        maxGuests: null,
        maxOccupancy: 8,
        featured: true,
      },
      {
        name: "Creative Studios Workspace",
        type: "office",
        description: "Designed for creative professionals, our workspace features inspiring interiors, natural lighting, and flexible layouts. Perfect for designers, artists, photographers, and creative agencies. Includes photography studio and production space.\n\nCollaborate in our open studio areas, focus in quiet zones, or host client presentations in our gallery-style meeting rooms. Community events foster creativity and connection.",
        location: "Arts District",
        city: "Los Angeles",
        pricePerNight: 65,
        rating: 4,
        reviewCount: 267,
        images: [coworkingSpace, privateOffice, coworkingSpace, privateOffice],
        amenities: ["WiFi", "Coffee", "Meeting Rooms", "Lounge", "Parking"],
        maxGuests: null,
        maxOccupancy: 30,
        featured: false,
      },
      {
        name: "Downtown Flex Space",
        type: "office",
        description: "Affordable and convenient coworking in the heart of downtown. Hot desks, dedicated desks, and small private offices available. Perfect for startups, remote workers, and small businesses looking for professional workspace without long-term commitments.\n\nAccess to shared amenities including kitchen, printer, fast WiFi, and meeting rooms. Casual atmosphere with a focus on community and collaboration.",
        location: "Downtown Core",
        city: "Denver",
        pricePerNight: 35,
        rating: 4,
        reviewCount: 445,
        images: [coworkingSpace, privateOffice, coworkingSpace, privateOffice],
        amenities: ["WiFi", "Coffee", "Meeting Rooms", "Printer", "Kitchen"],
        maxGuests: null,
        maxOccupancy: 40,
        featured: false,
      },
      {
        name: "Green Valley Shared Office",
        type: "office",
        description: "Work surrounded by nature in our eco-friendly office space. Featuring sustainable design, natural materials, and abundant greenery. Ideal for environmentally conscious professionals and companies with green values.\n\nSolar-powered building with standing desks, meditation room, outdoor terrace workspace, and organic cafe. Join our community committed to sustainability and wellness.",
        location: "Green Valley",
        city: "Portland",
        pricePerNight: 55,
        rating: 5,
        reviewCount: 312,
        images: [privateOffice, coworkingSpace, privateOffice, coworkingSpace],
        amenities: ["WiFi", "Coffee", "Meeting Rooms", "Lounge", "Parking", "24/7 Access"],
        maxGuests: null,
        maxOccupancy: 25,
        featured: true,
      },
    ];

    mockProperties.forEach(prop => {
      const id = randomUUID();
      const property: Property = {
        ...prop,
        id,
        maxGuests: prop.maxGuests ?? null,
        maxOccupancy: prop.maxOccupancy ?? null,
        featured: prop.featured ?? false,
      };
      this.properties.set(id, property);
    });
  }

  async getProperties(filters?: SearchPropertiesParams): Promise<Property[]> {
    let result = Array.from(this.properties.values());

    if (filters?.type && filters.type !== 'all') {
      result = result.filter(p => p.type === filters.type);
    }

    if (filters?.city) {
      const cityLower = filters.city.toLowerCase();
      result = result.filter(p => 
        p.city.toLowerCase().includes(cityLower) || 
        p.location.toLowerCase().includes(cityLower)
      );
    }

    if (filters?.minPrice !== undefined) {
      result = result.filter(p => p.pricePerNight >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      result = result.filter(p => p.pricePerNight <= filters.maxPrice!);
    }

    if (filters?.rating) {
      result = result.filter(p => p.rating >= filters.rating!);
    }

    if (filters?.amenities && filters.amenities.length > 0) {
      result = result.filter(p => 
        filters.amenities!.some(amenity => p.amenities.includes(amenity))
      );
    }

    return result.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });
  }

  async getPropertyById(id: string): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = randomUUID();
    const property: Property = { ...insertProperty, id };
    this.properties.set(id, property);
    return property;
  }

  async getBookingsByUserId(userId: string): Promise<any[]> {
    const userBookings = Array.from(this.bookings.values())
      .filter(b => b.userId === userId);

    const bookingsWithProperties = await Promise.all(
      userBookings.map(async (booking) => {
        const property = await this.getPropertyById(booking.propertyId);
        return {
          ...booking,
          property: property ? {
            id: property.id,
            name: property.name,
            location: property.location,
            city: property.city,
            type: property.type,
            images: property.images,
          } : null,
        };
      })
    );

    return bookingsWithProperties.filter(b => b.property !== null);
  }

  async getBookingById(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = {
      ...insertBooking,
      id,
      guests: insertBooking.guests ?? null,
      status: 'confirmed',
      createdAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async cancelBooking(id: string): Promise<void> {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = 'cancelled';
      this.bookings.set(id, booking);
    }
  }
}

export const storage = new MemStorage();
