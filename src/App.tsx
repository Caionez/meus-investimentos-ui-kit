
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InvestmentProvider } from "./contexts/InvestmentContext";
import Index from "./pages/Index";
import InvestmentList from "./pages/InvestmentList";
import InvestmentDetails from "./pages/InvestmentDetails";
import AddInvestment from "./pages/AddInvestment";
import EditInvestment from "./pages/EditInvestment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <InvestmentProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/investments" element={<InvestmentList />} />
            <Route path="/investments/add" element={<AddInvestment />} />
            <Route path="/investments/:id" element={<InvestmentDetails />} />
            <Route path="/investments/:id/edit" element={<EditInvestment />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </InvestmentProvider>
  </QueryClientProvider>
);

export default App;
