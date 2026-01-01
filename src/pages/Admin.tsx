import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Package, ShoppingCart, Users, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

const Admin = () => {
  const { currentUsername, isSuperAdmin } = useAdminAuth();

  const stats = [
    {
      title: 'Ventes du mois',
      value: '425,000 FCFA',
      icon: DollarSign,
      trend: '+12.5%',
      color: 'text-green-600',
    },
    {
      title: 'Commandes',
      value: '48',
      icon: ShoppingCart,
      trend: '+5.2%',
      color: 'text-blue-600',
    },
    {
      title: 'Produits',
      value: '156',
      icon: Package,
      trend: '+8',
      color: 'text-purple-600',
    },
    {
      title: 'Clients',
      value: '234',
      icon: Users,
      trend: '+18',
      color: 'text-orange-600',
    },
  ];

  const recentOrders = [
    { id: 'CMD042', customer: 'Aïcha M.', amount: '29,000', status: 'pending' },
    { id: 'CMD041', customer: 'Fatouma B.', amount: '35,000', status: 'confirmed' },
    { id: 'CMD040', customer: 'Hadiza S.', amount: '18,500', status: 'shipping' },
    { id: 'CMD039', customer: 'Mariama I.', amount: '12,000', status: 'delivered' },
  ];

  const lowStockProducts = [
    { name: 'Crème Premium', stock: 3, threshold: 10 },
    { name: 'Sérum Anti-Taches', stock: 5, threshold: 10 },
    { name: 'Kit Maquillage', stock: 2, threshold: 15 },
  ];

  const statusColors = {
    pending: 'text-yellow-600',
    confirmed: 'text-blue-600',
    shipping: 'text-purple-600',
    delivered: 'text-green-600',
  };

  const statusLabels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipping: 'En livraison',
    delivered: 'Livrée',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenue, <strong>{currentUsername}</strong> {isSuperAdmin && '(SuperAdmin)'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.color} mt-1`}>
                {stat.trend} vs mois dernier
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Commandes Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{order.amount} FCFA</p>
                    <p className={`text-xs ${statusColors[order.status as keyof typeof statusColors]}`}>
                      {statusLabels[order.status as keyof typeof statusLabels]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Alertes Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Seuil: {product.threshold}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">
                      {product.stock}
                    </p>
                    <p className="text-xs text-muted-foreground">en stock</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Évolution des Ventes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">Graphique des ventes (à venir)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
