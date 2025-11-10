import { useQuery } from '@tanstack/react-query';
import { Property, SearchPropertiesParams } from '@shared/schema';
import { Hero } from '@/components/Hero';
import { PropertyCard } from '@/components/PropertyCard';
import { SearchFilters } from '@/components/SearchFilters';
import { useState } from 'react';
import { Loader2, Briefcase } from 'lucide-react';

export default function OfficeSpaces() {
  const [filters, setFilters] = useState<SearchPropertiesParams>({});

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties', { ...filters, type: 'office' }],
  });

  const handleFilterChange = (newFilters: SearchPropertiesParams) => {
    setFilters(newFilters);
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
        <SearchFilters onFilterChange={handleFilterChange} propertyType="office" />

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
              No office spaces found matching your criteria
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
