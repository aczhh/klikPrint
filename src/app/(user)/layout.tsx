import styles from './UserLayout.module.css';
import Link from 'next/link';

function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className="logo-text">
          <span className="pink">Klik</span><span className="teal">print</span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/#workflow" className={styles.navLink}>Workflow</Link>
          <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
          <Link href="#" className={styles.navLink}>Help</Link>
        </nav>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>👤</div>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <div className="logo-text"><span className="pink">Klik</span><span className="teal">print</span></div>
        <p className="footer-desc">Precision digital printing solutions for business<br />and creative professionals.</p>
      </div>
      <div>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Shipping Info</a>
          <a href="#">Contact Support</a>
        </div>
        <p className="footer-copyright">© 2024 Klikprint Professional Printing Service. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrap}>
      <SiteHeader />
      <main className={styles.main}>{children}</main>
      <SiteFooter />
    </div>
  );
}
