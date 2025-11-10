import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@/lib/clerk";
import { Header } from "@/components/Header";
import Home from "@/pages/Home";
import OfficeSpaces from "@/pages/OfficeSpaces";
import PropertyDetail from "@/pages/PropertyDetail";
import MyBookings from "@/pages/MyBookings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/office-spaces" component={OfficeSpaces} />
      <Route path="/property/:id" component={PropertyDetail} />
      <Route path="/my-bookings" component={MyBookings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <Router />
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
