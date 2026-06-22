'use client';
import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import styles from './page.module.css';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const services = [
  { category: 'Document Printing', paper: 'HVS A4 80gr', basePrice: 1000, memberPrice: 800, active: true },
  { category: 'Photo Print', paper: 'Glossy 4R', basePrice: 5000, memberPrice: 4500, active: true },
  { category: 'Finishing', paper: 'Soft Cover Binding', basePrice: 15000, memberPrice: 13000, active: false },
  { category: 'Large Format', paper: 'Art Paper A0', basePrice: 45000, memberPrice: 40000, active: true },
  { category: 'Marketing', paper: 'Glossy Business Card', basePrice: 500, memberPrice: 400, active: true },
];

export default function ShopManagementPage() {
  const { currentAdmin } = useApp();
  const [schedule, setSchedule] = useState<Record<string, boolean>>({
    Monday: true, Tuesday: true, Wednesday: true, Thursday: false, Friday: true, Saturday: false, Sunday: false,
  });

  return (
    <div className={styles.container}>
      {/* Top Row: Store Info + Operating Hours */}
      <div className={styles.topRow}>
        {/* Store Info Card */}
        <div className="card">
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Informasi Toko</h3>
            <button className={styles.editBtn}>Edit Details</button>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoIcon} style={{ background: '#EFF6FF' }}>📍</div>
            <div>
              <div className={styles.infoLabel}>PHYSICAL ADDRESS</div>
              <div className={styles.infoVal}>{currentAdmin?.lokasi || 'Jl. Pendidikan No. 45, Kecamatan Sukmajaya, Kota Depok, Jawa Barat 16412'}</div>
            </div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoIcon} style={{ background: '#ECFDF5' }}>💬</div>
            <div>
              <div className={styles.infoLabel}>WHATSAPP CONTACT</div>
              <div className={styles.infoVal}>{currentAdmin?.whatsapp || '+62 812-3456-7890'}</div>
              <div className={styles.infoSub}>Used for automated order notifications</div>
            </div>
          </div>
          <div className={styles.mapBox}>
            <div className={styles.mapPlaceholder}>
              <div className={styles.mapPin}>📍</div>
              <div className={styles.mapLabel}>{currentAdmin?.lokasi || 'Lokasi Toko'}</div>
              <button className={styles.mapBtn}>🗺️ View on Map</button>
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="card">
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Jam Operasional</h3>
            <span className={styles.openBadge}>● Open Now</span>
          </div>
          {weekDays.map(day => (
            <div key={day} className={styles.scheduleRow}>
              <div className={styles.toggle} data-on={schedule[day]} onClick={() => setSchedule(p => ({ ...p, [day]: !p[day] }))}>
                <div className={styles.toggleThumb}></div>
              </div>
              <span className={styles.dayName} style={{ color: schedule[day] ? 'var(--text-dark)' : 'var(--text-light)' }}>{day}</span>
              <input type="time" defaultValue="08:00" className={styles.timeInput} disabled={!schedule[day]} />
              <span className={styles.toLabel}>to</span>
              <input type="time" defaultValue="20:00" className={styles.timeInput} disabled={!schedule[day]} />
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button className="btn-primary" style={{ padding: '10px 24px' }}>Update Schedule</button>
          </div>
        </div>
      </div>

      {/* Printer Management */}
      <div className="card">
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>Manajemen Mesin Cetak</h3>
            <p className={styles.cardSub}>Monitor connectivity and ink levels for active hardware</p>
          </div>
          <button className="btn-primary" style={{ padding: '9px 18px' }}>+ Register Machine</button>
        </div>
        <div className={styles.printerGrid}>
          {[
            { name: 'Epson L31110', serial: 'EP-992-KLP', type: 'Color Inkjet', status: 'ACTIVE', inkColor: '#06B6D4', inkLevel: 80 },
            { name: 'Canon C3245', serial: 'CN-112-ADM', type: 'Laser Color', status: 'ACTIVE', inkColor: '#EC4899', inkLevel: 45 },
            { name: 'HP LaserJet M404', serial: 'HP-883-MNO', type: 'B&W Office', status: 'OFFLINE', inkColor: '#111', inkLevel: 5 },
          ].map(p => (
            <div key={p.name} className={styles.printerCard}>
              <div className={styles.printerHeader}>
                <span className={styles.printerStatusDot} style={{ color: p.status === 'OFFLINE' ? '#EF4444' : '#10B981' }}>●</span>
                <span className={`${styles.printerBadge} ${p.status === 'OFFLINE' ? styles.offlineBadge : styles.activeBadge}`}>{p.status}</span>
              </div>
              <div className={styles.printerIcon}>🖨️</div>
              <div className={styles.printerName}>{p.name}</div>
              <div className={styles.printerSerial}>Serial: {p.serial}</div>
              <div className={styles.inkInfo}>
                <span className={styles.inkLabel}>Type</span>
                <span className={styles.inkType}>{p.type}</span>
              </div>
              <div className={styles.inkBar}>
                <div className={styles.inkFill} style={{ width: `${p.inkLevel}%`, background: p.inkColor }}></div>
              </div>
              {p.inkLevel < 10 && <div className={styles.refillAlert}>REFILL NEEDED</div>}
            </div>
          ))}
          <div className={styles.printerAddCard}>
            <div className={styles.printerAddIcon}>⊕</div>
            <div className={styles.printerAddLabel}>Add New Unit</div>
          </div>
        </div>
      </div>

      {/* Services & Pricing */}
      <div className="card">
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>Layanan & Harga</h3>
            <p className={styles.cardSub}>Set customer pricing and service availability</p>
          </div>
          <div className={styles.searchInline}>
            <span>🔍</span>
            <input type="text" placeholder="Cari layanan..." className={styles.searchInlineInput} />
          </div>
        </div>
        <table className={styles.serviceTable}>
          <thead>
            <tr>
              <th>SERVICE CATEGORY</th>
              <th>PAPER TYPE / MEDIA</th>
              <th>BASE PRICE (IDR)</th>
              <th>MEMBER PRICE (IDR)</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s, i) => (
              <tr key={i}>
                <td>
                  <div className={styles.serviceCell}>
                    <span className={styles.serviceIcon}>📋</span>
                    <span className={styles.serviceName}>{s.category}</span>
                  </div>
                </td>
                <td className={styles.paperCell}>{s.paper}</td>
                <td><input type="number" className={styles.priceInput} defaultValue={s.basePrice} /></td>
                <td><input type="number" className={styles.priceInput} defaultValue={s.memberPrice} /></td>
                <td>
                  <div className={`${styles.statusToggle} ${s.active ? styles.statusOn : ''}`}>
                    <div className={styles.statusThumb}></div>
                    <span className={s.active ? styles.activeLabel : styles.disabledLabel}>{s.active ? 'Active' : 'Disabled'}</span>
                  </div>
                </td>
                <td><button className={styles.moreBtn}>⋯</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.tablePagination}>Showing 3 of 12 active services</div>
      </div>
    </div>
  );
}
