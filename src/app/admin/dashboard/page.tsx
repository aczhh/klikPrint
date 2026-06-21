'use client';
import { useApp } from '@/lib/AppContext';
import styles from './page.module.css';

const mockExtra = [
  { id: '#KP-88225', filename: 'Photo_Portfolio.pdf', pages: '42.8 MB • 24 Halaman', type: 'Photo Paper Glossy', progress: 92, status: 'PRINTING', time: '00:45' },
  { id: '#KP-88219', filename: 'Annual_Report_2023.pdf', pages: '14.2 MB • 42 Halaman', type: 'Document (Color)', progress: 68, status: 'PRINTING', time: '04:12' },
  { id: '#KP-88220', filename: 'Event_Poster_A1.png', pages: '85.4 MB • 1 Sheet', type: 'Large Format Poster', progress: 0, status: 'IN QUEUE', time: '~12:00' },
  { id: '#KP-88215', filename: 'Manuscript_V2.docx', pages: '2.1 MB • 120 Halaman', type: 'Booklet Print', progress: 15, status: 'PAUSED', time: 'Stalled' },
];

export default function AdminDashboardPage() {
  const { orders } = useApp();
  const activeOrders = orders.filter(o => o.status !== 'selesai');
  const queueData = [
    ...activeOrders.map(o => ({
      id: `#${o.orderNumber}`, filename: o.items[0]?.filename || '-',
      pages: `${o.items.reduce((a, c) => a + c.salinan, 0)} salinan`,
      type: o.items[0]?.type || '-',
      progress: 0, status: 'IN QUEUE', time: `${o.waktuBayar}`,
    })),
    ...mockExtra,
  ];

  const printingCount = queueData.filter(q => q.status === 'PRINTING').length;
  const totalToday = 412 + activeOrders.length;

  return (
    <div className={styles.container}>
      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={styles.statIcon} style={{ background: '#EFF6FF', color: '#3B82F6' }}>📊</div>
            <span className={styles.trend} style={{ color: '#10B981' }}>+12% vs yesterday</span>
          </div>
          <div className={styles.statLabel}>TOTAL ORDERS</div>
          <div className={styles.statVal}>1,{284 + activeOrders.length}</div>
          <div className={styles.statSub}>Cumulative count for month</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={styles.statIcon} style={{ background: '#FFFBEB', color: '#F59E0B' }}>🖨️</div>
            <span className={styles.trend} style={{ color: '#F59E0B' }}>● ACTIVE</span>
          </div>
          <div className={styles.statLabel}>CURRENTLY PRINTING</div>
          <div className={styles.statVal}>{printingCount + 18}</div>
          <div className={styles.statSub}>6 printers operational</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={styles.statIcon} style={{ background: '#ECFDF5', color: '#10B981' }}>✅</div>
            <div className={styles.progressBar}><div style={{ width: '85%', height: '100%', background: '#10B981', borderRadius: '4px' }}></div></div>
          </div>
          <div className={styles.statLabel}>COMPLETED TODAY</div>
          <div className={styles.statVal}>{totalToday}</div>
          <div className={styles.statSub}>85% of daily target reached</div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <span>🔍</span>
          <input type="text" placeholder="Search by Order ID or Filename..." className={styles.searchInput} />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-outline">≡ Filter</button>
          <button className="btn-outline">↕ Sort</button>
        </div>
      </div>

      {/* Queue Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Active Print Queue</h3>
          <div className={styles.legend}>
            <span><span style={{ color: '#F59E0B' }}>●</span> {printingCount + 18} Printing</span>
            <span><span style={{ color: '#3B82F6' }}>●</span> {queueData.filter(q => q.status === 'IN QUEUE').length} In Queue</span>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>FILENAME</th>
                <th>SERVICE TYPE</th>
                <th>PROGRESS</th>
                <th>STATUS</th>
                <th>TIME LEFT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {queueData.map((item, i) => (
                <tr key={i}>
                  <td className={styles.orderId}>{item.id}</td>
                  <td>
                    <div className={styles.fileCell}>
                      <div className={styles.fileIcon}>{item.type === 'Photo Paper Glossy' ? '🖼️' : '📄'}</div>
                      <div>
                        <div className={styles.fileName}>{item.filename}</div>
                        <div className={styles.fileMeta}>{item.pages}</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.typeTd}>{item.type}</td>
                  <td>
                    <div className={styles.progressWrap}>
                      <div className={styles.progressInfo}>
                        <span style={{ color: item.status === 'PRINTING' ? '#F59E0B' : '#94A3B8', fontSize: '11px', fontWeight: 600 }}>
                          {item.status === 'IN QUEUE' ? 'Ready' : item.status === 'PAUSED' ? 'Paused' : 'Printing...'}&nbsp;
                        </span>
                        <span style={{ fontSize: '11px', color: '#94A3B8' }}>{item.progress}%</span>
                      </div>
                      <div className={styles.progressTrack}>
                        <div className={styles.progressFill}
                          style={{
                            width: `${item.progress}%`,
                            background: item.status === 'PRINTING' ? '#F59E0B' : '#CBD5E1'
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${item.status === 'PRINTING' ? styles.badgePrint : item.status === 'IN QUEUE' ? styles.badgeQueue : styles.badgePause}`}>
                      ● {item.status}
                    </span>
                  </td>
                  <td className={styles.timeCell}>{item.time}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn}>{item.status === 'PRINTING' ? '⏸' : '▶'}</button>
                      <button className={styles.actionBtn}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <span>Showing <strong>{queueData.length}</strong> of <strong>{queueData.length + 54}</strong> active orders</span>
          <div className={styles.pages}>
            <button className={styles.pageBtn}>‹</button>
            <button className={`${styles.pageBtn} ${styles.pageActive}`}>1</button>
            <button className={styles.pageBtn}>2</button>
            <button className={styles.pageBtn}>3</button>
            <button className={styles.pageBtn}>›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
