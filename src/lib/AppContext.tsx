'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  type: string; // 'dokumen' | 'foto' | 'poster' | 'marketing'
  filename: string;
  nama: string;
  noTelp: string;
  warna: string;
  ukuranKertas: string;
  jenisKertas: string;
  sisi: string;
  finishing: string;
  salinan: number;
  harga: number;
  status?: 'antrian' | 'dicetak' | 'selesai' | 'paused';
  progress?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  lokasi: string;
  status: 'antrian' | 'dicetak' | 'selesai' | 'paused';
  tanggal: string;
  waktuBayar: string;
  progress?: number;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  lokasi: string;
  whatsapp: string;
  password: string;
}

interface AppContextType {
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  // Selected location
  selectedLokasi: string;
  setSelectedLokasi: (l: string) => void;

  // Orders
  orders: Order[];
  createOrder: (lokasi: string) => Order;

  // Admin
  admins: AdminUser[];
  registerAdmin: (admin: Omit<AdminUser, 'id'>) => boolean;
  loginAdmin: (email: string, password: string) => AdminUser | null;
  currentAdmin: AdminUser | null;
  setCurrentAdmin: (a: AdminUser | null) => void;

  // Available locations (from registered admins)
  locations: string[];

  // Actions
  toggleItemStatus: (orderId: string, itemId: string) => void;
  deleteItem: (orderId: string, itemId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const defaultAdmins: AdminUser[] = [
  { id: '1', fullName: 'Admin Kantek', email: 'admin@kantek.com', lokasi: 'GKB III Kantek', whatsapp: '+628123456789', password: 'admin123' },
  { id: '2', fullName: 'Admin Perpus', email: 'admin@perpus.com', lokasi: 'Perpustakaan Pusat', whatsapp: '+628987654321', password: 'admin123' },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>(defaultAdmins);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [selectedLokasi, setSelectedLokasi] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('kp_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      const savedOrders = localStorage.getItem('kp_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      const savedAdmins = localStorage.getItem('kp_admins');
      if (savedAdmins) setAdmins(JSON.parse(savedAdmins));
      const savedAdmin = localStorage.getItem('kp_current_admin');
      if (savedAdmin) setCurrentAdmin(JSON.parse(savedAdmin));
      const savedLokasi = localStorage.getItem('kp_lokasi');
      if (savedLokasi) setSelectedLokasi(savedLokasi);
    } catch {}
  }, []);

  // Listen to cross-tab storage changes
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'kp_orders' && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
      if (e.key === 'kp_cart' && e.newValue) {
        setCart(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Persist changes
  useEffect(() => { localStorage.setItem('kp_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('kp_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('kp_admins', JSON.stringify(admins)); }, [admins]);
  useEffect(() => {
    if (currentAdmin) localStorage.setItem('kp_current_admin', JSON.stringify(currentAdmin));
    else localStorage.removeItem('kp_current_admin');
  }, [currentAdmin]);
  useEffect(() => { localStorage.setItem('kp_lokasi', selectedLokasi); }, [selectedLokasi]);

  // Automated printing logic
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => {
        let changed = false;

        const printingCount = prevOrders.flatMap(o => o.items).filter(i => i.status === 'dicetak').length;
        let availablePrinters = Math.max(0, 3 - printingCount);

        let updated = prevOrders.map(order => {
          let orderChanged = false;
          let newItems = order.items.map(item => {
            if (item.status === 'dicetak') {
              orderChanged = true;
              changed = true;
              const newProgress = (item.progress || 0) + 10;
              if (newProgress >= 100) {
                return { ...item, progress: 100, status: 'selesai' as const };
              }
              return { ...item, progress: newProgress };
            }
            return item;
          });

          if (orderChanged) {
            return { ...order, items: newItems };
          }
          return order;
        });

        if (availablePrinters > 0) {
          for (let i = updated.length - 1; i >= 0; i--) {
            if (availablePrinters <= 0) break;
            
            let orderChanged = false;
            let newItems = updated[i].items.map(item => {
              if (item.status === 'antrian' && availablePrinters > 0) {
                availablePrinters--;
                orderChanged = true;
                changed = true;
                return { ...item, status: 'dicetak' as const, progress: 0 };
              }
              return item;
            });

            if (orderChanged) {
              updated[i] = { ...updated[i], items: newItems };
            }
          }
        }

        if (changed) {
          updated = updated.map(order => {
            const allDone = order.items.length > 0 && order.items.every(i => i.status === 'selesai');
            const anyPrinting = order.items.some(i => i.status === 'dicetak');
            let newStatus: 'antrian' | 'dicetak' | 'selesai' = 'antrian';
            if (allDone) newStatus = 'selesai';
            else if (anyPrinting || order.items.some(i => i.status === 'selesai')) newStatus = 'dicetak';
            
            if (order.status !== newStatus) {
              return { ...order, status: newStatus };
            }
            return order;
          });
        }

        return changed ? updated : prevOrders;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleItemStatus = (orderId: string, itemId: string) => {
    setOrders(prevOrders => {
      let changed = false;
      const updated = prevOrders.map(order => {
        if (order.id === orderId) {
          const newItems = order.items.map(item => {
            if (item.id === itemId) {
              changed = true;
              if (item.status === 'dicetak') return { ...item, status: 'paused' as const };
              if (item.status === 'paused') return { ...item, status: 'antrian' as const };
            }
            return item;
          });
          return { ...order, items: newItems };
        }
        return order;
      });
      return changed ? updated : prevOrders;
    });
  };

  const deleteItem = (orderId: string, itemId: string) => {
    setOrders(prevOrders => {
      const updated = prevOrders.map(order => {
        if (order.id === orderId) {
          return { ...order, items: order.items.filter(i => i.id !== itemId) };
        }
        return order;
      }).filter(order => order.items.length > 0);
      return updated;
    });
  };

  const addToCart = (item: CartItem) => setCart(prev => [...prev, item]);
  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);

  const createOrder = (lokasi: string): Order => {
    const subtotal = cart.reduce((acc, i) => acc + i.harga, 0);
    const pajak = Math.round(subtotal * 0.11);
    const total = subtotal + pajak;
    
    // Split items by salinan so each copy gets its own printer queue
    const splitItems: CartItem[] = [];
    cart.forEach(item => {
      for (let i = 0; i < item.salinan; i++) {
        splitItems.push({
          ...item,
          id: `${item.id}-${i}`,
          salinan: 1, // each split item is 1 copy
          status: 'antrian',
          progress: 0
        });
      }
    });

    const order: Order = {
      id: Date.now().toString(),
      orderNumber: `KP-${Math.floor(20000000 + Math.random() * 9999999)}`,
      items: splitItems,
      total,
      lokasi,
      status: 'antrian',
      tanggal: new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      waktuBayar: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setOrders(prev => [order, ...prev]);
    clearCart();
    return order;
  };

  const registerAdmin = (adminData: Omit<AdminUser, 'id'>): boolean => {
    const exists = admins.find(a => a.email === adminData.email);
    if (exists) return false;
    const newAdmin: AdminUser = { ...adminData, id: Date.now().toString() };
    setAdmins(prev => [...prev, newAdmin]);
    return true;
  };

  const loginAdmin = (email: string, password: string): AdminUser | null => {
    const admin = admins.find(a => a.email === email && a.password === password);
    return admin || null;
  };

  const locations = admins.map(a => a.lokasi);

  return (
    <AppContext.Provider value={{
      cart, addToCart, removeFromCart, clearCart,
      selectedLokasi, setSelectedLokasi,
      orders, createOrder,
      admins, registerAdmin, loginAdmin,
      currentAdmin, setCurrentAdmin,
      locations, toggleItemStatus, deleteItem,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
