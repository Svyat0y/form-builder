import { FC } from 'react'
import styles from './MetricsSidebar.module.scss'
import { ResponseStats } from '@/features/form-responses/model'

interface MetricsSidebarProps {
  stats: ResponseStats | null
  isExporting: boolean
  onExportCsv: () => void
}

export const MetricsSidebar: FC<MetricsSidebarProps> = ({
  stats,
  isExporting,
  onExportCsv,
}) => {
  return (
    <aside className={styles.wrapper}>
      <div className={styles.metric}>
        <span className={styles.label}>Total</span>
        <span className={styles.value}>{stats?.total ?? 0}</span>
      </div>
      <div className={styles.metric}>
        <span className={styles.label}>Today</span>
        <span className={styles.value}>{stats?.today ?? 0}</span>
      </div>
      <div className={styles.metric}>
        <span className={styles.label}>Completion</span>
        <span className={styles.value}>
          {stats ? Math.round(stats.completionRate * 100) : 0}%
        </span>
      </div>

      <button
        className={styles.exportBtn}
        onClick={onExportCsv}
        disabled={isExporting || !stats || stats.total === 0}
      >
        {isExporting ? 'Exporting…' : 'Export CSV'}
      </button>
    </aside>
  )
}
