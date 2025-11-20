import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CourseUpdates from "./pages/CourseUpdates";
import AnonymousPosts from "./pages/AnonymousPosts";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";
import AdminEvents from "./pages/AdminEvents";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        {/* PAGE ROUTES */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/course-updates" element={<CourseUpdates />} />
          <Route path="/anonymous-posts" element={<AnonymousPosts />} />
          <Route path="/events" element={<Events />} />
          <Route path="/admin-events" element={<AdminEvents />} />

          {/* Chatbot Page Route */}


          {/* 404 PAGE */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* 🔥 FLOATING CHATBOT — OUTSIDE ROUTES BUT INSIDE BROWSER ROUTER */}

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;