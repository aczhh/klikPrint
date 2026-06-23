'use client';
import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import styles from './page.module.css';

const initialServices = [
  { category: 'Document Printing', paper: 'HVS A4 80gr', basePrice: 1000, active: true },
  { category: 'Photo Print', paper: 'Glossy 4R', basePrice: 5000, active: true },
  { category: 'Finishing', paper: 'Soft Cover Binding', basePrice: 15000, active: false },
  { category: 'Large Format', paper: 'Art Paper A0', basePrice: 45000, active: true },
  { category: 'Marketing', paper: 'Glossy Business Card', basePrice: 500, active: true },
];

const initialPrinters = [
  { name: 'Epson L31110', serial: 'EP-992-KLP', type: 'Color Inkjet', status: 'ACTIVE', inkColor: '#06B6D4', inkLevel: 80, offlineReason: '' },
  { name: 'Canon C3245', serial: 'CN-112-ADM', type: 'Laser Color', status: 'ACTIVE', inkColor: '#EC4899', inkLevel: 45, offlineReason: '' },
  { name: 'HP LaserJet M404', serial: 'HP-883-MNO', type: 'B&W Office', status: 'OFFLINE', inkColor: '#111', inkLevel: 50, offlineReason: 'Maintenance Bulanan' },
];

export default function ShopManagementPage() {
  const [services, setServices] = useState(initialServices);
  const [printers, setPrinters] = useState(initialPrinters);
  const [showPrinterModal, setShowPrinterModal] = useState(false);
  const [newPrinter, setNewPrinter] = useState({ name: '', serial: '', type: '' });
  const [offlineModal, setOfflineModal] = useState({ isOpen: false, index: -1, reason: '' });

  const toggleServiceStatus = (index: number) => {
    setServices(prev => prev.map((s, i) => i === index ? { ...s, active: !s.active } : s));
  };

  const handlePrinterStatusClick = (index: number) => {
    const p = printers[index];
    if (p.status === 'OFFLINE') {
      // Set to ACTIVE directly
      setPrinters(prev => prev.map((item, i) => i === index ? { ...item, status: 'ACTIVE', offlineReason: '' } : item));
    } else {
      // Open modal to ask for offline reason
      setOfflineModal({ isOpen: true, index, reason: '' });
    }
  };

  const confirmOffline = () => {
    if (!offlineModal.reason.trim()) {
      alert('Mohon masukkan alasan offline!');
      return;
    }
    setPrinters(prev => prev.map((item, i) => i === offlineModal.index ? { ...item, status: 'OFFLINE', offlineReason: offlineModal.reason } : item));
    setOfflineModal({ isOpen: false, index: -1, reason: '' });
  };

  const handleRegisterPrinter = () => {
    if (!newPrinter.name || !newPrinter.serial || !newPrinter.type) {
      alert('Mohon lengkapi semua data printer!');
      return;
    }
    setPrinters([...printers, {
      name: newPrinter.name,
      serial: newPrinter.serial,
      type: newPrinter.type,
      status: 'ACTIVE',
      inkColor: '#10B981', // Default green
      inkLevel: 100,
      offlineReason: ''
    }]);
    setShowPrinterModal(false);
    setNewPrinter({ name: '', serial: '', type: '' });
  };

  return (
    <div className={styles.container}>
      {showPrinterModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px', backgroundColor: '#fff', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Register New Machine</h3>
              <button onClick={() => setShowPrinterModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', fontWeight: 500 }}>Printer Name</label>
                <input className="input-field" value={newPrinter.name} onChange={e => setNewPrinter({...newPrinter, name: e.target.value})} placeholder="e.g. Epson L31110" />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', fontWeight: 500 }}>Serial Number</label>
                <input className="input-field" value={newPrinter.serial} onChange={e => setNewPrinter({...newPrinter, serial: e.target.value})} placeholder="e.g. EP-992-KLP" />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', fontWeight: 500 }}>Printer Type</label>
                <select className="input-field" value={newPrinter.type} onChange={e => setNewPrinter({...newPrinter, type: e.target.value})}>
                  <option value="">Select Type...</option>
                  <option value="Color Inkjet">Color Inkjet</option>
                  <option value="Laser Color">Laser Color</option>
                  <option value="B&W Office">B&W Office</option>
                  <option value="Large Format">Large Format</option>
                </select>
              </div>
            </div>
            <button className="btn-primary" onClick={handleRegisterPrinter} style={{ width: '100%', padding: '12px' }}>Register Printer</button>
          </div>
        </div>
      )}

      {/* Set Offline Modal */}
      {offlineModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px', backgroundColor: '#fff', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Set Printer Offline</h3>
              <button onClick={() => setOfflineModal({ isOpen: false, index: -1, reason: '' })} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>Alasan Offline / Kendala</label>
              <textarea 
                className="input-field" 
                style={{ height: '80px', resize: 'none' }}
                value={offlineModal.reason} 
                onChange={e => setOfflineModal({...offlineModal, reason: e.target.value})} 
                placeholder="e.g. Paper Jam, Tinta Habis, Maintenis Bulanan..." 
              />
            </div>
            <button className="btn-primary" onClick={confirmOffline} style={{ width: '100%', padding: '12px', background: '#EF4444' }}>Matikan Printer (Offline)</button>
          </div>
        </div>
      )}


      {/* Printer Management */}
      <div className="card">
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>Manajemen Mesin Cetak</h3>
            <p className={styles.cardSub}>Monitor connectivity and ink levels for active hardware</p>
          </div>
          <button className="btn-primary" style={{ padding: '9px 18px' }} onClick={() => setShowPrinterModal(true)}>+ Register Machine</button>
        </div>
        <div className={styles.printerGrid}>
          {printers.map((p, i) => (
            <div key={p.name} className={styles.printerCard}>
              <div className={styles.printerHeader}>
                <span className={styles.printerStatusDot} style={{ color: p.status === 'OFFLINE' ? '#EF4444' : '#10B981' }}>●</span>
                <span 
                  className={`${styles.printerBadge} ${p.status === 'OFFLINE' ? styles.offlineBadge : styles.activeBadge}`} 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handlePrinterStatusClick(i)}
                  title="Klik untuk mengubah status"
                >
                  {p.status}
                </span>
              </div>
              <div className={styles.printerIcon}>🖨️</div>
              <div className={styles.printerName}>{p.name}</div>
              <div className={styles.printerSerial}>Serial: {p.serial}</div>
              
              {p.status === 'OFFLINE' && p.offlineReason ? (
                <div style={{ marginTop: '12px', padding: '8px', background: '#FEF2F2', borderRadius: '6px', border: '1px solid #FECACA' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626', marginBottom: '2px' }}>ALASAN OFFLINE:</div>
                  <div style={{ fontSize: '12px', color: '#991B1B' }}>{p.offlineReason}</div>
                </div>
              ) : (
                <>
                  <div className={styles.inkInfo}>
                    <span className={styles.inkLabel}>Type</span>
                    <span className={styles.inkType}>{p.type}</span>
                  </div>
                  <div className={styles.inkBar}>
                    <div className={styles.inkFill} style={{ width: `${p.inkLevel}%`, background: p.inkColor }}></div>
                  </div>
                  {p.inkLevel < 10 && <div className={styles.refillAlert}>REFILL NEEDED</div>}
                </>
              )}
            </div>
          ))}
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
                <td>
                  <div className={`${styles.statusToggle} ${s.active ? styles.statusOn : ''}`} onClick={() => toggleServiceStatus(i)} style={{ cursor: 'pointer' }}>
                    <div className={styles.statusThumb}></div>
                    <span className={s.active ? styles.activeLabel : styles.disabledLabel}>{s.active ? 'Active' : 'Disabled'}</span>
                  </div>
                </td>
                <td>
                  <select 
                    className="input-field" 
                    style={{ padding: '4px 8px', fontSize: '13px', width: 'auto', background: '#F8FAFC' }} 
                    value={s.active ? 'Active' : 'Disabled'}
                    onChange={() => toggleServiceStatus(i)}
                  >
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.tablePagination}>Showing 3 of 12 active services</div>
      </div>
    </div>
  );
}
