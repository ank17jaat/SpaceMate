# Stayu Design Guidelines

## Design Approach
**Reference-Based Strategy**: Drawing from Airbnb's visual storytelling, Booking.com's trust-building elements, and Expedia's clean search interface. This hospitality platform requires strong visual impact to showcase properties while maintaining booking flow efficiency.

## Typography System
- **Primary Font**: Inter or DM Sans (Google Fonts) - clean, modern sans-serif
- **Headings**: Bold (700), sizes: Hero H1 (text-5xl/text-6xl), Section H2 (text-3xl/text-4xl), Card H3 (text-xl/text-2xl)
- **Body Text**: Regular (400) and Medium (500), text-base for descriptions, text-sm for metadata
- **Price Display**: Bold (700), larger sizing (text-2xl/text-3xl) to emphasize value

## Layout & Spacing System
**Spacing Units**: Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Section padding: py-16 md:py-24
- Card padding: p-6
- Component gaps: gap-4 for tight grouping, gap-8 for section spacing
- Container max-width: max-w-7xl for content sections

## Core Components

### Navigation Header
Top bar with logo (left), search toggle (center for mobile, persistent for desktop), and user menu with Clerk auth (right). Include "List Your Property" CTA button. Sticky positioning with subtle shadow on scroll. Navigation links: Hotels, Office Spaces, My Bookings.

### Hero Section
Full-width immersive hero (80vh) with large hotel/office space background image showing professional, aspirational spaces. Overlay includes centered search card with location input, date picker, guest/capacity selector, and property type toggle (Hotels/Office Spaces). Headline: "Find Your Perfect Stay or Workspace" with supporting tagline. Include trust indicators below search: "10,000+ Properties", "Verified Spaces", "Cash Payment Accepted".

### Search & Filter Bar
Sticky filter bar below hero: location autocomplete, price range slider, amenities checkboxes (WiFi, Parking, Pool, Meeting Rooms, etc.), star rating selector, sort dropdown (Price, Rating, Distance). Toggle between map view and list view.

### Property Listing Cards (Grid Layout)
Three-column grid (lg:grid-cols-3 md:grid-cols-2 grid-cols-1) with gap-6. Each card: Large image carousel (3-5 images), property name, location with pin icon, star rating with review count, key amenities (3-4 icons with labels), price per night/day with "Pay Cash at Arrival" badge, heart icon for wishlist.

### Property Detail Page
**Image Gallery**: Large featured image with thumbnail grid below (6-8 images), click to expand fullscreen carousel.

**Two-Column Layout**: 
- Left (2/3 width): Property name, location, rating, full description, amenities grid (4 columns), house rules, host/manager info with avatar
- Right (1/3 width): Sticky booking card with date selection, guest count, pricing breakdown, total cost, "Reserve - Pay Cash at Arrival" button, cancellation policy, instant booking badge

**Additional Sections**: Reviews grid (2 columns), location map, similar properties carousel

### Booking Dashboard
Header with filters (Upcoming, Past, Cancelled). Booking cards in single column: property thumbnail, booking details, dates, guest count, total amount, status badge, action buttons (View Details, Cancel, Contact Property).

### Footer
Four-column layout: Company links, Support links, Property Types, Social media icons. Newsletter signup form with email input. Trust badges (Verified Properties, 24/7 Support, Secure Bookings). Copyright and language/currency selectors.

## Images Strategy
**Hero Image**: Large, high-quality photograph of modern hotel lobby or co-working space with natural lighting
**Property Cards**: Professional interior/exterior shots showing rooms, workspaces, amenities
**Detail Gallery**: Mix of room interiors, building exteriors, amenity photos, neighborhood views
**Dashboard**: Property thumbnails (400x300px aspect ratio)

All images should convey cleanliness, professionalism, and aspiration. Use placeholder service like Unsplash with hotel/office keywords.

## Interactive Elements
- Property card hover: subtle lift (transform scale-105) and shadow increase
- Image galleries: smooth transitions, navigation arrows on hover
- Search filters: animated expand/collapse with smooth height transitions
- Booking confirmation: success modal with checkmark animation
- Date picker: highlight selected range with subtle color background
- Minimal animations overall - focus on seamless micro-interactions

## Accessibility
- Clear focus states on all interactive elements
- Sufficient contrast for text over images (use overlay gradients)
- Alt text for all property images
- Keyboard navigation for image carousels
- ARIA labels for icon-only buttons

## Responsive Breakpoints
- Mobile (< 768px): Single column, stacked navigation, full-width search
- Tablet (768px - 1024px): Two-column grids, simplified filters
- Desktop (> 1024px): Three-column grids, persistent search bar, sidebar filters