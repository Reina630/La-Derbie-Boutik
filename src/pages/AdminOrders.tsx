import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Search, Eye, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { StickyNote } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

const mockOrders: Order[] = [
  {
    id: 'CMD001',
    customer_name: 'Aïcha Mahamadou',
    customer_phone: '+227 90 12 34 56',
    customer_address: 'Niamey',
    product_name: 'Crème Éclaircissante Chinoise Premium',
    quantity: 2,
    total_price: 29000,
    status: 'pending',
    created_at: '2025-10-20',
  },
  {
    id: 'CMD002',
    customer_name: 'Fatouma Boubacar',
    customer_phone: '+227 91 23 45 67',
    customer_address: 'Maradi',
    product_name: 'Perruque Lace Wig Naturelle',
    quantity: 1,
    total_price: 35000,
    status: 'confirmed',
    created_at: '2025-10-19',
  },
  {
    id: 'CMD003',
    customer_name: 'Hadiza Sani',
    customer_phone: '+227 92 34 56 78',
    customer_address: 'Zinder',
    product_name: 'Kit Maquillage Teintes Africaines',
    quantity: 1,
    total_price: 28500,
    status: 'shipping',
    created_at: '2025-10-18',
  },
  {
    id: 'CMD004',
    customer_name: 'Mariama Ibrahim',
    customer_phone: '+227 93 45 67 89',
    customer_address: 'Tahoua',
    product_name: 'Huile de Carapate Pure',
    quantity: 2,
    total_price: 13000,
    status: 'delivered',
    created_at: '2025-10-15',
  },
];

const statusLabels = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipping: 'En livraison',
  delivered: 'Livrée',
};

const statusVariants = {
  pending: 'default',
  confirmed: 'secondary',
  shipping: 'outline',
  delivered: 'default',
} as const;

const AdminOrders = () => {
  const [noteModalOrder, setNoteModalOrder] = useState<Order | null>(null);
  const [noteInput, setNoteInput] = useState('');
    // Fonction pour sauvegarder la note
    const handleSaveNote = async () => {
      if (!noteModalOrder) return;
      try {
        const { error } = await (supabase as any)
          .from('orders')
          .update({ notes: noteInput })
          .eq('id', noteModalOrder.id);
        if (error) throw error;
        setOrders(prev =>
          prev.map(order =>
            order.id === noteModalOrder.id ? { ...order, notes: noteInput } : order
          )
        );
        toast.success('Note enregistrée');
        setNoteModalOrder(null);
      } catch (error) {
        toast.error('Erreur lors de la sauvegarde de la note');
      }
    };
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
      toast.error('Erreur lors du chargement des commandes');
    }
    setLoading(false);
  };

  let filteredOrders = orders;

  if (searchTerm) {
    filteredOrders = filteredOrders.filter(
      (o) =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (statusFilter !== 'all') {
    filteredOrders = filteredOrders.filter((o) => o.status === statusFilter);
  }

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion des Commandes</h1>
        <p className="text-muted-foreground">{filteredOrders.length} commandes</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une commande..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmée</SelectItem>
                <SelectItem value="shipping">En livraison</SelectItem>
                <SelectItem value="delivered">Livrée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Chargement des commandes...</div>
          ) : paginatedOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune commande trouvée
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Commande</TableHead>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Qté</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => {
                // Couleur de ligne plus foncée selon le statut
                let rowClassName = "";
                switch(order.status) {
                  case 'pending':
                    rowClassName = "bg-yellow-200 hover:bg-yellow-300";
                    break;
                  case 'confirmed':
                    rowClassName = "bg-blue-200 hover:bg-blue-300";
                    break;
                  case 'delivered':
                    rowClassName = "bg-green-200 hover:bg-green-300";
                    break;
                  case 'cancelled':
                    rowClassName = "bg-red-200 hover:bg-red-300";
                    break;
                  default:
                    rowClassName = "hover:bg-muted/50";
                }

                const handleNotesChange = async (orderId: string, notes: string) => {
                  try {
                    // Update local state immediately for better UX
                    setOrders(prev => prev.map(order => 
                      order.id === orderId ? { ...order, notes } : order
                    ));
                    
                    // Update in database
                    const { error } = await (supabase as any)
                      .from('orders')
                      .update({ notes })
                      .eq('id', orderId);
                    
                    if (error) {
                      console.error('Error updating notes:', error);
                      // Revert local state on error
                      setOrders(prev => prev.map(order => 
                        order.id === orderId ? { ...order, notes: order.notes } : order
                      ));
                      toast.error('Erreur lors de la mise à jour des notes');
                    }
                  } catch (error) {
                    console.error('Error updating notes:', error);
                    toast.error('Erreur lors de la mise à jour des notes');
                  }
                };

                return (
                <TableRow key={order.id} className={rowClassName}>
                  <TableCell className="font-medium">#{order.id.substring(0, 8)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{new Date(order.created_at).toLocaleDateString('fr-FR')}</div>
                      <div className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{order.customer_name}</TableCell>
                  <TableCell>{order.customer_phone}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={order.customer_address}>
                    {order.customer_address}
                  </TableCell>
                  <TableCell>{order.product_name}</TableCell>
                  <TableCell className="text-center">{order.quantity}</TableCell>
                  <TableCell className="font-semibold">
                    {order.total_price.toLocaleString()} FCFA
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="confirmed">Confirmée</SelectItem>
                        <SelectItem value="delivered">Livrée</SelectItem>
                        <SelectItem value="cancelled">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant={order.notes ? "default" : "outline"}
                            className={order.notes ? "bg-green-600 text-white" : ""}
                            onClick={() => {
                              setNoteModalOrder(order);
                              setNoteInput(order.notes || '');
                            }}
                          >
                            <StickyNote className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {order.notes ? "Voir/modifier la note" : "Ajouter une note"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {order.notes && (
                      <span className="ml-2 text-green-700 font-semibold">•</span>
                    )}
                  </TableCell>
                        {/* Modal pour ajouter/modifier une note */}
                        <Dialog open={!!noteModalOrder} onOpenChange={open => !open && setNoteModalOrder(null)}>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                {noteModalOrder
                                  ? `Note pour la commande #${noteModalOrder.id.substring(0, 8)}`
                                  : "Note"}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <textarea
                                className="w-full border rounded p-2"
                                rows={4}
                                value={noteInput}
                                onChange={e => setNoteInput(e.target.value)}
                                placeholder="Ajouter une note interne pour cette commande..."
                              />
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setNoteModalOrder(null)}>
                                  Annuler
                                </Button>
                                <Button onClick={handleSaveNote}>Enregistrer</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Commande #{order.id.substring(0, 8)}</DialogTitle>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Informations Client</h4>
                                <div className="space-y-1 text-sm">
                                  <p><strong>Nom:</strong> {selectedOrder.customer_name}</p>
                                  <p><strong>Téléphone:</strong> {selectedOrder.customer_phone}</p>
                                  <p><strong>Adresse:</strong> {selectedOrder.customer_address}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Détails Commande</h4>
                                <div className="space-y-1 text-sm">
                                  <p><strong>Produit:</strong> {selectedOrder.product_name}</p>
                                  <p><strong>Quantité:</strong> {selectedOrder.quantity}</p>
                                  <p><strong>Total:</strong> {selectedOrder.total_price.toLocaleString()} FCFA</p>
                                  <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString('fr-FR')}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          window.open(
                            `https://wa.me/${order.customer_phone.replace(/\s/g, '')}`,
                            '_blank'
                          )
                        }
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
              })}
            </TableBody>
          </Table>
          )}

          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={
                        currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
