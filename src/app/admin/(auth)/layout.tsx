import styles from './AdminLayout.module.css';
import Link from 'next/link';

function AdminHeader() {
  return (
    <header className={styles.header}>
      <div className="logo-text" style={{ fontSize: '20px' }}>
        <span className="pink">Klik</span><span className="teal">print</span>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.avatar}>👤</div>
      </div>
    </header>
  );
}

function AdminFooter() {
  return (
    <footer className="site-footer" style={{ padding: '20px 32px' }}>
      <div className="logo-text" style={{ fontSize: '16px' }}>
        <span className="pink">Klik</span><span className="teal">print</span>
      </div>
      <p className="footer-desc" style={{ fontSize: '12px', opacity: 0.7 }}>
        Precision digital printing solutions for business and creative professionals.
      </p>
    </footer>
  );
}

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AdminHeader />
      <main style={{ flex: 1 }}>{children}</main>
      <AdminFooter />
    </div>
  );
}
