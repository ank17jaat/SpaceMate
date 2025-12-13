import { Property, SearchPropertiesParams } from '@shared/schema';
import { Hero } from '@/components/Hero';
import { PropertyCard } from '@/components/PropertyCard';
import { SearchFilters } from '@/components/SearchFilters';
import { useState, useEffect } from 'react';
import { Loader2, Briefcase } from 'lucide-react';

function buildQueryString(filters: SearchPropertiesParams) {
  const params = new URLSearchParams();
  // ensure we request office-type properties
  params.set('type', 'office');
  if (filters.city) params.set('city', String(filters.city));
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
  if (filters.rating !== undefined) params.set('rating', String(filters.rating));
  if (filters.amenities && Array.isArray(filters.amenities) && filters.amenities.length > 0) {
    params.set('amenities', filters.amenities.join(','));
  }
  return params.toString();
}

export default function OfficeSpaces() {
  const [filters, setFilters] = useState<SearchPropertiesParams>({});
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProperties = async (f: SearchPropertiesParams) => {
    setIsLoading(true);
    try {
      const qs = buildQueryString(f);
      const url = qs ? `/api/properties?${qs}` : `/api/properties`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      // normalize server response into shape expected by PropertyCard
      const normalized = (data || []).map((d: any) => ({
        id: d._id || d.id,
        name: d.name || d.title || '',
        description: d.description || '',
        images: Array.isArray(d.images) ? d.images : [],
        city: d.city || '',
        location: d.location || '',
        pricePerNight: d.price != null ? d.price : d.pricePerNight || 0,
        rating: d.rating || 0,
        amenities: d.amenities || [],
        type: d.type || 'office',
      })) as Property[];
      setProperties(normalized);
    } catch (err) {
      console.error('Failed to fetch properties', err);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: SearchPropertiesParams) => {
    setFilters(newFilters);
    fetchProperties(newFilters);
  };

  useEffect(() => {
    // initial load
    fetchProperties(filters);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="h-10 w-10 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold">Office Spaces</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Find the perfect workspace for your team. Professional, flexible, and ready to work.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SearchFilters onFilterChange={handleFilterChange} propertyType="office" />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id || (property as any)._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground mb-4">No office spaces found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or search for a different location</p>
          </div>
        )}
      </div>
    </div>
  );
}
