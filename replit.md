# Stayu - Hotel and Office Space Booking Platform

## Project Overview
Stayu is a modern, responsive booking platform for hotels and shared office spaces. Built with React, TypeScript, and Express.js, it features Clerk authentication and a simple cash-based payment system.

## Recent Changes (November 10, 2025)
- Initial project setup with full-stack architecture
- Implemented Clerk authentication integration
- Created complete data model for properties and bookings
- Built responsive UI with shadcn components
- Integrated mock data for 11 properties (6 hotels, 5 office spaces)
- Implemented property search, filtering, and booking system

## Architecture

### Frontend (`client/`)
- **React 18** with TypeScript
- **Wouter** for routing
- **TanStack Query** for data fetching and caching
- **Clerk React SDK** for authentication
- **shadcn/ui** components with Tailwind CSS
- **date-fns** for date manipulation

### Backend (`server/`)
- **Express.js** server
- **In-memory storage** (MemStorage) for development
- **Clerk SDK** for authentication middleware
- **Zod** validation for API requests

### Key Files
- `shared/schema.ts`: Data models and type definitions for properties and bookings
- `client/src/App.tsx`: Main app component with routing
- `client/src/components/Header.tsx`: Navigation with Clerk auth integration
- `client/src/components/Hero.tsx`: Hero section with search interface
- `client/src/components/PropertyCard.tsx`: Reusable property listing card
- `client/src/components/SearchFilters.tsx`: Advanced filtering component
- `client/src/components/BookingForm.tsx`: Booking interface with date selection
- `client/src/pages/Home.tsx`: Hotels listing page
- `client/src/pages/OfficeSpaces.tsx`: Office spaces listing page
- `client/src/pages/PropertyDetail.tsx`: Property details and booking
- `client/src/pages/MyBookings.tsx`: User booking dashboard
- `server/storage.ts`: In-memory data storage with mock property data
- `server/routes.ts`: API endpoints for properties and bookings

## User Preferences
- Modern, professional UI design inspired by Airbnb and Booking.com
- Blue primary color scheme (#0066CC) for trust and professionalism
- Clean typography using Inter font
- Responsive design optimized for mobile, tablet, and desktop
- Cash-based payment system (Pay at Arrival)

## Features Implemented
### Authentication
- Clerk-based sign up/sign in/sign out
- Protected routes for bookings
- User session management

### Property Management
- Property listings with images, ratings, amenities
- Search by city/location
- Filter by price range, rating, amenities
- Separate views for hotels vs office spaces
- Featured properties highlighting

### Booking System
- Date range selection (check-in/check-out)
- Guest/occupancy count input
- Price calculation based on nights
- Cash payment confirmation
- Booking history and management
- Cancel booking functionality

### UI/UX
- Hero section with prominent search
- Image carousels for properties
- Responsive grid layouts
- Loading and empty states
- Toast notifications for actions
- Smooth hover effects and transitions

## API Endpoints
- `GET /api/properties` - List properties with filters
- `GET /api/properties/:id` - Get property details
- `GET /api/bookings/:userId` - Get user bookings
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/:id` - Cancel booking

## Environment Variables
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk publishable key (frontend)
- `CLERK_SECRET_KEY` - Clerk secret key (backend)
- `SESSION_SECRET` - Express session secret

## Mock Data
The application includes 11 properties:
- 6 Hotels: Luxury, beach resort, business, boutique, suites, historic
- 5 Office Spaces: Coworking, executive, creative, flex space, green office
- Each with realistic descriptions, amenities, pricing, and images

## Development
- Run `npm run dev` to start both frontend (Vite) and backend (Express) servers
- Frontend runs on port 5000 (managed by Vite)
- Backend API endpoints available at `/api/*`

## Next Steps
- Add real database persistence (PostgreSQL)
- Implement email confirmations
- Add property owner dashboard
- Enable online payments alongside cash
- Implement review and rating system
- Add map integration for property locations
