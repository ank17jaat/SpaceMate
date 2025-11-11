import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, MapPin, Calendar, Users, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import heroImage from '@assets/generated_images/Luxury_hotel_lobby_hero_dad4bd16.png';

export function Hero() {
  const [, setLocation] = useLocation();
  const [searchType, setSearchType] = useState<'office' | 'hotel'>('office');
  const [searchCity, setSearchCity] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity);
    const path = searchType === 'hotel' ? '/' : '/hotels';
    setLocation(`${path}?${params.toString()}`);
  };

  return (
    <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl">
          Find Your Perfect Stay or Workspace
        </h1>
        <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl">
          Discover verified properties across the globe. Book hotels and shared office spaces with ease.
        </p>

        <Card className="w-full max-w-4xl p-6 sm:p-8 bg-background/95 backdrop-blur">
          <div className="flex gap-2 mb-6">
            <Button
              type="button"
              // variant={searchType === 'office' ? 'default' : 'outline'}
              // onClick={() => setSearchType('office')}
              className="flex-1"
              data-testid="button-search-offices"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Office Spaces
            </Button>
            {/* <Button
              type="button"
              variant={searchType === 'hotel' ? 'default' : 'outline'}
              onClick={() => setSearchType('hotel')}
              className="flex-1"
              data-testid="button-search-hotels"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Hotels
            </Button> */}
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Where are you going?"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="pl-10 h-12"
                  data-testid="input-location"
                />
              </div>
              <Button type="submit" size="lg" className="h-12" data-testid="button-search">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </form>
        </Card>

        <div className="flex flex-wrap gap-6 mt-12 text-white justify-center">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-3 py-1">
              10,000+ Properties
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-3 py-1">
              Verified Spaces
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-3 py-1">
              Pay Cash at Arrival
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
