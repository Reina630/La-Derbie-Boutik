import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNavBar from "@/components/MobileNavBar";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import { AdminLayout } from "@/components/AdminLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";
import AdminImages from "./pages/AdminImages";
import AdminStock from "./pages/AdminStock";
import AdminSales from "./pages/AdminSales";
import AdminUsers from "./pages/AdminUsers";
import AdminProductAssignment from "./pages/AdminProductAssignment";
import AdminCategories from "./pages/AdminCategories";
import Prospection from "./pages/Prospection";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <AdminAuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/boutique" element={<Shop />} />
                  <Route path="/produit/:id" element={<ProductDetail />} />
                  <Route path="/panier" element={<Cart />} />
                  <Route path="/a-propos" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout><Admin /></AdminLayout></ProtectedAdminRoute>} />
                  <Route path="/admin/produits" element={<ProtectedAdminRoute><AdminLayout><AdminProducts /></AdminLayout></ProtectedAdminRoute>} />
                  <Route path="/admin/commandes" element={<ProtectedAdminRoute><AdminLayout><AdminOrders /></AdminLayout></ProtectedAdminRoute>} />
                  <Route path="/admin/clients" element={<ProtectedAdminRoute><AdminLayout><AdminCustomers /></AdminLayout></ProtectedAdminRoute>} />
                  <Route path="/admin/images" element={<ProtectedAdminRoute><AdminLayout><AdminImages /></AdminLayout></ProtectedAdminRoute>} />
                  <Route path="/admin/stock" element={<ProtectedAdminRoute><AdminLayout><AdminStock /></AdminLayout></ProtectedAdminRoute>} />
                  <Route path="/admin/ventes" element={<ProtectedAdminRoute><AdminLayout><AdminSales /></AdminLayout></ProtectedAdminRoute>} />
                  <Route path="/admin/utilisateurs" element={<ProtectedAdminRoute requireSuperAdmin><AdminLayout><AdminUsers /></AdminLayout></ProtectedAdminRoute>} />
                  <Route path="/admin/attribution-produits" element={<ProtectedAdminRoute requireSuperAdmin><AdminLayout><AdminProductAssignment /></AdminLayout></ProtectedAdminRoute>} />
                  <Route path="/admin/categories" element={<ProtectedAdminRoute><AdminLayout><AdminCategories /></AdminLayout></ProtectedAdminRoute>} />
                  
                  {/* Prospection Route */}
                  <Route path="/prospection" element={<Prospection />} />
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <MobileNavBar />
            </div>
          </BrowserRouter>
        </AdminAuthProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
