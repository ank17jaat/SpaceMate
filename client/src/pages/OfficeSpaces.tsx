import { Property, SearchPropertiesParams } from '@shared/schema';
import { Hero } from '@/components/Hero';
import { PropertyCard } from '@/components/PropertyCard';
import { SearchFilters } from '@/components/SearchFilters';
import { useState, useEffect, useRef } from 'react';
import { useSearch } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { Loader2, Briefcase } from 'lucide-react';

function buildQueryString(filters: SearchPropertiesParams) {
  const params = new URLSearchParams();
  if (filters.city) params.set('city', filters.city);
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
  if (filters.rating !== undefined) params.set('rating', String(filters.rating));
  if (filters.search) params.set('search', filters.search);
  if (filters.amenities) {
    if (Array.isArray(filters.amenities)) {
      if (filters.amenities.length > 0) params.set('amenities', filters.amenities.join(','));
    } else {
      // already a CSV string
      params.set('amenities', String(filters.amenities));
    }
  }
  return params.toString();
}

export default function OfficeSpaces() {
  const searchString = useSearch();

  const [filters, setFilters] = useState<SearchPropertiesParams>({});
  const filtersRef = useRef<HTMLDivElement | null>(null);

  const [properties, setProperties] = useState<Property[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();

  const fetchProperties = async (f: SearchPropertiesParams) => {
    setIsLoading(true);
    try {
      // normalize amenities: ensure CSV string is passed to the API
      const qf: any = { ...f };
      if (Array.isArray(qf.amenities)) {
        qf.amenities = qf.amenities.map((a: string) => String(a).trim().toLowerCase()).join(',');
      } else if (typeof qf.amenities === 'string') {
        qf.amenities = String(qf.amenities).split(',').map(s => s.trim().toLowerCase()).filter(Boolean).join(',');
      }

      const qs = buildQueryString(qf as SearchPropertiesParams);
      const url = qs ? `/api/properties?${qs}` : `/api/properties`;

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      const normalized = (data || []).map((d: any) => ({
        id: d.id || String(d._id),
        title: d.title || "",
        description: d.description || "",
        images: Array.isArray(d.images) ? d.images : [],
        city: d.city || "",
        address: d.address || "",
        price: d.price ?? d.pricePerNight ?? 0,
        rating: d.rating || 0,
        amenities: d.amenities || [],
      })) as Property[];

      setProperties(normalized);
    } catch (err) {
      console.error("Failed to fetch properties", err);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  // IMPORTANT: Load results when URL query string changes
  useEffect(() => {
    const sp = new URLSearchParams(searchString || '');
    const parsed: SearchPropertiesParams = {
      city: sp.get("city") || undefined,
      search: sp.get("search") || undefined,
      minPrice: sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined,
      maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
      rating: sp.get("rating") ? Number(sp.get("rating")) : undefined,
      amenities: sp.get("amenities") ? sp.get("amenities")!.split(",").filter(Boolean) : [],
    };

    setFilters(parsed);
    fetchProperties(parsed);
  }, [searchString]);

  // Scroll to filters when Hero triggers a search
  useEffect(() => {
    const handler = () => {
      if (filtersRef.current) {
        try { filtersRef.current.scrollIntoView({ behavior: 'smooth' }); } catch (e) { /* ignore */ }
      }
    };
    window.addEventListener('scrollToFilters', handler);
    return () => window.removeEventListener('scrollToFilters', handler);
  }, []);

  const handleFilterChange = (newFilters: SearchPropertiesParams) => {
    setFilters(newFilters);
    fetchProperties(newFilters);
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      const ok = confirm('Are you sure you want to delete this property?');
      if (!ok) return;
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const txt = await res.text();
        console.error('Failed to delete property', txt);
        return;
      }
      // refresh list after delete
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
          <SearchFilters city={filters.city} amenities={Array.isArray(filters.amenities) ? filters.amenities : []} onFilterChange={handleFilterChange} />
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
