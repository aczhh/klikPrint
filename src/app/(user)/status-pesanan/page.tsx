'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, Order } from '@/lib/AppContext';
import styles from './page.module.css';

export default function StatusPesananPage() {
  const router = useRouter();
  const { orders } = useApp();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const lastId = localStorage.getItem('kp_last_order_id');
    if (!lastId) return;
    const found = orders.find(o => o.id === lastId);
    if (found) setOrder(found);
    else {
      // if not in context yet, try to parse legacy storage
      const saved = localStorage.getItem('kp_last_order');
      if (saved) setOrder(JSON.parse(saved));
    }
  }, [orders]);

  if (!order) {
    return (
      <div className={styles.empty}>
        <p>Tidak ada pesanan ditemukan.</p>
        <button className="btn-primary" onClick={() => router.push('/dashboard')}>Kembali ke Dashboard</button>
      </div>
    );
  }

  const item = order.items[0];
  const estTime = new Date();
  estTime.setHours(estTime.getHours() + 1);
  const estStr = estTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={styles.container}>
      {/* Success Header */}
      <div className={styles.successHeader}>
        <div className={styles.successIcon}>✓</div>
        <h1 className={styles.successTitle}>Pesanan Berhasil Dibuat!</h1>
        <p className={styles.orderNum}>Nomor Pesanan: <span className={styles.orderNumVal}>#{order.orderNumber}</span></p>
      </div>

      {/* Progress Tracker */}
      <div className={styles.tracker}>
        <div className={styles.trackerStep} data-done="true">
          <div className={styles.trackerIcon} data-active="true">✓</div>
          <div className={styles.trackerLine} data-active="true"></div>
          <span className={styles.trackerLabel} data-active="true">Pesanan Diterima</span>
        </div>
        <div className={styles.trackerStep} data-done="false">
          <div className={styles.trackerIcon} data-active="false">🖨</div>
          <div className={styles.trackerLine} data-active="false"></div>
          <span className={styles.trackerLabel} data-active="false" style={{ fontWeight: 700 }}>Sedang Dicetak</span>
        </div>
        <div className={styles.trackerStep} data-done="false">
          <div className={styles.trackerIcon} data-active="false">📦</div>
          <span className={styles.trackerLabel} data-active="false">Siap Diambil</span>
        </div>
      </div>

      {/* Detail + Estimation */}
      <div className={styles.infoGrid}>
        <div className={styles.detailCard}>
          <div className={styles.detailTitle}>
            <span>📋</span> Detail Pesanan
            <span className={styles.orderId}>Order ID: {order.orderNumber}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Produk</span>
            <span className={styles.detailVal}>{item?.filename}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Spesifikasi</span>
            <span className={styles.detailVal}>{item?.jenisKertas}, {item?.warna === 'berwarna' ? 'Full Color' : 'Hitam Putih'}, {item?.sisi}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Lokasi Cetak</span>
            <span className={styles.detailVal}>Ambil di Toko ({order.lokasi})</span>
          </div>
          <div className={styles.detailRow} style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <span className={styles.detailLabel} style={{ fontWeight: 700, fontSize: '16px' }}>Total Pembayaran</span>
            <span className={styles.detailPaid}>Rp {order.total.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className={styles.estCard}>
          <div className={styles.estLabel}>⏱ ESTIMASI SELESAI</div>
          <div className={styles.estTime}>Hari ini, {estStr}</div>
          <div className={styles.estDate}>{order.tanggal}</div>
          <div className={styles.estVisual}>
            <div className={styles.printerVisual}>🖨️</div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '48px' }}>
        <button className="btn-primary" style={{ padding: '14px 48px', fontSize: '16px' }} onClick={() => router.push('/dashboard')}>
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}
