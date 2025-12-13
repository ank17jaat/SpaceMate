import { Link, useLocation } from 'wouter';
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/clerk-react';
import { useUser } from '@/lib/clerk';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Building2, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [location, setLocation] = useLocation();
  const { isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-3 py-2 -ml-3 cursor-pointer" data-testid="link-home">
              <Building2 className="h-7 w-7 text-primary" />
              <span className="text-2xl font-bold text-foreground">SpaceMate</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/">
              <Button 
                variant={location === '/' ? 'secondary' : 'ghost'}
                className="font-medium"
                data-testid="link-hotels"
              >
                Office Spaces
              </Button>
            </Link>
            {/* <Link href="/hotels">
              <Button 
                variant={location === '/hotels' ? 'secondary' : 'ghost'}
                className="font-medium"
                data-testid="link-offices"
              >
                Hotels
              </Button>
            </Link> */}
            {isSignedIn && (
              <>
                <Link href="/my-bookings">
                  <Button 
                    variant={location === '/my-bookings' ? 'secondary' : 'ghost'}
                    className="font-medium"
                    data-testid="link-bookings"
                  >
                    My Bookings
                  </Button>
                </Link>
                <div className="ml-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost"
                          className="font-medium"
                          data-testid="button-office"
                        >
                          Office
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => setLocation('/my-office-spaces')}>My Office Spaces</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setLocation('/add-office-space')}>Add Office Space</DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
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
            Office Spaces
          </Button>
              </Link>
              {isSignedIn && (
          <>
            <Link href="/my-bookings">
              <Button
                variant={location === '/my-bookings' ? 'secondary' : 'ghost'}
                className="w-full justify-start font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Bookings
              </Button>
            </Link>
            <Link href="/my-office-spaces">
              <Button
                variant={location === '/my-office-spaces' ? 'secondary' : 'ghost'}
                className="w-full justify-start font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Office Spaces
              </Button>
            </Link>
            <Link href="/add-office-space">
              <Button
                variant={location === '/add-office-space' ? 'secondary' : 'ghost'}
                className="w-full justify-start font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Add Office Space
              </Button>
            </Link>
          </>
              )}
            </nav>

            <div className="mt-3 flex flex-col gap-2">
              {!isSignedIn ? (
          <>
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Button>
            </SignUpButton>
          </>
              ) : (
          <div className="w-full">
            <UserButton afterSignOutUrl="/" />
          </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
