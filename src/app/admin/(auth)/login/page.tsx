'use client';
import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function AdminLoginPage() {
  const { loginAdmin, setCurrentAdmin } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const admin = loginAdmin(email, password);
      if (admin) {
        setCurrentAdmin(admin);
        router.push('/admin/dashboard');
      } else {
        setError('Email atau password salah. Coba: admin@kantek.com / admin123');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {/* Left Image Side */}
        <div className={styles.imageSide}>
          <div className={styles.imageContent}>
            <h1 className={styles.imageTitle}>Mastering Every Pixel.</h1>
            <p className={styles.imageDesc}>
              Access the industry's most advanced precision printing console. Manage orders, monitor workflows, and oversee outcomes with unfailing quality.
            </p>
            <div className={styles.badges}>
              <span className={styles.badge}>✓ CERTIFIED ENGINEERING EXCELLENCE</span>
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className={styles.formSide}>
          <Link href="/admin/login" className={styles.backLink}>‹</Link>
          <h2 className={styles.formTitle}>Client Login</h2>
          <p className={styles.formSub}>Welcome back. Please enter your credentials to access your console.</p>

          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.formGroup}>
              <label className="label">Work Email Address</label>
              <input className="input-field" type="email" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <div className={styles.labelRow}>
                <label className="label">Password</label>
                <a href="#" className={styles.forgot}>Forgot Password?</a>
              </div>
              <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.remember}>
              <input type="checkbox" id="rem" /> <label htmlFor="rem">Remember me</label>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loading}>
              {loading ? 'Masuk...' : 'Login to Dashboard'}
            </button>
          </form>

          <div className={styles.divider}><span>OR CONTINUE WITH SSO</span></div>
          <div className={styles.ssoRow}>
            <button className={styles.ssoBtn}><span style={{ color: '#4285F4', fontWeight: 900 }}>G</span> Google</button>
            <button className={styles.ssoBtn}><span>🍎</span> Apple</button>
          </div>
          <p className={styles.signupText}>Don't have an account yet? <Link href="/admin/register" className={styles.signupLink}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
