'use client';
import { useApp } from '@/lib/AppContext';
import styles from './page.module.css';

export default function AdminDashboardPage() {
  const { orders, toggleItemStatus, deleteItem, currentAdmin } = useApp();
  const myLokasi = currentAdmin?.lokasi || '';
  const activeOrders = orders.filter(o => o.status !== 'selesai' && o.lokasi === myLokasi);
  const recentlyDone = orders
    .filter(o => o.status === 'selesai' && o.lokasi === myLokasi)
    .slice(0, 5);
  const queueData = activeOrders.flatMap(o => 
    o.items.map((item, idx) => ({
      id: item.id,
      displayId: `#${o.orderNumber}-${idx + 1}`,
      orderId: o.id,
      filename: item.filename || '-',
      pages: `${item.salinan} salinan`,
      type: item.type || '-',
      progress: item.progress || 0,
      status: item.status === 'dicetak' ? 'PRINTING' : item.status === 'selesai' ? 'COMPLETED' : item.status === 'paused' ? 'PAUSED' : 'IN QUEUE',
      time: `${o.waktuBayar}`,
    }))
  ).filter(q => q.status !== 'COMPLETED');

  const printingCount = queueData.filter(q => q.status === 'PRINTING').length;
  const completedCount = orders.filter(o => o.status === 'selesai' && o.lokasi === myLokasi).length;
  const totalOrdersLokasi = orders.filter(o => o.lokasi === myLokasi).length;
  const totalToday = completedCount;

  return (
    <div className={styles.container}>
      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={styles.statIcon} style={{ background: '#EFF6FF', color: '#3B82F6' }}>📊</div>
            <span className={styles.trend} style={{ color: '#10B981' }}>New Orders</span>
          </div>
          <div className={styles.statLabel}>TOTAL ORDERS</div>
          <div className={styles.statVal}>{totalOrdersLokasi}</div>
          <div className={styles.statSub}>{myLokasi || 'Lokasi belum dipilih'}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={styles.statIcon} style={{ background: '#FFFBEB', color: '#F59E0B' }}>🖨️</div>
            <span className={styles.trend} style={{ color: '#F59E0B' }}>● ACTIVE</span>
          </div>
          <div className={styles.statLabel}>CURRENTLY PRINTING</div>
          <div className={styles.statVal}>{printingCount}</div>
          <div className={styles.statSub}>3 printers operational</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={styles.statIcon} style={{ background: '#ECFDF5', color: '#10B981' }}>✅</div>
            <div className={styles.progressBar}><div style={{ width: totalToday > 0 ? '100%' : '0%', height: '100%', background: '#10B981', borderRadius: '4px' }}></div></div>
          </div>
          <div className={styles.statLabel}>COMPLETED TODAY</div>
          <div className={styles.statVal}>{totalToday}</div>
          <div className={styles.statSub}>Orders finished today</div>
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
            <span><span style={{ color: '#F59E0B' }}>●</span> {printingCount} Printing</span>
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
              {queueData.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>No active orders</td>
                </tr>
              )}
              {queueData.map((item, i) => (
                <tr key={i}>
                  <td className={styles.orderId}>{item.displayId}</td>
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
                      <button className={styles.actionBtn} onClick={() => toggleItemStatus(item.orderId, item.id)}>
                        {item.status === 'PRINTING' ? '⏸' : '▶'}
                      </button>
                      <button className={styles.actionBtn} onClick={() => deleteItem(item.orderId, item.id)}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <span>Showing <strong>{queueData.length}</strong> of <strong>{queueData.length}</strong> active orders</span>
          <div className={styles.pages}>
            <button className={styles.pageBtn}>‹</button>
            <button className={`${styles.pageBtn} ${styles.pageActive}`}>1</button>
            <button className={styles.pageBtn}>›</button>
          </div>
        </div>
      </div>

      {/* Recently Completed */}
      {recentlyDone.length > 0 && (
        <div className={styles.recentCard}>
          <div className={styles.recentHeader}>
            <div className={styles.recentTitle}>
              <span className={styles.recentDot}></span>
              Baru Selesai
            </div>
            <a href="/admin/dashboard/history" className={styles.recentLink}>Lihat Semua Riwayat →</a>
          </div>
          <div className={styles.recentList}>
            {recentlyDone.map((order, i) => (
              <div key={i} className={styles.recentRow}>
                <div className={styles.recentIcon}>✅</div>
                <div className={styles.recentInfo}>
                  <div className={styles.recentFile}>{order.items[0]?.filename || '-'}</div>
                  <div className={styles.recentMeta}>#{order.orderNumber}  ·  {order.items[0]?.nama || '-'}  ·  {order.lokasi}</div>
                </div>
                <div className={styles.recentRight}>
                  <span className={styles.doneBadge}>✓ Selesai</span>
                  <div className={styles.recentTime}>{order.waktuBayar}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
