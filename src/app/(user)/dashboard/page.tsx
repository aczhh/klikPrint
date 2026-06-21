'use client';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const serviceTypes = [
  { key: 'dokumen', icon: '📄', title: 'Dokumen', sub: 'PDF, Laporan, Skripsi', color: '#EFF6FF', iconBg: '#DBEAFE' },
  { key: 'foto', icon: '🖼️', title: 'Foto', sub: 'Fine Art Quality', color: '#FFF0F6', iconBg: '#FFD6E7' },
  { key: 'poster', icon: '🗂️', title: 'Format Lebar', sub: 'Blueprint & Poster Teknis', color: '#ECFDF5', iconBg: '#D1FAE5' },
  { key: 'marketing', icon: '📣', title: 'Marketing', sub: 'Brosur & Kartu Nama', color: '#FFF7ED', iconBg: '#FED7AA' },
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
              <svg width="12" height="14" viewBox="0 0 14 18" fill="none"><path d="M7 0C3.13 0 0 3.13 0 7C0 12.25 7 18 7 18C7 18 14 12.25 14 7C14 3.13 10.87 0 7 0ZM7 9.5C5.62 9.5 4.5 8.38 4.5 7C4.5 5.62 5.62 4.5 7 4.5C8.38 4.5 9.5 5.62 9.5 7C9.5 8.38 8.38 9.5 7 9.5Z" fill="#3B82F6"/></svg>
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
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
                <div className={styles.serviceIconWrap} style={{ background: s.iconBg }}>
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
