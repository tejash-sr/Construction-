import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import UserRoute from "@/components/UserRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import WhyChooseUs from "./pages/WhyChooseUs";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminQuotes from "./pages/admin/Quotes";
import AdminAppointments from "./pages/admin/Appointments";
import AdminMessages from "./pages/admin/Messages";
import AdminProjects from "./pages/admin/Projects";
import AdminSettings from "./pages/admin/Settings";
import UserDashboard from "./pages/user/Dashboard";
import MyQuotes from "./pages/user/MyQuotes";
import MyAppointments from "./pages/user/MyAppointments";
import MyProjects from "./pages/user/MyProjects";
import UserProfile from "./pages/user/UserProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Admin Routes - Only for admins */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/quotes" element={<AdminRoute><AdminQuotes /></AdminRoute>} />
            <Route path="/admin/appointments" element={<AdminRoute><AdminAppointments /></AdminRoute>} />
            <Route path="/admin/messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />
            <Route path="/admin/projects" element={<AdminRoute><AdminProjects /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            
            {/* User Dashboard Routes - Only for regular users */}
            <Route path="/user" element={<ProtectedRoute><UserRoute><UserDashboard /></UserRoute></ProtectedRoute>} />
            <Route path="/user/quotes" element={<ProtectedRoute><UserRoute><MyQuotes /></UserRoute></ProtectedRoute>} />
            <Route path="/user/appointments" element={<ProtectedRoute><UserRoute><MyAppointments /></UserRoute></ProtectedRoute>} />
            <Route path="/user/projects" element={<ProtectedRoute><UserRoute><MyProjects /></UserRoute></ProtectedRoute>} />
            <Route path="/user/profile" element={<ProtectedRoute><UserRoute><UserProfile /></UserRoute></ProtectedRoute>} />
            
            {/* Public Website Routes - Accessible to all authenticated users */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
            <Route path="/why-choose-us" element={<ProtectedRoute><WhyChooseUs /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
