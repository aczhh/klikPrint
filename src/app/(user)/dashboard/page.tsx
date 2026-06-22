'use client';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const serviceTypes = [
  { key: 'dokumen', icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>, title: 'Dokumen', sub: 'PDF, Laporan, Skripsi', color: '#F98CAC' },
  { key: 'foto', icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>, title: 'Foto', sub: 'Fine Art Quality', color: '#F98CAC' },
  { key: 'poster', icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>, title: 'Format Lebar', sub: 'Blueprint & Poster Teknis', color: '#F98CAC' },
  { key: 'marketing', icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"></path><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"></path><path d="M4 6h16l-2-4H6Z"></path></svg>, title: 'Marketing', sub: 'Brosur & Kartu Nama', color: '#F98CAC' },
];

export default function UserDashboard() {
  const { selectedLokasi, setSelectedLokasi, locations, orders, cart } = useApp();
  const router = useRouter();
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ' : ');

  const activeOrders = orders.filter(o => o.status !== 'selesai').slice(0, 3);

  const handlePickService = (key: string) => {
    if (!selectedLokasi) {
      alert('Silakan pilih lokasi tempat print terlebih dahulu!');
      return;
    }
    router.push(`/konfigurasi/${key}`);
  };

  return (
    <div className={styles.container}>
      {/* Welcome Banner */}
      <div className={styles.bannerWrapper}>
        <div className={styles.welcomeBanner}>
          <div className={styles.welcomeLeft}>
            <h1 className={styles.welcomeTitle}>Hai, mau ngeprint ya?</h1>
            <p className={styles.welcomeSub}>
              Your last project, "Q4 Marketing Portfolio," was completed 2 days ago.
            </p>
          </div>
          <div className={styles.welcomeRight}>
            <div className={styles.dateTimeBadge}>
              {dateStr} &nbsp;{timeStr}
            </div>
          </div>
        </div>

        {/* Absolute Centered Location Picker */}
        <div className={styles.locationWrapper}>
          <div className={styles.locationBox}>
            <div className={styles.locIcon}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className={styles.locText}>
              <div className={styles.locLabel}>
                {selectedLokasi ? `Lokasi - ${selectedLokasi.split(' ').slice(0, -1).join(' ')}` : 'Lokasi - Pilih Cabang'}
              </div>
              <div className={styles.locSub}>
                {selectedLokasi ? selectedLokasi.split(' ').slice(-1)[0] : 'Tempat Print'}
              </div>
            </div>
            <div className={styles.locArrow}>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <select
              className={styles.hiddenSelect}
              value={selectedLokasi}
              onChange={e => setSelectedLokasi(e.target.value)}
            >
              <option value="">-- Pilih Lokasi Tempat Print --</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>STATUS PESANAN</span>
            <button className={styles.viewAll}>Lihat Semua</button>
          </div>
          {activeOrders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderTop}>
                <div>
                  <div className={styles.orderId}>Order #{order.orderNumber}</div>
                  <div className={styles.orderName}>{order.items[0]?.filename || 'Pesanan'}</div>
                </div>
                <span className={`${styles.badge} ${order.status === 'dicetak' ? styles.badgePrinting : styles.badgeQueue}`}>
                  {order.status === 'dicetak' ? 'Sedang Dicetak' : 'Dalam Antrian'}
                </span>
              </div>
              <div className={styles.orderProgress}>
                <div className={styles.progressStep} data-done="true">File</div>
                <div className={styles.progressLine} data-done={order.status === 'dicetak' ? 'true' : 'false'}></div>
                <div className={styles.progressStep} data-done={order.status === 'dicetak' ? 'true' : 'false'}>Warna</div>
                <div className={styles.progressLine} data-done="false"></div>
                <div className={styles.progressStep} data-done="false">Cetak</div>
                <div className={styles.progressLine} data-done="false"></div>
                <div className={styles.progressStep} data-done="false">Selesai</div>
              </div>
              {order.status === 'antrian' && (
                <div className={styles.orderEst}>⏱ Estimasi selesai: {order.waktuBayar}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Service Types */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>BUAT PESANAN BARU</span>
        </div>
        {!selectedLokasi && (
          <div className={styles.locationWarning}>
            ⚠️ Pilih lokasi tempat print di atas sebelum membuat pesanan.
          </div>
        )}
        <div className={styles.serviceGrid}>
          {serviceTypes.map(s => (
            <button
              key={s.key}
              className={styles.serviceCard}
              style={{ background: s.color }}
              onClick={() => handlePickService(s.key)}
            >
              <div className={styles.serviceTopRow}>
                <div className={styles.serviceIconWrap}>
                  <span className={styles.serviceIcon}>{s.icon}</span>
                </div>
                <span className={styles.servicePlus}>⊕</span>
              </div>
              <div className={styles.serviceTitle}>{s.title}</div>
              <div className={styles.serviceSub}>{s.sub}</div>
            </button>
          ))}
        </div>
      </div>
      {/* Floating Cart */}
      {cart.length > 0 && (
        <div className={styles.floatingCart} onClick={() => router.push('/ringkasan')}>
          🛒
          <span className={styles.cartBadge}>{cart.length}</span>
        </div>
      )}
    </div>
  );
}
