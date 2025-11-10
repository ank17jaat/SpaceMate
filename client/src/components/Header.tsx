import { Link, useLocation } from 'wouter';
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Building2, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [location] = useLocation();
  const { isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-3 py-2 -ml-3 cursor-pointer" data-testid="link-home">
              <Building2 className="h-7 w-7 text-primary" />
              <span className="text-2xl font-bold text-foreground">Stayu</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/">
              <Button 
                variant={location === '/' ? 'secondary' : 'ghost'}
                className="font-medium"
                data-testid="link-hotels"
              >
                Hotels
              </Button>
            </Link>
            <Link href="/office-spaces">
              <Button 
                variant={location === '/office-spaces' ? 'secondary' : 'ghost'}
                className="font-medium"
                data-testid="link-offices"
              >
                Office Spaces
              </Button>
            </Link>
            {isSignedIn && (
              <Link href="/my-bookings">
                <Button 
                  variant={location === '/my-bookings' ? 'secondary' : 'ghost'}
                  className="font-medium"
                  data-testid="link-bookings"
                >
                  My Bookings
                </Button>
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" data-testid="button-signin" className="hidden sm:inline-flex">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button data-testid="button-signup">
                    Sign Up
                  </Button>
                </SignUpButton>
              </>
            ) : (
              <div data-testid="user-menu">
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-2">
              <Link href="/">
                <Button 
                  variant={location === '/' ? 'secondary' : 'ghost'}
                  className="w-full justify-start font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Hotels
                </Button>
              </Link>
              <Link href="/office-spaces">
                <Button 
                  variant={location === '/office-spaces' ? 'secondary' : 'ghost'}
                  className="w-full justify-start font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Office Spaces
                </Button>
              </Link>
              {isSignedIn && (
                <Link href="/my-bookings">
                  <Button 
                    variant={location === '/my-bookings' ? 'secondary' : 'ghost'}
                    className="w-full justify-start font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
