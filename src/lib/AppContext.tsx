'use client';
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

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
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  lokasi: string;
  status: 'antrian' | 'dicetak' | 'selesai' | 'paused';
  progress?: number; // 0-100
  printerId?: string | null;
  durationSec?: number; // optional simulated duration
  tanggal: string;
  waktuBayar: string;
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

  // Order controls (printing simulation)
  toggleOrder: (orderId: string) => void;
  removeOrder: (orderId: string) => void;

  // Available locations (from registered admins)
  locations: string[];
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
  const printersCount = 3;
  const runningTimers = useRef<Record<string, number>>({});
  const ordersRef = useRef<Order[]>([]);

  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

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

  // Sync orders across tabs/windows using localStorage events
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'kp_orders') {
        try {
          const val = e.newValue ? JSON.parse(e.newValue) : [];
          setOrders(val);
        } catch (err) {
          console.error('failed parsing kp_orders from storage event', err);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
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

  const addToCart = (item: CartItem) => setCart(prev => [...prev, item]);
  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);

  const createOrder = (lokasi: string): Order => {
    const subtotal = cart.reduce((acc, i) => acc + i.harga, 0);
    const pajak = Math.round(subtotal * 0.11);
    const total = subtotal + pajak;
    const order: Order = {
      id: Date.now().toString(),
      orderNumber: `KP-${Math.floor(20000000 + Math.random() * 9999999)}`,
      items: [...cart],
      total,
      lokasi,
      status: 'antrian',
      progress: 0,
      printerId: null,
      durationSec: Math.max(8, Math.floor(cart.reduce((a, c) => a + (c.salinan || 1), 0) / 2) + Math.floor(Math.random() * 20)),
      tanggal: new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      waktuBayar: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setOrders(prev => {
      const newOrders = [order, ...prev];
      clearCart();
      // immediately try to start jobs using the snapshot `prev` (which contains current running printers)
      setTimeout(() => {
        const used = getUsedPrinterIds(prev);
        const freeSlots = Math.max(0, printersCount - used.length);
        if (freeSlots <= 0) return;
        const queued = newOrders.filter(o => o.status === 'antrian');
        const toStart = queued.slice(0, freeSlots);
        toStart.forEach(o => startPrinting(o.id));
      }, 0);
      return newOrders;
    });
    return order;
  };

  // helpers for printing simulation
  const getUsedPrinterIds = (list: Order[]) => list.map(o => o.printerId).filter(Boolean) as string[];

  const startNextInQueue = () => {
    const used = getUsedPrinterIds(ordersRef.current);
    const freeSlots = Math.max(0, printersCount - used.length);
    if (freeSlots <= 0) return;
    const queued = ordersRef.current.filter(o => o.status === 'antrian');
    if (queued.length === 0) return;
    const toStart = queued.slice(0, freeSlots);
    toStart.forEach(o => startPrinting(o.id));
  };

  const startPrinting = (orderId: string) => {
    setOrders(prev => {
      const next = prev.map(o => {
        if (o.id !== orderId) return o;
        // assign first free printer id (P1..PN)
        const used = getUsedPrinterIds(prev);
        let pid = null;
        for (let i = 1; i <= printersCount; i++) {
          const name = `P${i}`;
          if (!used.includes(name)) { pid = name; break; }
        }
        return { ...o, status: 'dicetak', printerId: pid, progress: o.progress ?? 0 };
      });
      return next;
    });

    // start interval
    const key = orderId;
    if (runningTimers.current[key]) return;
    const id = window.setInterval(() => {
      setOrders(prev => {
        const next = prev.map(o => {
          if (o.id !== orderId) return o;
          if (o.status !== 'dicetak') return o;
          const inc = Math.max(1, Math.ceil((100 / Math.max(8, o.durationSec || 12))));
          const newProgress = Math.min(100, (o.progress || 0) + inc);
          const updated = { ...o, progress: newProgress };
          if (newProgress >= 100) {
            updated.status = 'selesai';
            updated.progress = 100;
            updated.printerId = null;
            // clear timer for this job and free printer slot
            if (runningTimers.current[key]) {
              clearInterval(runningTimers.current[key]);
              delete runningTimers.current[key];
            }
            // after finishing, try to start next queued jobs
            setTimeout(() => startNextInQueue(), 0);
          }
          return updated;
        });
        return next;
      });
    }, 1000);

    runningTimers.current[key] = id;
    console.debug('[AppContext] startPrinting', orderId);
  };

  // pause printing
  const pauseOrder = (orderId: string) => {
    if (runningTimers.current[orderId]) {
      clearInterval(runningTimers.current[orderId]);
      delete runningTimers.current[orderId];
    }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'paused' } : o));
    // after pausing, try to fill slot with next queued
    setTimeout(() => startNextInQueue(), 0);
    console.debug('[AppContext] pauseOrder', orderId);
  };

  const resumeOrder = (orderId: string) => {
    // resume only if there is available printer
    const used = getUsedPrinterIds(ordersRef.current);
    if (used.length >= printersCount) {
      // keep in queue
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'antrian' } : o));
      return;
    }
    startPrinting(orderId);
  };

  const toggleOrder = (orderId: string) => {
    const ord = ordersRef.current.find(o => o.id === orderId);
    if (!ord) return;
    if (ord.status === 'dicetak') pauseOrder(orderId);
    else if (ord.status === 'paused' || ord.status === 'antrian') resumeOrder(orderId);
  };

  const removeOrder = (orderId: string) => {
    if (runningTimers.current[orderId]) {
      clearInterval(runningTimers.current[orderId]);
      delete runningTimers.current[orderId];
    }
    setOrders(prev => prev.filter(o => o.id !== orderId));
    setTimeout(() => startNextInQueue(), 0);
  };

  useEffect(() => {
    console.debug('[AppContext] orders updated', orders.length);
  }, [orders]);

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
      locations,
      toggleOrder, removeOrder,
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
