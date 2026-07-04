import { FC } from 'react'
import styles from './MetricsSidebar.module.scss'
import { ResponseStats } from '@/features/form-responses/model'

interface MetricsSidebarProps {
  stats: ResponseStats | null
  isExportingCsv: boolean
  isExportingPdf: boolean
  onExportCsv: () => void
  onExportPdf: () => void
}

export const MetricsSidebar: FC<MetricsSidebarProps> = ({
  stats,
  isExportingCsv,
  isExportingPdf,
  onExportCsv,
  onExportPdf,
}) => {
  const hasResponses = !!stats && stats.total > 0
  const exportDisabled = isExportingCsv || isExportingPdf || !hasResponses

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

      <div className={styles.exportGroup}>
        <button
          className={styles.exportBtn}
          onClick={onExportCsv}
          disabled={exportDisabled}
        >
          {isExportingCsv ? 'Exporting…' : 'Export CSV'}
        </button>
        <button
          className={styles.exportBtn}
          onClick={onExportPdf}
          disabled={exportDisabled}
        >
          {isExportingPdf ? 'Exporting…' : 'Export PDF'}
        </button>
      </div>
    </aside>
  )
}
