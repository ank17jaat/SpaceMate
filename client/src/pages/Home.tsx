import { useQuery } from '@tanstack/react-query';
import { Property, SearchPropertiesParams } from '@shared/schema';
// import { Hero } from '@/components/Hero';
import { PropertyCard } from '@/components/PropertyCard';
import { SearchFilters } from '@/components/SearchFilters';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [filters, setFilters] = useState<SearchPropertiesParams>({});

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties', { ...filters, type: 'hotel' }],
  });

  const handleFilterChange = (newFilters: SearchPropertiesParams) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <Hero /> */}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Discover Amazing Hotels</h2>
          <p className="text-muted-foreground">
            Browse through our curated selection of verified properties
          </p>
        </div>

        <SearchFilters onFilterChange={handleFilterChange} propertyType="hotel" />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground mb-4">
              No properties found matching your criteria
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search for a different location
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
