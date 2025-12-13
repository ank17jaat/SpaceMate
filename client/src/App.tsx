import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@/lib/clerk";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import OfficeSpaces from "@/pages/OfficeSpaces";
import PropertyDetail from "@/pages/PropertyDetail";
import MyBookings from "@/pages/MyBookings";
import NotFound from "@/pages/not-found";
import AddOfficeSpace from "@/pages/AddOfficeSpace";
import MyOfficeSpaces from "@/pages/MyOfficeSpaces";

function Router() {
  return (
    <Switch>
      {/* <Route path="/" component={Home} />
      <Route path="/office-spaces" component={OfficeSpaces} /> */}
      <Route path="/" component={OfficeSpaces} />
      <Route path="/hotels" component={Home} />
      <Route path="/property/:id" component={PropertyDetail} />
      <Route path="/my-bookings" component={MyBookings} />
      <Route path="/add-office-space" component={AddOfficeSpace} />
      <Route path="/my-office-spaces" component={MyOfficeSpaces} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="flex-grow">
              <Router />
            </div>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
