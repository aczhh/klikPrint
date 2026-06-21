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
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  lokasi: string;
  status: 'antrian' | 'dicetak' | 'selesai';
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
      locations,
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
