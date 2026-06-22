'use client';
import { useApp } from '@/lib/AppContext';
import styles from './page.module.css';

export default function AdminDashboardPage() {
  const { orders, toggleOrder, removeOrder } = useApp();
  const activeOrders = orders.filter(o => o.status !== 'selesai');
  const printingCount = orders.filter(o => o.status === 'dicetak').length;
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
            <span><span style={{ color: '#3B82F6' }}>●</span> {orders.filter(q => q.status === 'antrian').length} In Queue</span>
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
              {activeOrders.map((o) => {
                const item = o;
                const statusLabel = item.status === 'antrian' ? 'Ready' : item.status === 'paused' ? 'Paused' : item.status === 'dicetak' ? 'Printing...' : 'Completed';
                const progress = item.progress ?? 0;
                const remainingSec = Math.max(0, Math.round(((100 - progress) / 100) * (item.durationSec || 12)));
                const timeLeft = item.status === 'dicetak' ? `${Math.floor(remainingSec / 60)}:${String(remainingSec % 60).padStart(2,'0')}` : item.status === 'antrian' ? '~' : item.status === 'selesai' ? '-' : '—';
                return (
                  <tr key={item.id}>
                    <td className={styles.orderId}>#{item.orderNumber}</td>
                    <td>
                      <div className={styles.fileCell}>
                        <div className={styles.fileIcon}>{item.items[0]?.type === 'Photo Paper Glossy' ? '🖼️' : '📄'}</div>
                        <div>
                          <div className={styles.fileName}>{item.items[0]?.filename || '-'}</div>
                          <div className={styles.fileMeta}>{`${item.items.reduce((a,c)=>a+(c.salinan||0),0)} salinan`}</div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.typeTd}>{item.items[0]?.type || '-'}</td>
                    <td>
                      <div className={styles.progressWrap}>
                        <div className={styles.progressInfo}>
                          <span style={{ color: item.status === 'dicetak' ? '#F59E0B' : '#94A3B8', fontSize: '11px', fontWeight: 600 }}>
                            {statusLabel}&nbsp;
                          </span>
                          <span style={{ fontSize: '11px', color: '#94A3B8' }}>{progress}%</span>
                        </div>
                        <div className={styles.progressTrack}>
                          <div className={styles.progressFill}
                            style={{
                              width: `${progress}%`,
                              background: item.status === 'dicetak' ? '#F59E0B' : '#CBD5E1'
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${item.status === 'dicetak' ? styles.badgePrint : item.status === 'antrian' ? styles.badgeQueue : styles.badgePause}`}>
                        {item.printerId ? `${item.printerId} • ` : ''}{item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className={styles.timeCell}>{timeLeft}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn} onClick={() => toggleOrder(item.id)}>{item.status === 'dicetak' ? '⏸' : '▶'}</button>
                        <button className={styles.actionBtn} onClick={() => removeOrder(item.id)}>✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <span>Showing <strong>{activeOrders.length}</strong> of <strong>{activeOrders.length + 54}</strong> active orders</span>
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
