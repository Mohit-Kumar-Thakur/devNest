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

// Add these imports
import AdminRegister from "./pages/AdminRegister";


//auth
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import { AuthProvider } from "@/context/AuthContext";
import SendOTP from "./pages/SendOTP";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import AdminDashboard from "./components/admin/AdminDashboard";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
     <AuthProvider>
      <BrowserRouter>
        {/* PAGE ROUTES */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="/course-updates" element={<ProtectedRoute><CourseUpdates/></ProtectedRoute>} />
          <Route path="/anonymous-posts" element={<ProtectedRoute><AnonymousPosts/></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events/></ProtectedRoute>} />
          <Route path="/admin-events" element={<AdminRoute><AdminEvents/></AdminRoute>} />
          
          {/* Add these routes */}
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          
          {/*Authentication route*/}
          <Route path="/send-otp" element={<SendOTP/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />
          <Route path="/verify-email" element={<VerifyEmail/>} />

          {/* Chatbot Page Route */}

          {/* 404 PAGE */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* 🔥 FLOATING CHATBOT — OUTSIDE ROUTES BUT INSIDE BROWSER ROUTER */}

      </BrowserRouter>
     </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;