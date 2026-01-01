import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Search, MessageCircle } from 'lucide-react';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Customer {
  id: string;
  name: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
}


const AdminCustomers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);

  // Chargement des commandes et regroupement par client
  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      const { data, error } = await (supabase as any).from('orders').select('*');
      const orders: any[] = data || [];
      if (error || !orders) {
        setCustomers([]);
        setLoading(false);
        return;
      }
      // Regroupement par client
      const grouped: Record<string, Customer> = {};
      for (const order of orders) {
        const key = order.customer_phone;
        if (!grouped[key]) {
          grouped[key] = {
            id: key,
            name: order.customer_name,
            phone: order.customer_phone,
            city: order.customer_city || '',
            totalOrders: 0,
            totalSpent: 0,
            lastOrder: order.created_at,
          };
        }
        grouped[key].totalOrders++;
        grouped[key].totalSpent += Number(order.total_price || 0);
        // Met à jour la date de la dernière commande si plus récente
        if (new Date(order.created_at) > new Date(grouped[key].lastOrder)) {
          grouped[key].lastOrder = order.created_at;
        }
      }
      setCustomers(Object.values(grouped));
      setLoading(false);
    };
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion des Clients</h1>
        <p className="text-muted-foreground">{filteredCustomers.length} clients</p>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher par nom, téléphone ou ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Commandes</TableHead>
                <TableHead>Total dépensé</TableHead>
                <TableHead>Dernière commande</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.city}</TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell className="font-semibold">
                    {customer.totalSpent.toLocaleString()} FCFA
                  </TableCell>
                  <TableCell>
                    {new Date(customer.lastOrder).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        window.open(
                          `https://wa.me/${customer.phone.replace(/\s/g, '')}`,
                          '_blank'
                        )
                      }
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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

export default AdminCustomers;
