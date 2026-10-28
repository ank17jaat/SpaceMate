import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Loader2, Briefcase } from 'lucide-react';
import { useSearch } from 'wouter';
import { Property, SearchPropertiesParams } from '@shared/schema';
import { Hero } from '@/components/Hero';
import { PropertyCard } from '@/components/PropertyCard';
import { SearchFilters } from '@/components/SearchFilters';
import { propertiesApi } from '@/lib/api';

export default function OfficeSpaces() {
  const searchString = useSearch();
  const { userId, getToken } = useAuth();
  const [filters, setFilters] = useState<SearchPropertiesParams>({});
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProperties = async (nextFilters: SearchPropertiesParams) => {
    setIsLoading(true);
    try {
      const amenities = Array.isArray(nextFilters.amenities)
        ? nextFilters.amenities.map((item) => item.trim())
        : nextFilters.amenities;
      const data = await propertiesApi.list({ ...nextFilters, amenities, type: 'office' });
      setProperties(data);
    } catch (err) {
      console.error('Failed to fetch properties', err);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchString || '');
    const parsed: SearchPropertiesParams = {
      city: params.get('city') || undefined,
      search: params.get('search') || undefined,
      minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
      maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
      rating: params.get('rating') ? Number(params.get('rating')) : undefined,
      amenities: params.get('amenities') ? params.get('amenities')!.split(',').filter(Boolean) : [],
    };

    setFilters(parsed);
    fetchProperties(parsed);
  }, [searchString]);

  useEffect(() => {
    const handler = () => {
      if (filtersRef.current) {
        filtersRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('scrollToFilters', handler);
    return () => window.removeEventListener('scrollToFilters', handler);
  }, []);

  const handleFilterChange = (nextFilters: SearchPropertiesParams) => {
    setFilters(nextFilters);
    fetchProperties(nextFilters);
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      if (!confirm('Are you sure you want to delete this property?')) return;
      await propertiesApi.remove(id, getToken);
      fetchProperties(filters);
    } catch (err) {
      console.error('Delete error', err);
    }
  };

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
        <div ref={filtersRef}>
          <SearchFilters
            city={filters.city}
            amenities={Array.isArray(filters.amenities) ? filters.amenities : []}
            onFilterChange={handleFilterChange}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="flex flex-col">
                <PropertyCard property={property} />
                {property.ownerId && userId === property.ownerId && (
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        await handleDeleteProperty(property.id);
                      }}
                      className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                      data-testid={`button-delete-${property.id}`}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground mb-4">No office spaces found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search for a different location
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
