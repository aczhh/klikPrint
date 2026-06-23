'use client';
import { useMemo, useState } from 'react';
import { useApp } from '@/lib/AppContext';
import styles from './page.module.css';

const mockHistory = [
  { id: '#KP-88100', filename: 'Thesis_Final_Rev3.pdf', customer: 'Ahmad Fauzi', type: 'Document', pages: 120, salinan: 3, total: 54000, status: 'selesai', tanggal: '20 Juni 2026, 14:22', durasi: '28 menit', lokasi: 'GKB III Kantek' },
  { id: '#KP-88089', filename: 'Poster_Acara_Dies_Natalis.png', customer: 'Reni Kartika', type: 'Large Format', pages: 1, salinan: 10, total: 450000, status: 'selesai', tanggal: '20 Juni 2026, 11:05', durasi: '1 jam 12 menit', lokasi: 'GKB III Kantek' },
  { id: '#KP-88072', filename: 'Brosur_Produk_Q2.pdf', customer: 'PT. Maju Jaya', type: 'Marketing', pages: 2, salinan: 500, total: 1250000, status: 'selesai', tanggal: '19 Juni 2026, 16:30', durasi: '3 jam', lokasi: 'Perpustakaan Pusat' },
  { id: '#KP-88065', filename: 'Portfolio_Foto_Wedding.jpg', customer: 'Budi Santoso', type: 'Foto', pages: 40, salinan: 1, total: 200000, status: 'selesai', tanggal: '19 Juni 2026, 09:15', durasi: '45 menit', lokasi: 'GKB III Kantek' },
  { id: '#KP-88050', filename: 'Laporan_Keuangan_Q1.pdf', customer: 'CV. Sejahtera', type: 'Document', pages: 80, salinan: 5, total: 120000, status: 'selesai', tanggal: '18 Juni 2026, 13:00', durasi: '55 menit', lokasi: 'Perpustakaan Pusat' },
];

export default function HistoryPage() {
  const { orders, currentAdmin } = useApp();
  const [query, setQuery] = useState('');
  const myLokasi = currentAdmin?.lokasi || '';

  const completedOrders = orders.filter(o => o.status === 'selesai' && o.lokasi === myLokasi);
  const allHistory = useMemo(
    () => [
      ...completedOrders.map(o => ({
        id: `#${o.orderNumber}`,
        filename: o.items[0]?.filename || '-',
        customer: o.items[0]?.nama || '-',
        type: o.items[0]?.type || '-',
        pages: 12,
        salinan: o.items.reduce((a, c) => a + c.salinan, 0),
        total: o.total,
        status: 'selesai',
        tanggal: o.tanggal,
        durasi: '30 menit',
        lokasi: o.lokasi,
      })),
      ...mockHistory.filter(h => h.lokasi === myLokasi),
    ],
    [completedOrders, myLokasi]
  );

  const filteredHistory = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return allHistory;

    return allHistory.filter(h =>
      h.id.toLowerCase().includes(term) ||
      h.customer.toLowerCase().includes(term)
    );
  }, [allHistory, query]);

  const totalRevenue = allHistory.reduce((a, h) => a + h.total, 0);
  const totalJobs = allHistory.length;
  const avgTime = '42 menit';

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Riwayat Pesanan</h1>
        <p className={styles.pageSub}>Pesanan selesai di lokasi <strong>{myLokasi || '-'}</strong></p>
      </div>

      {/* Summary Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ECFDF5', color: '#10B981' }}>✅</div>
          <div>
            <div className={styles.statLabel}>Total Pesanan Selesai</div>
            <div className={styles.statVal}>{totalJobs}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#FFF7ED', color: '#F59E0B' }}>💰</div>
          <div>
            <div className={styles.statLabel}>Total Pendapatan</div>
            <div className={styles.statVal}>Rp {totalRevenue.toLocaleString('id-ID')}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#EFF6FF', color: '#3B82F6' }}>⏱️</div>
          <div>
            <div className={styles.statLabel}>Rata-rata Waktu Cetak</div>
            <div className={styles.statVal}>{avgTime}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <span>🔍</span>
          <input
            type="text"
            placeholder="Cari berdasarkan Order ID atau Nama..."
            className={styles.searchInput}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <select className={styles.filterSelect}>
          <option>7 Hari Terakhir</option>
          <option>30 Hari Terakhir</option>
          <option>Bulan Ini</option>
        </select>
      </div>

      {/* History Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Daftar Pesanan Selesai</h3>
          <span className={styles.tableCount}>{filteredHistory.length} pesanan ditemukan</span>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>FILE / CUSTOMER</th>
                <th>JENIS</th>
                <th>QTY</th>
                <th>TOTAL</th>
                <th>DURASI CETAK</th>
                <th>TANGGAL</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((h, i) => (
                <tr key={i}>
                  <td className={styles.orderId}>{h.id}</td>
                  <td>
                    <div className={styles.fileCell}>
                      <div className={styles.fileIcon}>
                        {h.type === 'Foto' ? '🖼️' : h.type === 'Large Format' ? '🗂️' : '📄'}
                      </div>
                      <div>
                        <div className={styles.fileName}>{h.filename}</div>
                        <div className={styles.customerName}>{h.customer}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={styles.typePill}>{h.type}</span></td>
                  <td className={styles.tdMid}>{h.salinan} salinan</td>
                  <td className={styles.totalTd}>Rp {h.total.toLocaleString('id-ID')}</td>
                  <td className={styles.tdMid}>{h.durasi}</td>
                  <td>
                    <div className={styles.lokasiCell}>
                      <span>📍</span> {h.lokasi}
                    </div>
                  </td>
                  <td className={styles.dateTd}>{h.tanggal}</td>
                  <td>
                    <span className={styles.doneBadge}>✓ Selesai</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <span>Menampilkan <strong>{filteredHistory.length}</strong> dari <strong>{allHistory.length}</strong> pesanan di {myLokasi}</span>
          <div className={styles.pages}>
            <button className={styles.pageBtn}>‹</button>
            <button className={`${styles.pageBtn} ${styles.pageActive}`}>1</button>
            <button className={styles.pageBtn}>2</button>
            <button className={styles.pageBtn}>3</button>
            <button className={styles.pageBtn}>›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
