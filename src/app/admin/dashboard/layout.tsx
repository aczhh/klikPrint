'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import styles from './DashboardLayout.module.css';

const navItems = [
  { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/admin/dashboard/shop', icon: '🏪', label: 'Shop Management' },
  { href: '/admin/dashboard/history', icon: '⏱️', label: 'History' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { currentAdmin, setCurrentAdmin } = useApp();

  const handleLogout = () => {
    setCurrentAdmin(null);
    router.push('/admin/login');
  };

  return (
    <div className={styles.wrapper}>
      {/* Top Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)} title="Toggle Sidebar">
            {collapsed ? '▶▶' : '◀◀'}
          </button>
          <div className="logo-text" style={{ fontSize: '20px' }}>
            <span className="pink">Klik</span><span className="teal">print</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.adminBadge}>
            <div className={styles.avatar}>👤</div>
            {!collapsed && (
              <span className={styles.adminName}>{currentAdmin?.fullName || 'Admin'}</span>
            )}
          </div>
        </div>
      </header>

      <div className={styles.body}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
          <div className={styles.sidebarUser}>
            {!collapsed && (
              <>
                <div className={styles.sidebarAdminName}>{currentAdmin?.fullName || 'Admin'}</div>
                <div className={styles.sidebarBranch}>{currentAdmin?.lokasi || 'Main Branch'}</div>
              </>
            )}
          </div>

          <nav className={styles.nav}>
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${pathname === item.href ? styles.navActive : ''}`}
                title={collapsed ? item.label : ''}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
              </Link>
            ))}
          </nav>

          <div className={styles.sidebarFooter}>
            <button onClick={handleLogout} className={styles.logoutBtn} title={collapsed ? 'Logout' : ''}>
              <span className={styles.navIcon}>🚪</span>
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="site-footer" style={{ padding: '16px 32px' }}>
        <div>
          <div className="logo-text" style={{ fontSize: '15px' }}>
            <span className="pink">Klik</span><span className="teal">print</span>
          </div>
          <p className="footer-desc" style={{ fontSize: '12px' }}>Precision digital printing solutions for business and creative professionals.</p>
        </div>
        <div>
          <div className="footer-links" style={{ gap: '16px' }}>
            <a href="#">Privacy Policy</a><a href="#">Terms of Service</a>
            <a href="#">Shipping Info</a><a href="#">Contact Support</a>
          </div>
          <p className="footer-copyright">© 2024 Klikprint Professional Printing Service. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
