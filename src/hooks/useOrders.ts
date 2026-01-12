import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type OrderStatus = 'confirmed' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  seller_id: string;
  seller_name: string | null;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  notes: string | null;
  updated_by: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  order_number: string;
  delivery_code: string;
  phone: string;
  delivery_address: string;
  notes: string | null;
  status: OrderStatus;
  total_amount: number;
  shipping_amount: number;
  tax_amount: number;
  payment_method: string;
  estimated_delivery: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  status_history?: OrderStatusHistory[];
}

export interface CreateOrderData {
  phone: string;
  delivery_address: string;
  notes?: string;
  payment_method: string;
  items: {
    product_id?: string;
    product_name: string;
    product_image?: string;
    seller_id: string;
    seller_name?: string;
    quantity: number;
    unit_price: number;
  }[];
  total_amount: number;
  shipping_amount: number;
  tax_amount: number;
}

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DJ-${timestamp}${random}`;
};

// Generate 5-digit delivery code
const generateDeliveryCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

export const useOrders = () => {
  const { user, isSeller, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders based on user role
  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      if (ordersData && ordersData.length > 0) {
        const orderIds = ordersData.map(o => o.id);
        
        // Fetch items and status history in parallel
        const [itemsResult, historyResult] = await Promise.all([
          supabase
            .from('order_items')
            .select('*')
            .in('order_id', orderIds),
          supabase
            .from('order_status_history')
            .select('*')
            .in('order_id', orderIds)
            .order('created_at', { ascending: true })
        ]);

        const ordersWithDetails = ordersData.map(order => ({
          ...order,
          status: order.status as OrderStatus,
          items: (itemsResult.data || []).filter(item => item.order_id === order.id) as OrderItem[],
          status_history: (historyResult.data || []).filter(h => h.order_id === order.id) as OrderStatusHistory[]
        }));

        setOrders(ordersWithDetails);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a new order
  const createOrder = async (data: CreateOrderData): Promise<Order | null> => {
    if (!user) {
      toast.error('Please sign in to place an order');
      return null;
    }

    const orderNumber = generateOrderNumber();
    const deliveryCode = generateDeliveryCode();
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

    try {
      // Insert order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          order_number: orderNumber,
          delivery_code: deliveryCode,
          phone: data.phone,
          delivery_address: data.delivery_address,
          notes: data.notes || null,
          payment_method: data.payment_method,
          total_amount: data.total_amount,
          shipping_amount: data.shipping_amount,
          tax_amount: data.tax_amount,
          estimated_delivery: estimatedDelivery.toISOString(),
          status: 'confirmed'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = data.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id || null,
        product_name: item.product_name,
        product_image: item.product_image || null,
        seller_id: item.seller_id,
        seller_name: item.seller_name || null,
        quantity: item.quantity,
        unit_price: item.unit_price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Insert initial status history
      const { error: historyError } = await supabase
        .from('order_status_history')
        .insert({
          order_id: order.id,
          status: 'confirmed',
          notes: 'Order placed successfully',
          updated_by: user.id
        });

      if (historyError) throw historyError;

      return {
        ...order,
        status: order.status as OrderStatus,
        items: orderItems.map((item, i) => ({
          ...item,
          id: `temp-${i}`,
          created_at: new Date().toISOString()
        })) as OrderItem[]
      };
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order', { description: error.message });
      return null;
    }
  };

  // Update order status (for sellers/admins)
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, notes?: string) => {
    if (!user) return false;

    try {
      // Update order status
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (updateError) throw updateError;

      // Insert status history
      const { error: historyError } = await supabase
        .from('order_status_history')
        .insert({
          order_id: orderId,
          status: newStatus,
          notes: notes || getStatusMessage(newStatus),
          updated_by: user.id
        });

      if (historyError) throw historyError;

      toast.success('Order status updated', {
        description: `Order marked as ${getStatusLabel(newStatus)}`
      });

      // Refresh orders
      await fetchOrders();
      return true;
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update status', { description: error.message });
      return false;
    }
  };

  // Fetch a single order by ID or order number
  const fetchOrderByNumber = async (orderNumber: string): Promise<Order | null> => {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .or(`order_number.eq.${orderNumber},id.eq.${orderNumber}`)
        .single();

      if (error || !order) return null;

      // Fetch items and history
      const [itemsResult, historyResult] = await Promise.all([
        supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id),
        supabase
          .from('order_status_history')
          .select('*')
          .eq('order_id', order.id)
          .order('created_at', { ascending: true })
      ]);

      return {
        ...order,
        status: order.status as OrderStatus,
        items: (itemsResult.data || []) as OrderItem[],
        status_history: (historyResult.data || []) as OrderStatusHistory[]
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  };

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    fetchOrders();

    // Subscribe to order updates
    const ordersChannel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order update:', payload);
          fetchOrders();
          
          // Show notification for status changes
          if (payload.eventType === 'UPDATE' && payload.new) {
            const newOrder = payload.new as any;
            toast.info('Order Update', {
              description: `Order ${newOrder.order_number} is now ${getStatusLabel(newOrder.status)}`
            });
          }
        }
      )
      .subscribe();

    const historyChannel = supabase
      .channel('status-history-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_status_history'
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(historyChannel);
    };
  }, [user, fetchOrders]);

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    fetchOrderByNumber,
    refetch: fetchOrders
  };
};

// Helper functions
export const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    confirmed: 'Order Confirmed',
    picked_up: 'Picked Up by Seller',
    in_transit: 'In Transit',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered'
  };
  return labels[status];
};

export const getStatusMessage = (status: OrderStatus): string => {
  const messages: Record<OrderStatus, string> = {
    confirmed: 'Order has been confirmed',
    picked_up: 'Order has been picked up by seller',
    in_transit: 'Order is in transit',
    out_for_delivery: 'Order is out for delivery',
    delivered: 'Order has been delivered'
  };
  return messages[status];
};

export const getStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    confirmed: 'bg-blue-100 text-blue-700',
    picked_up: 'bg-yellow-100 text-yellow-700',
    in_transit: 'bg-purple-100 text-purple-700',
    out_for_delivery: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700'
  };
  return colors[status];
};

export const getEstimatedTimeRemaining = (estimatedDelivery: string | null): string => {
  if (!estimatedDelivery) return 'Calculating...';
  
  const now = new Date();
  const estimated = new Date(estimatedDelivery);
  const diffMs = estimated.getTime() - now.getTime();
  
  if (diffMs < 0) return 'Arriving soon';
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return 'Arriving in less than an hour';
  if (diffHours < 24) return `Arriving in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  if (diffDays === 1) return 'Arriving tomorrow';
  return `Arriving in ${diffDays} days`;
};
