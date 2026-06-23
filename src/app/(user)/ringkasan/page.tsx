'use client';
import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function RingkasanPage() {
  const { cart, removeFromCart, selectedLokasi, setSelectedLokasi, locations, createOrder } = useApp();
  const router = useRouter();
  const [promo, setPromo] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [paying, setPaying] = useState(false);
  const [countdown, setCountdown] = useState(14 * 60 + 47); // 14:47

  const subtotal = cart.reduce((a, c) => a + c.harga, 0);
  const pajak = Math.round(subtotal * 0.11);
  const total = subtotal + pajak;

  // Countdown timer (starts when QR shown)
  const startTimer = () => {
    let secs = 14 * 60 + 47;
    const interval = setInterval(() => {
      secs--;
      setCountdown(secs);
      if (secs <= 0) clearInterval(interval);
    }, 1000);
  };

  const handleLanjutBayar = () => {
    if (cart.length === 0) return;
    if (!selectedLokasi) {
      alert('Harap pilih lokasi cabang pengambilan terlebih dahulu!');
      return;
    }
    setShowQR(true);
    startTimer();
  };

  const handleConfirmPayment = () => {
    setPaying(true);
    setTimeout(() => {
      const order = createOrder(selectedLokasi);
      localStorage.setItem('kp_last_order', JSON.stringify(order));
      router.push('/status-pesanan');
    }, 1500);
  };

  const fmtTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const typeLabels: Record<string, string> = {
    dokumen: 'Dokumen Resmi', foto: 'High Quality', poster: 'Format Lebar', marketing: 'Marketing',
  };

  if (cart.length === 0 && !showQR) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🛒</div>
        <h2>Keranjang Kosong</h2>
        <p>Belum ada item di keranjang Anda.</p>
        <button className="btn-primary" onClick={() => router.push('/dashboard')}>Kembali ke Dashboard</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* QR Modal */}
      {showQR && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalTop}>
              <div className={styles.modalLabel}>TOTAL PEMBAYARAN</div>
              <div className={styles.modalAmount}>Rp {total.toLocaleString('id-ID')}</div>
              <div className={styles.orderId}>⏱ Order ID: KP-{Math.floor(80000 + Math.random() * 9999)}-LX</div>
            </div>
            <div className={styles.qrBox}>
              <div className={styles.qrisLabel}>
                <span>✦</span> QRIS DINAMIS
              </div>
              {/* QR Code visual */}
              <div className={styles.qrCode}>
                <div className={styles.qrPattern}>
                  {Array.from({ length: 9 }).map((_, r) =>
                    Array.from({ length: 9 }).map((_, c) => (
                      <div key={`${r}-${c}`} className={styles.qrCell}
                        style={{ background: Math.random() > 0.4 ? '#111' : 'white' }}
                      ></div>
                    ))
                  )}
                </div>
                <div className={styles.qrisLogo}>QRIS</div>
              </div>
              <p className={styles.qrInstr}>
                Pindai kode QR di atas menggunakan aplikasi<br />
                pembayaran pilihan Anda (GoPay, OVO, Dana, m-Banking, dll)
              </p>
            </div>
            <div className={styles.timerBadge}>
              <span>⏰</span> Berlaku hingga: {fmtTime(countdown)}
            </div>
            <p className={styles.timerHint}>Lakukan pembayaran sebelum waktu habis</p>
            <div className={styles.modalActions}>
              <button className="btn-primary" style={{ width: '100%' }} onClick={handleConfirmPayment} disabled={paying}>
                {paying ? 'Memproses...' : '✓ Konfirmasi Pembayaran (Demo)'}
              </button>
              <button className={styles.cancelBtn} onClick={() => setShowQR(false)}>✕ Batalkan Pesanan</button>
            </div>
          </div>
        </div>
      )}

      <h1 className={styles.pageTitle}>Ringkasan Pesanan</h1>

      <div className={styles.layout}>
        {/* Items */}
        <div className={styles.items}>
          {cart.map((item) => (
            <div key={item.id} className={styles.itemCard}>
              <div className={styles.itemThumb}>
                <div className={styles.itemThumbInner}>
                  {item.type === 'foto' ? '🖼️' : item.type === 'poster' ? '🗂️' : '📄'}
                </div>
              </div>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{item.filename}</div>
                <div className={styles.itemBadge}>{typeLabels[item.type] || 'Cetak'}</div>
                <div className={styles.itemSpecs}>
                  <span>📋 Binding: {item.finishing}</span>
                  <span>🖨️ Warna: {item.warna === 'berwarna' ? 'Full Color' : 'Hitam Putih'}</span>
                  <span>🗒️ Kertas: {item.jenisKertas}</span>
                  <span>📐 {item.ukuranKertas}</span>
                </div>
                <div className={styles.itemMeta}>
                  👤 {item.nama} &nbsp;|&nbsp; 📞 {item.noTelp}
                </div>
              </div>
              <div className={styles.itemRight}>
                <div className={styles.itemPrice}>Rp {item.harga.toLocaleString('id-ID')}</div>
                <div className={styles.itemQty}>Qty: {item.salinan} salinan</div>
                <div className={styles.itemActions}>
                  <button className={styles.actionLink} onClick={() => router.push(`/konfigurasi/${item.type}`)}>✏ Ubah</button>
                  <button className={styles.actionLink} style={{ color: 'var(--pink)' }} onClick={() => removeFromCart(item.id)}>🗑 Hapus</button>
                </div>
              </div>
            </div>
          ))}

          {/* Add more */}
          <button className={styles.addMore} onClick={() => router.push('/dashboard')}>
            ⊕ Tambah Produk Lain
          </button>
        </div>

        {/* Summary Sidebar */}
        <div className={styles.summary}>
          <div className="card">
            <h3 className={styles.summaryTitle}>Ringkasan Biaya</h3>
            <div className={styles.summaryRow}>
              <span>Subtotal ({cart.reduce((a, c) => a + c.salinan, 0)} item)</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Pajak (PPN 11%)</span>
              <span>Rp {pajak.toLocaleString('id-ID')}</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total Bayar</span>
              <span className={styles.totalVal}>Rp {total.toLocaleString('id-ID')}</span>
            </div>

            <div className={styles.infoBox}>
              <span>ℹ️</span>
              <p>Pesanan akan diproses segera setelah pembayaran dikonfirmasi oleh sistem kami.</p>
            </div>

            <div style={{ marginTop: '16px' }}>
              <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Lokasi Pengambilan</div>
              <select className="input-field" value={selectedLokasi} onChange={e => setSelectedLokasi(e.target.value)}>
                <option value="" disabled>Pilih Lokasi Cabang...</option>
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>

            <button className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '16px' }} onClick={handleLanjutBayar}>
              Lanjutkan ke Pembayaran →
            </button>
            <p className={styles.termsNote}>
              Dengan menekan tombol di atas, Anda menyetujui <a href="#" style={{ color: 'var(--teal)' }}>Syarat & Ketentuan</a> kami.
            </p>
          </div>

          {/* Promo */}
          <div className="card">
            <div className={styles.summaryLabel}>Kode Promo</div>
            <div className={styles.promoRow}>
              <input className="input-field" placeholder="Masukkan kode promo" value={promo} onChange={e => setPromo(e.target.value)} />
              <button className="btn-outline" style={{ whiteSpace: 'nowrap' }}>Terapkan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
