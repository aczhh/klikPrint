'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, Order } from '@/lib/AppContext';
import styles from './page.module.css';

export default function StatusPesananPage() {
  const router = useRouter();
  const { orders } = useApp();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('kp_last_order');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setOrderId(parsed.id);
      } catch (e) {}
    }
  }, []);

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className={styles.empty}>
        <p>Tidak ada pesanan ditemukan.</p>
        <button className="btn-primary" onClick={() => router.push('/dashboard')}>Kembali ke Dashboard</button>
      </div>
    );
  }

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
          <div className={styles.trackerLine} data-active={order.status === 'dicetak' || order.status === 'selesai'}></div>
          <span className={styles.trackerLabel} data-active="true">Pesanan Diterima</span>
        </div>
        <div className={styles.trackerStep} data-done={order.status === 'selesai'}>
          <div className={styles.trackerIcon} data-active={order.status === 'dicetak' || order.status === 'selesai'}>🖨</div>
          <div className={styles.trackerLine} data-active={order.status === 'selesai'}></div>
          <span className={styles.trackerLabel} data-active={order.status === 'dicetak' || order.status === 'selesai'} style={{ fontWeight: 700 }}>
            {order.status === 'selesai' ? 'Selesai Dicetak' : order.status === 'dicetak' ? 'Sedang Dicetak' : 'Menunggu Antrian'}
          </span>
        </div>
        <div className={styles.trackerStep} data-done={order.status === 'selesai'}>
          <div className={styles.trackerIcon} data-active={order.status === 'selesai'}>📦</div>
          <span className={styles.trackerLabel} data-active={order.status === 'selesai'}>Siap Diambil</span>
        </div>
      </div>

      {/* Detail + Estimation */}
      <div className={styles.infoGrid}>
        <div className={styles.detailCard}>
          <div className={styles.detailTitle}>
            <span>📋</span> Detail Pesanan
            <span className={styles.orderId}>Order ID: {order.orderNumber}</span>
          </div>
          {order.items.map((item, idx) => (
            <div key={idx} style={{ padding: '16px 0', borderBottom: idx === order.items.length - 1 ? 'none' : '1px solid #E2E8F0' }}>
              <div className={styles.detailRow} style={{ borderBottom: 'none', paddingBottom: '8px' }}>
                <span className={styles.detailLabel}>Produk {idx + 1}</span>
                <span className={styles.detailVal}>
                  {item.filename}
                  <div style={{ fontSize: '12px', marginTop: '4px', fontWeight: 600, color: item.status === 'selesai' ? '#10B981' : item.status === 'dicetak' ? '#F59E0B' : '#94A3B8' }}>
                    {item.status === 'selesai' ? '● Selesai' : item.status === 'dicetak' ? `● Sedang Dicetak (${item.progress || 0}%)` : '● Menunggu Antrian'}
                  </div>
                </span>
              </div>
              <div className={styles.detailRow} style={{ borderBottom: 'none', paddingTop: 0 }}>
                <span className={styles.detailLabel}>Spesifikasi</span>
                <span className={styles.detailVal}>{item.jenisKertas}, {item.warna === 'berwarna' ? 'Full Color' : 'Hitam Putih'}, {item.sisi} ({item.salinan} lbr)</span>
              </div>
            </div>
          ))}
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
