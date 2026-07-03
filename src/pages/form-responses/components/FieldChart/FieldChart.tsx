import { FC, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import styles from './FieldChart.module.scss'
import { FieldStats } from '@/features/form-responses/model'
import { FormField } from '@/features/forms/model'

interface FieldChartProps {
  field: FormField
  stats: FieldStats
}

const CHART_COLORS = [
  'hsl(210, 98%, 48%)',
  'hsl(280, 70%, 55%)',
  'hsl(150, 60%, 40%)',
  'hsl(35, 90%, 50%)',
  'hsl(0, 72%, 55%)',
  'hsl(190, 80%, 42%)',
  'hsl(330, 70%, 55%)',
]

const distributionToChartData = (distribution: Record<string, number>) =>
  Object.entries(distribution).map(([name, value]) => ({ name, value }))

// One field's visualization on the responses page — pie/bar toggle for
// choice fields, a distribution bar for rating/scale, a plain list for free
// text. Only rendered for fields the stats endpoint returned (trackStats
// choice fields + text/textarea), see docs/pages/form-editor.md.
export const FieldChart: FC<FieldChartProps> = ({ field, stats }) => {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie')

  if (stats.type === 'text' || stats.type === 'textarea') {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>{field.label}</h3>
        </div>
        {stats.latest && stats.latest.length > 0 ? (
          <ul className={styles.latestList}>
            {stats.latest.map((answer, i) => (
              <li key={i} className={styles.latestItem}>
                {answer}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>No answers yet.</p>
        )}
      </div>
    )
  }

  const distribution = stats.distribution || {}
  const isEmpty = Object.keys(distribution).length === 0

  if (stats.type === 'rating' || stats.type === 'scale') {
    const data = distributionToChartData(distribution).sort(
      (a, b) => Number(a.name) - Number(b.name),
    )
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>{field.label}</h3>
          {stats.average !== undefined && (
            <span className={styles.average}>
              avg {stats.average.toFixed(1)}
            </span>
          )}
        </div>
        {isEmpty ? (
          <p className={styles.empty}>No answers yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                stroke="var(--text-color-secondary)"
                fontSize={12}
              />
              <YAxis
                allowDecimals={false}
                stroke="var(--text-color-secondary)"
                fontSize={12}
              />
              <Tooltip />
              <Bar dataKey="value" fill={CHART_COLORS[0]} radius={4} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    )
  }

  if (stats.type === 'checkbox') {
    const data = distributionToChartData(distribution)
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>{field.label}</h3>
        </div>
        {isEmpty ? (
          <p className={styles.empty}>No answers yet.</p>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={Math.max(data.length * 40, 120)}
          >
            <BarChart data={data} layout="vertical">
              <XAxis type="number" allowDecimals={false} hide />
              <YAxis
                dataKey="name"
                type="category"
                width={140}
                stroke="var(--text-color-secondary)"
                fontSize={12}
              />
              <Tooltip />
              <Bar dataKey="value" fill={CHART_COLORS[0]} radius={4} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    )
  }

  // radio / select — pie or bar, owner's choice.
  const data = distributionToChartData(distribution)
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{field.label}</h3>
        <div className={styles.toggle}>
          <button
            className={chartType === 'pie' ? styles.toggleActive : ''}
            onClick={() => setChartType('pie')}
          >
            Pie
          </button>
          <button
            className={chartType === 'bar' ? styles.toggleActive : ''}
            onClick={() => setChartType('bar')}
          >
            Bar
          </button>
        </div>
      </div>
      {isEmpty ? (
        <p className={styles.empty}>No answers yet.</p>
      ) : chartType === 'pie' ? (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
            >
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="var(--text-color-secondary)"
              fontSize={12}
            />
            <YAxis
              allowDecimals={false}
              stroke="var(--text-color-secondary)"
              fontSize={12}
            />
            <Tooltip />
            <Bar dataKey="value" fill={CHART_COLORS[0]} radius={4} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
