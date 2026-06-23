'use client';
import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/page.module.css';

export default function AdminRegisterPage() {
  const { registerAdmin, setCurrentAdmin } = useApp();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError('Anda harus menyetujui Terms of Service.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => {
      const success = registerAdmin({ fullName, email, lokasi, whatsapp, password });
      if (success) {
        // Auto login
        const admin = { id: Date.now().toString(), fullName, email, lokasi, whatsapp, password };
        setCurrentAdmin(admin);
        router.push('/admin/dashboard');
      } else {
        setError('Email sudah terdaftar. Silakan login.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {/* Left */}
        <div className={styles.imageSide}>
          <div className={styles.imageContent}>
            <h1 className={styles.imageTitle}>Precision in Every Pixel.</h1>
            <p className={styles.imageDesc}>
              Join the engineering-first printing platform. From industrial CAD plots to high-fidelity marketing collateral, we handle every detail with absolute accuracy.
            </p>
            <div className={styles.badges}>
              <span className={styles.badge}>✓ ISO 9001 Certified</span>
              <span className={styles.badge}>✓ CMYK Precision</span>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className={styles.formSide}>
          <Link href="/admin/login" className={styles.backLink}>‹</Link>
          <h2 className={styles.formTitle}>Create your account</h2>
          <p className={styles.formSub}>Start your next high-precision project today.</p>

          <form onSubmit={handleCreate} className={styles.form}>
            <div className={styles.formGroup}>
              <label className="label">Full Name</label>
              <input className="input-field" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label className="label">Email Address</label>
              <input className="input-field" type="email" placeholder="john@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label className="label">Location</label>
              <input className="input-field" placeholder="Contoh: GKB III Kantek" value={lokasi} onChange={e => setLokasi(e.target.value)} required />
              <small style={{ color: 'var(--text-light)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                Nama lokasi ini akan tampil di pilihan user saat memesan.
              </small>
            </div>
            <div className={styles.formGroup}>
              <label className="label">WhatsApp Number</label>
              <input className="input-field" placeholder="+62 812 3456 7890" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input-field" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', fontSize: '16px' }}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.remember}>
              <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
              <label htmlFor="agree">I agree to the <a href="#" style={{ color: 'var(--pink)' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--pink)' }}>Privacy Policy</a>.</label>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loading}>
              {loading ? 'Creating...' : 'Create Account →'}
            </button>
          </form>

          <p className={styles.signupText}>Already have an account? <Link href="/admin/login" className={styles.signupLink}>Log in</Link></p>
        </div>
      </div>
    </div>
  );
}
