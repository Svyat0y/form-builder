import { FC, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PieSectorDataItem } from 'recharts/types/polar/Pie'
import type { BarShapeProps } from 'recharts/types/cartesian/Bar'
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

const HOVER_SCALE = 1.06

const distributionToChartData = (distribution: Record<string, number>) =>
  Object.entries(distribution).map(([name, value]) => ({ name, value }))

// Rendered only for the currently-hovered bar (recharts' `activeBar`) —
// grows it a few percent from its own center instead of the default
// full-track gray highlight box. See responses page review notes (point 2).
// recharts' `ActiveShape` type expects a `Partial<BarShapeProps>` element
// (it clones in the real values at render time), so every prop here is
// optional even though they're always present in practice.
const ActiveBar: FC<Partial<BarShapeProps>> = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  fill,
}) => {
  const scaledWidth = width * HOVER_SCALE
  const scaledHeight = height * HOVER_SCALE
  return (
    <rect
      x={x - (scaledWidth - width) / 2}
      y={y - (scaledHeight - height) / 2}
      width={scaledWidth}
      height={scaledHeight}
      fill={fill}
      rx={4}
    />
  )
}

// Pie active-shape: same idea as ActiveBar, just a slightly larger sector,
// no separate highlight layer.
const renderActivePieSlice = (props: PieSectorDataItem) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={(outerRadius ?? 0) + 6}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      style={{ transition: 'all 0.12s ease' }}
    />
  )
}

interface ChartTooltipPayloadEntry {
  payload: { name: string; value: number }
}

// recharts' default Tooltip auto-sizes per chart in an inconsistent way
// (extra empty space on some charts, cramped on others) — one fixed-padding
// bubble standardizes it across every chart on the page.
const ChartTooltip: FC<{
  active?: boolean
  payload?: ChartTooltipPayloadEntry[]
}> = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  return (
    <div className={styles.chartTooltip}>
      <span className={styles.chartTooltipName}>{name}</span>
      <span className={styles.chartTooltipValue}>{value}</span>
    </div>
  )
}

// One field's visualization on the responses page — pie/bar toggle for
// radio/select, a horizontal bar for checkbox, a distribution bar +
// average for rating/scale. Only rendered for choice-type fields with
// trackStats on, see docs/pages/form-editor.md §5.1.
export const FieldChart: FC<FieldChartProps> = ({ field, stats }) => {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie')

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
          <div data-pdf-chart-id={field.id}>
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
                <Tooltip cursor={false} content={<ChartTooltip />} />
                <Bar
                  dataKey="value"
                  fill={CHART_COLORS[0]}
                  activeBar={<ActiveBar />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
          <div data-pdf-chart-id={field.id}>
            <ResponsiveContainer
              width="100%"
              height={Math.max(data.length * 40, 120)}
            >
              <BarChart data={data} layout="vertical" margin={{ right: 24 }}>
                <XAxis type="number" allowDecimals={false} hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  stroke="var(--text-color-secondary)"
                  fontSize={12}
                />
                <Tooltip cursor={false} content={<ChartTooltip />} />
                <Bar
                  dataKey="value"
                  fill={CHART_COLORS[0]}
                  activeBar={<ActiveBar />}
                >
                  {/* Unlike the vertical bar/pie charts, checkbox has no
                      other summary text (no avg, no legend) — without a
                      count somewhere it's unreadable in the static PDF,
                      where hover tooltips don't work. An end-of-bar label
                      reads like the pie's percentage, not like the
                      over-the-column numbers that got removed elsewhere. */}
                  {/* Literal color, not var(--text-color-secondary) — the
                      html2canvas PDF capture silently dropped that text
                      entirely with the CSS var (unclear why; axis tick
                      text using the same var on `stroke` renders fine, so
                      this seems specific to LabelList's `fill`). */}
                  <LabelList
                    dataKey="value"
                    position="right"
                    fill="hsl(220, 10%, 55%)"
                    fontSize={11}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    )
  }

  // radio / select — pie or bar, owner's choice.
  const data = distributionToChartData(distribution)
  const pieTotal = data.reduce((sum, d) => sum + d.value, 0)
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
        <div className={styles.pieRow}>
          <div data-pdf-chart-id={field.id}>
            <ResponsiveContainer width={140} height={160}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  activeShape={renderActivePieSlice}
                  isAnimationActive={false}
                >
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip cursor={false} content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* A side legend reads better than recharts' default leader-line
              labels — those clipped at the card edge for long option names
              (e.g. "Portugal") and, in the PDF export where hover tooltips
              don't work, floating labels were the only way to see exact
              percentages anyway. */}
          <ul className={styles.legend} data-pdf-legend-id={field.id}>
            {data.map((entry, i) => {
              const percent =
                pieTotal > 0 ? Math.round((entry.value / pieTotal) * 100) : 0
              return (
                <li key={entry.name} className={styles.legendItem}>
                  <span
                    className={styles.legendSwatch}
                    style={{
                      backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                    }}
                  />
                  <span className={styles.legendName}>{entry.name}</span>
                  <span className={styles.legendPercent}>{percent}%</span>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <div data-pdf-chart-id={field.id}>
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
              <Tooltip cursor={false} content={<ChartTooltip />} />
              <Bar
                dataKey="value"
                fill={CHART_COLORS[0]}
                activeBar={<ActiveBar />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
