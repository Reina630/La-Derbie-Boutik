import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ImagePlus,
  Box,
  TrendingUp,
  Shield,
  GitBranch,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const menuItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Produits', url: '/admin/produits', icon: Package },
  { title: 'Catégories', url: '/admin/categories', icon: Box },
  { title: 'Commandes', url: '/admin/commandes', icon: ShoppingCart },
  { title: 'Clients', url: '/admin/clients', icon: Users },
  { title: 'Images', url: '/admin/images', icon: ImagePlus },
  { title: 'Stock', url: '/admin/stock', icon: Box },
  { title: 'Ventes', url: '/admin/ventes', icon: TrendingUp },
];

const superAdminItems = [
  { title: 'Utilisateurs', url: '/admin/utilisateurs', icon: Shield },
  { title: 'Attribution Produits', url: '/admin/attribution-produits', icon: GitBranch },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { logout, isSuperAdmin, currentUsername } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;
  const collapsed = state === 'collapsed';

  return (
    <Sidebar className={collapsed ? 'w-16' : 'w-64'}>
      <SidebarHeader className="border-b border-border p-4">
        {!collapsed && (
          <div>
            <h2 className="font-bold text-lg text-accent">NigerShop Admin</h2>
            <p className="text-xs text-muted-foreground truncate">
              {currentUsername} {isSuperAdmin && '(Super)'}
            </p>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isSuperAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>SuperAdmin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {superAdminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'default'}
          onClick={handleLogout}
          className="w-full"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Déconnexion</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
