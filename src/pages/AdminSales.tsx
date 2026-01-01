
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';


const AdminSales = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState({
    today: 0,
    week: 0,
    month: 0,
    totalOrders: 0,
    pendingOrders: 0,
    customers: 0,
  });
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*');
      if (error) throw error;
      setOrders(data || []);
      computeStats(data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des ventes');
    }
    setLoading(false);
  };

  const computeStats = (orders: any[]) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Seules les commandes livrées comptent pour les ventes
    const deliveredOrders = orders.filter(o => o.status === 'delivered');

    let today = 0, week = 0, month = 0, totalOrders = orders.length, pendingOrders = 0;
    const customersSet = new Set();
    const productMap: Record<string, { name: string, sold: number, revenue: number }> = {};

    for (const order of deliveredOrders) {
      const createdAt = new Date(order.created_at);
      if (createdAt >= startOfToday) today += Number(order.total_price || 0);
      if (createdAt >= startOfWeek) week += Number(order.total_price || 0);
      if (createdAt >= startOfMonth) month += Number(order.total_price || 0);
      if (order.customer_phone) customersSet.add(order.customer_phone);
      // Top produits
      if (order.product_name) {
        if (!productMap[order.product_name]) {
          productMap[order.product_name] = { name: order.product_name, sold: 0, revenue: 0 };
        }
        productMap[order.product_name].sold += Number(order.quantity || 1);
        productMap[order.product_name].revenue += Number(order.total_price || 0);
      }
    }
    // Comptage des commandes en attente (toutes commandes)
    for (const order of orders) {
      if (order.status === 'pending') pendingOrders++;
    }
    setSalesData({
      today,
      week,
      month,
      totalOrders,
      pendingOrders,
      customers: customersSet.size,
    });
    setTopProducts(
      Object.values(productMap)
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 4)
    );
  };

  return (
    <div className="min-h-screen py-8 mb-16 md:mb-0">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link to="/admin" className="inline-flex items-center text-accent hover:underline mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Link>
          <h1 className="text-4xl font-bold">Tableau des Ventes</h1>
          <p className="text-muted-foreground mt-2">
            Analysez vos performances commerciales
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">Chargement des ventes...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Ventes du jour</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">
                    {salesData.today.toLocaleString()} FCFA
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Cette semaine</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">
                    {salesData.week.toLocaleString()} FCFA
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Ce mois</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">
                    {salesData.month.toLocaleString()} FCFA
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Commandes totales</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{salesData.totalOrders}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {salesData.pendingOrders} en attente
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Produits les plus vendus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.sold} unités vendues
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-accent">
                          {product.revenue.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSales;
