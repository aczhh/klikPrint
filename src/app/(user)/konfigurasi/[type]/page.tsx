'use client';
import { useState, useRef, useCallback } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter, useParams } from 'next/navigation';
import styles from './page.module.css';

const serviceConfig: Record<string, { label: string; desc: string; accept: string }> = {
  dokumen: { label: 'Dokumen', desc: 'PDF, Word, Laporan, Skripsi', accept: '.pdf,.doc,.docx' },
  foto: { label: 'Foto', desc: 'JPG, PNG - Fine Art Quality', accept: '.jpg,.jpeg,.png' },
  poster: { label: 'Format Lebar / Poster', desc: 'PNG, PDF - Blueprint & Poster Teknis', accept: '.pdf,.png,.jpg' },
  marketing: { label: 'Marketing', desc: 'PDF, AI - Brosur & Kartu Nama', accept: '.pdf,.ai,.png' },
};

const basePrices: Record<string, number> = {
  berwarna: 1500, 'hitam-putih': 500,
};
const paperPrices: Record<string, number> = {
  'HVS 80gr': 0, 'Art Paper 120gr': 500, 'Art Carton 210gr': 800,
};

export default function KonfigurasiPage() {
  const params = useParams();
  const type = (params?.type as string) || 'dokumen';
  const config = serviceConfig[type] || serviceConfig.dokumen;

  const { addToCart, selectedLokasi } = useApp();
  const router = useRouter();

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [nama, setNama] = useState('');
  const [noTelp, setNoTelp] = useState('');
  const [warna, setWarna] = useState('berwarna');
  const [ukuran, setUkuran] = useState('A4 (210 × 297 mm)');
  const [kertas, setKertas] = useState('HVS 80gr');
  const [sisi, setSisi] = useState('Satu Sisi');
  const [finishing, setFinishing] = useState('Tidak Jilid');
  const [salinan, setSalinan] = useState(1);
  const [simulatedPages, setSimulatedPages] = useState(1); // Default 1
  const [fileError, setFileError] = useState('');

  const hargaPerHal = basePrices[warna] || 1500;
  const hargaKertas = paperPrices[kertas] || 0;
  const subtotal = (hargaPerHal * simulatedPages + hargaKertas) * salinan;

  const handleFileDrop = useCallback((f: File) => {
    setFileError('');
    // Check extension
    const ext = f.name.slice(f.name.lastIndexOf('.')).toLowerCase();
    const accepts = config.accept.split(',');
    if (!accepts.includes(ext) && !config.accept.includes(ext)) {
      setFileError(`Format file tidak didukung untuk ${config.label}. Harap gunakan: ${config.accept}`);
      return;
    }

    setFile(f);
    
    // Dynamic page count based on file size for mockup purposes
    // e.g. 1 MB roughly ~5 pages
    const mbSize = f.size / 1024 / 1024;
    const estPages = Math.max(1, Math.round(mbSize * 5));
    setSimulatedPages(f.type.startsWith('image/') ? 1 : estPages);

    if (f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f);
      setFilePreview(url);
    } else {
      setFilePreview('pdf');
    }
  }, [config]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileDrop(f);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFileDrop(f);
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and plus sign
    const val = e.target.value.replace(/[^\d+]/g, '');
    setNoTelp(val);
  };

  const canSubmit = file && nama.trim().length >= 3 && noTelp.trim().length >= 10 && !fileError;

  const handleAddToCart = () => {
    if (!canSubmit) return;
    addToCart({
      id: Date.now().toString(),
      type,
      filename: file!.name,
      nama: nama.trim(),
      noTelp: noTelp.trim(),
      warna, ukuranKertas: ukuran, jenisKertas: kertas,
      sisi, finishing, salinan, harga: subtotal,
    });
    router.push('/ringkasan');
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button onClick={() => router.back()} className={styles.backBtn}>‹ Kembali</button>
        <div>
          <h1 className={styles.title}>Konfigurasi Pesanan {config.label}</h1>
          <p className={styles.subtitle}>Sesuaikan detail pencetakan untuk {config.desc.toLowerCase()}</p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* LEFT: Upload + Preview */}
        <div className={styles.leftCol}>
          {/* Upload Zone */}
          {!file ? (
            <div
              className={`${styles.uploadZone} ${dragging ? styles.dragging : ''}`}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.uploadIcon}>☁️</div>
              <h3 className={styles.uploadTitle}>Unggah {config.label}</h3>
              <p className={styles.uploadDesc}>
                Seret dan lepas file {config.desc} di sini,<br />atau klik untuk memilih dari komputer Anda.
              </p>
              <button type="button" className="btn-primary" style={{ marginTop: '16px' }}>
                + Pilih File
              </button>
              <input ref={fileInputRef} type="file" accept={config.accept} style={{ display: 'none' }} onChange={onFileSelect} />
              {fileError && <div style={{ color: '#EF4444', marginTop: '12px', fontSize: '14px', fontWeight: 500 }}>{fileError}</div>}
            </div>
          ) : (
            <>
              <div className={styles.previewCard}>
                <div className={styles.previewHeader}>
                  <span className={styles.previewFilename}>
                    📄 {file.name}
                    <span className={styles.fileSize}>{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                  </span>
                  <div className={styles.previewActions}>
                    <button onClick={() => { setFile(null); setFilePreview(null); }} className={styles.removeBtn}>✕ Ganti File</button>
                  </div>
                </div>
                <div className={styles.previewBody}>
                  {filePreview && filePreview !== 'pdf' ? (
                    <img src={filePreview} alt="preview" className={styles.imagePreview} />
                  ) : (
                    <div className={styles.pdfPreview}>
                      <div className={styles.pdfMockPages}>
                        <div className={styles.pdfPage}>
                          <div className={styles.pdfLine}></div>
                          <div className={styles.pdfLine} style={{ width: '70%' }}></div>
                          <div className={styles.pdfLine} style={{ width: '85%' }}></div>
                          <div className={styles.pdfLine} style={{ width: '60%' }}></div>
                          <div className={styles.pdfLine}></div>
                          <div className={styles.pdfLine} style={{ width: '90%' }}></div>
                        </div>
                        <div className={`${styles.pdfPage} ${styles.pdfPageBg}`}></div>
                      </div>
                      <p className={styles.pdfName}>📄 {file.name}</p>
                      <p className={styles.pdfMeta}>{simulatedPages} halaman terdeteksi</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Config + Summary */}
        <div className={styles.rightCol}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 className={styles.configTitle}>Pengaturan Cetak</h2>

            {/* Data Diri */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>Data Diri</div>
              <input className="input-field" placeholder="Masukkan nama (min 3 huruf).." value={nama} onChange={e => setNama(e.target.value)} />
              <input type="tel" className="input-field" placeholder="Masukkan nomor telp (min 10 digit).." value={noTelp} onChange={handlePhoneInput} style={{ marginTop: '10px' }} />
            </div>

            {/* Warna */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>Warna Cetak</div>
              <div className={styles.toggleGroup}>
                {['berwarna', 'hitam-putih'].map(v => (
                  <button key={v} className={`${styles.toggleBtn} ${warna === v ? styles.toggleActive : ''}`} onClick={() => setWarna(v)}>
                    {v === 'berwarna' ? '🎨 Berwarna' : '⚫ Hitam Putih'}
                  </button>
                ))}
              </div>
            </div>

            {/* Ukuran Kertas */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>Ukuran Kertas</div>
              <select className="input-field" value={ukuran} onChange={e => setUkuran(e.target.value)}>
                <option>A4 (210 × 297 mm)</option>
                <option>A3 (297 × 420 mm)</option>
                <option>F4 (215 × 330 mm)</option>
                <option>Legal (216 × 356 mm)</option>
              </select>
            </div>

            {/* Jenis Kertas */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>Jenis Kertas</div>
              <select className="input-field" value={kertas} onChange={e => setKertas(e.target.value)}>
                <option>HVS 80gr</option>
                <option>Art Paper 120gr</option>
                <option>Art Carton 210gr</option>
                <option>HVS 100gr</option>
              </select>
            </div>

            {/* Sisi */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>Sisi Cetak</div>
              <div className={styles.toggleGroup}>
                {['Satu Sisi', 'Bolak Balik'].map(v => (
                  <button key={v} className={`${styles.toggleBtn} ${sisi === v ? styles.toggleActive : ''}`} onClick={() => setSisi(v)}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Finishing */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>FINISHING</div>
              <div className={styles.toggleGroup}>
                {['Jilid', 'Tidak Jilid'].map(v => (
                  <button key={v} className={`${styles.toggleBtn} ${finishing === v ? styles.toggleActive : ''}`} onClick={() => setFinishing(v)}>
                    <span style={{ marginRight: 6 }}>{finishing === v ? '◉' : '◯'}</span>{v}
                  </button>
                ))}
              </div>
            </div>

            {/* Jumlah */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>Jumlah Salinan</div>
              <div className={styles.qtyRow}>
                <button className={styles.qtyBtn} onClick={() => setSalinan(Math.max(1, salinan - 1))}>−</button>
                <span className={styles.qtyVal}>{salinan}</span>
                <button className={styles.qtyBtn} onClick={() => setSalinan(salinan + 1)}>+</button>
                <span className={styles.qtyUnit}>Set</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryTitle}>Ringkasan Pesanan</div>
            <div className={styles.summaryRow}>
              <span>Subtotal ({simulatedPages} hal × {salinan} salinan)</span>
              <span>Rp {(hargaPerHal * simulatedPages * salinan).toLocaleString('id-ID')}</span>
            </div>
            {hargaKertas > 0 && (
              <div className={styles.summaryRow}>
                <span>Biaya Kertas ({kertas})</span>
                <span>+ Rp {(hargaKertas * salinan).toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className={styles.summaryTotal}>
              <span>Total Estimasi</span>
              <span className={styles.totalAmount}>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <button
              className="btn-primary"
              style={{ width: '100%', padding: '14px', marginTop: '16px', fontSize: '15px' }}
              onClick={handleAddToCart}
              disabled={!canSubmit}
            >
              Masukkan ke Keranjang →
            </button>
            {!canSubmit && (
              <p className={styles.validationHint}>
                {!file ? '⚠ Unggah file terlebih dahulu' : 
                 nama.trim().length < 3 ? '⚠ Nama minimal 3 karakter' :
                 noTelp.trim().length < 10 ? '⚠ Nomor telepon minimal 10 digit' : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
