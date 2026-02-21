import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Calendar, Save } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  product_name: string;
  quantity: number;
  total_price: number;
  status: string;
  notes?: string;
  created_at: string;
}

const statusLabels = {
  pending: 'À contacter',
  confirmed: 'Confirmée',
  unreachable: 'Injoignable',
  shipping: 'En livraison',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

const statusColors = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-green-500',
  unreachable: 'bg-orange-500',
  shipping: 'bg-blue-500',
  delivered: 'bg-gray-500',
  cancelled: 'bg-red-500',
};

const Prospection = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingNotes, setEditingNotes] = useState<{[key: string]: string}>({});
  const [displayCount, setDisplayCount] = useState(20);

  useEffect(() => {
    loadOrders();
    
    // Actualisation automatique toutes les 30 secondes
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
      
      // Initialiser les notes pour l'édition
      const notesMap: {[key: string]: string} = {};
      (data || []).forEach((order: Order) => {
        notesMap[order.id] = order.notes || '';
      });
      setEditingNotes(notesMap);
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
      toast.error('Erreur lors du chargement des commandes');
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await (supabase as any)
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success('Statut mis à jour');
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleSaveNote = async (orderId: string) => {
    try {
      const note = editingNotes[orderId] || '';
      const { error } = await (supabase as any)
        .from('orders')
        .update({ notes: note })
        .eq('id', orderId);

      if (error) throw error;
      
      setOrders(orders.map(o => o.id === orderId ? { ...o, notes: note } : o));
      toast.success('Commentaire sauvegardé');
    } catch (error) {
      console.error('Erreur sauvegarde commentaire:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleNoteChange = (orderId: string, value: string) => {
    setEditingNotes(prev => ({
      ...prev,
      [orderId]: value
    }));
  };

  // Réinitialiser l'affichage quand les filtres changent
  useEffect(() => {
    setDisplayCount(20);
  }, [searchTerm, statusFilter]);

  let filteredOrders = orders;

  if (searchTerm) {
    filteredOrders = filteredOrders.filter(
      (o) =>
        o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer_phone.includes(searchTerm) ||
        o.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (statusFilter !== 'all') {
    filteredOrders = filteredOrders.filter((o) => o.status === statusFilter);
  }

  // Limiter l'affichage pour la pagination
  const displayedOrders = filteredOrders.slice(0, displayCount);
  const hasMore = filteredOrders.length > displayCount;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-background p-3 md:p-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="sticky top-0 bg-background z-10 pb-3 border-b">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Prospection</h1>
              <p className="text-xs text-muted-foreground">
                {filteredOrders.length} commande(s) • Affichage {Math.min(displayCount, filteredOrders.length)}
              </p>
            </div>
            <Button onClick={loadOrders} size="sm" variant="outline">
              🔄
            </Button>
          </div>

          {/* Stats compactes */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </div>
              <div className="text-[10px] text-muted-foreground">À contacter</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-orange-600">
                {orders.filter(o => o.status === 'unreachable').length}
              </div>
              <div className="text-[10px] text-muted-foreground">Injoignable</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-green-600">
                {orders.filter(o => o.status === 'confirmed').length}
              </div>
              <div className="text-[10px] text-muted-foreground">Confirmées</div>
            </div>
          </div>

          {/* Filtres */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous ({orders.length})</SelectItem>
                <SelectItem value="pending">À contacter ({orders.filter(o => o.status === 'pending').length})</SelectItem>
                <SelectItem value="unreachable">Injoignable ({orders.filter(o => o.status === 'unreachable').length})</SelectItem>
                <SelectItem value="confirmed">Confirmée ({orders.filter(o => o.status === 'confirmed').length})</SelectItem>
                <SelectItem value="shipping">En livraison ({orders.filter(o => o.status === 'shipping').length})</SelectItem>
                <SelectItem value="delivered">Livrée ({orders.filter(o => o.status === 'delivered').length})</SelectItem>
                <SelectItem value="cancelled">Annulée ({orders.filter(o => o.status === 'cancelled').length})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Liste des commandes en cartes */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">Aucune commande</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {displayedOrders.map((order) => (
              <Card 
                key={order.id} 
                className={`${
                  order.status === 'pending' ? 'border-yellow-500 border-2 bg-yellow-50/50 dark:bg-yellow-950/10' : 
                  order.status === 'unreachable' ? 'border-orange-500 border-2 bg-orange-50/50 dark:bg-orange-950/10' :
                  ''
                }`}
              >
                <CardContent className="p-4 space-y-3">
                  {/* Heure + Statut */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(order.created_at)}
                    </div>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="h-7 text-xs w-[140px]">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${statusColors[order.status as keyof typeof statusColors]}`}></div>
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">À contacter</SelectItem>
                        <SelectItem value="unreachable">Injoignable</SelectItem>
                        <SelectItem value="confirmed">Confirmée</SelectItem>
                        <SelectItem value="shipping">En livraison</SelectItem>
                        <SelectItem value="delivered">Livrée</SelectItem>
                        <SelectItem value="cancelled">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Client */}
                  <div>
                    <div className="font-bold text-lg">{order.customer_name}</div>
                    <div className="font-mono text-sm text-muted-foreground">{order.customer_phone}</div>
                  </div>

                  {/* Produit */}
                  <div className="bg-accent/5 p-3 rounded-lg">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{order.product_name}</div>
                        <div className="text-xs text-muted-foreground mt-1">Quantité: {order.quantity}</div>
                      </div>
                      <div className="font-bold text-accent whitespace-nowrap">
                        {order.total_price.toLocaleString()} F
                      </div>
                    </div>
                  </div>

                  {/* Commentaires */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Commentaire
                    </label>
                    <div className="flex gap-2">
                      <Textarea
                        value={editingNotes[order.id] || ''}
                        onChange={(e) => handleNoteChange(order.id, e.target.value)}
                        placeholder="Noter les détails de l'échange, les remarques..."
                        className="min-h-[60px] text-sm"
                        rows={2}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSaveNote(order.id)}
                        className="h-auto px-3"
                        disabled={editingNotes[order.id] === (order.notes || '')}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bouton Voir plus */}
          {hasMore && (
            <div className="text-center py-4">
              <Button
                onClick={() => setDisplayCount(prev => prev + 20)}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Voir plus ({filteredOrders.length - displayCount} restantes)
              </Button>
            </div>
          )}
        </>
        )}
      </div>
    </div>
  );
};

export default Prospection;
