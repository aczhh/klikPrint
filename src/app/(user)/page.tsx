import Link from 'next/link';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <div className={styles.pageRoot}>
      <Link href="/admin/login" className={styles.adminLoginBtn}>Admin Login</Link>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>SOLUSI CETAK DIGITAL</p>
          <h1 className={styles.heroTitle}>Presisi Digital dalam<br />Setiap Cetakan.</h1>
          <p className={styles.heroSubtitle}>
            Solusi pencetakan kelas industri untuk dokumen, fotografi, dan material teknik dengan akurasi warna yang tak tertandingi.
          </p>
          <Link href="/dashboard" className="btn-primary" style={{ fontSize: '16px', padding: '14px 36px', borderRadius: '10px' }}>
            Cetak Sekarang →
          </Link>
        </div>
        <div className={styles.heroImageWrap}>
          <div className={styles.heroImageCard}>
            <div className={styles.heroPrinterVisual}>
              <div className={styles.printerArm}></div>
              <div className={styles.printerBase}></div>
              <div className={styles.printerInk}></div>
              <div className={styles.glowEffect}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className={styles.workflow} id="workflow">
        <div className={styles.workflowInner}>
          <p className={styles.sectionLabel}>WORKFLOW</p>
          <h2 className={styles.sectionTitle}>Alur Pemesanan</h2>
          <p className={styles.sectionDesc}>Dari upload hingga cetak, semua mudah dan otomatis.</p>

          <div className={styles.steps}>
            {[
              { icon: '📄', num: '01', title: 'Unggah File', desc: 'Unggah dokumen atau foto Anda dalam format PDF, JPG, atau CAD dengan sistem enkripsi aman.' },
              { icon: '⚙️', num: '02', title: 'Konfigurasi', desc: 'Pilih jenis kertas, gramatur, laminasi, dan finishing sesuai standar industri yang Anda butuhkan.' },
              { icon: '💳', num: '03', title: 'Bayar via QRIS', desc: 'Selesaikan pembayaran dengan QRIS. Sistem otomatis mengirim file ke printer yang Anda pilih.' },
              { icon: '🎉', num: '04', title: 'Ambil Pesanan', desc: 'Pesanan dikemas secara protektif dan siap diambil sesuai estimasi waktu yang tertera.' },
            ].map((step) => (
              <div key={step.num} className={styles.step}>
                <div className={styles.stepNum}>{step.num}</div>
                <div className={styles.stepIconBox}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Siap untuk mencetak?</h2>
          <p className={styles.ctaDesc}>Pilih lokasi tempat print terdekat dan mulai pesanan Anda sekarang.</p>
          <Link href="/dashboard" className="btn-primary" style={{ padding: '14px 40px', fontSize: '16px' }}>
            Mulai Cetak Sekarang →
          </Link>
        </div>
      </section>
    </div>
  );
}
