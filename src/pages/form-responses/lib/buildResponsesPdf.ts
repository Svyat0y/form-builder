import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { formatAnswerValue } from './formatAnswer'
import {
  FormResponseItem,
  ResponseStats,
} from '@/features/form-responses/model'
import { Form, FormField } from '@/features/forms/model'

const MARGIN = 40
const LINE_HEIGHT = 11
const CELL_PADDING = 4
const DATE_COL_WIDTH = 85
const TABLE_FONT_SIZE = 8

const CARD_PADDING = 12
const CARD_GAP = 16
const LEGEND_LINE_HEIGHT = 13
const LEGEND_WIDTH_RATIO = 0.42 // fraction of the card's inner width

// html2canvas's `backgroundColor` only accepts a solid color — capturing
// happens after forcing the light theme (see withLightTheme below), so a
// plain white is always correct here.
const CAPTURE_BG = '#ffffff'

// The dashboard can be in dark mode — dark-on-dark or clashing colors read
// badly in a printed/exported PDF, so the export always renders as if the
// app were in light theme, then restores whatever the user had.
async function withLightTheme<T>(fn: () => Promise<T>): Promise<T> {
  const root = document.documentElement
  const previous = root.getAttribute('data-theme')
  root.setAttribute('data-theme', 'light')
  try {
    return await fn()
  } finally {
    if (previous === null) root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', previous)
  }
}

function columnWidths(fields: FormField[], contentWidth: number) {
  const remaining = contentWidth - DATE_COL_WIDTH
  const weights = fields.map((f) =>
    f.type === 'textarea' ? 3 : f.type === 'text' ? 2 : 1,
  )
  const totalWeight = weights.reduce((a, b) => a + b, 0) || 1
  return weights.map((w) => (w / totalWeight) * remaining)
}

interface LegendItem {
  name: string
  percent: string
  color: string
}

// Reads the already-rendered legend list straight out of the DOM instead
// of recomputing percentages — stays in sync with whatever's on screen
// (including which option order/colors are showing) with no duplicated
// math to keep in sync.
function readLegend(chartsElement: HTMLElement, fieldId: string): LegendItem[] {
  const el = chartsElement.querySelector(`[data-pdf-legend-id="${fieldId}"]`)
  if (!el) return []
  return Array.from(el.children).map((li) => {
    const swatch = li.children[0] as HTMLElement | undefined
    return {
      color: swatch?.style.backgroundColor || '#999999',
      name: li.children[1]?.textContent ?? '',
      percent: li.children[2]?.textContent ?? '',
    }
  })
}

interface ChartCard {
  title: string
  avgText: string | null
  legend: LegendItem[]
  imgData: string
  imgAspect: number // height / width, from the captured canvas
}

async function captureChartCards(
  chartsElement: HTMLElement,
  chartFields: FormField[],
  stats: ResponseStats | null,
): Promise<ChartCard[]> {
  const cards: ChartCard[] = []

  for (const field of chartFields) {
    const chartEl = chartsElement.querySelector<HTMLElement>(
      `[data-pdf-chart-id="${field.id}"]`,
    )
    if (!chartEl) continue

    const fieldStats = stats?.fields.find((f) => f.fieldId === field.id)

    // Only the chart's own plotting area is captured via html2canvas (SVG
    // shapes render reliably there) — the title, "avg X.X" badge, and pie
    // legend are all drawn as native jsPDF text below instead, because
    // html2canvas's HTML text renderer couldn't resolve our CSS custom
    // property colors and rendered every card's title/legend blank
    // (tried document.fonts.ready, foreignObjectRendering, and forcing an
    // inline color on the whole clone — none of it fixed the text without
    // breaking something else).
    const canvas = await html2canvas(chartEl, {
      scale: 2,
      backgroundColor: CAPTURE_BG,
    })

    cards.push({
      title: field.label,
      avgText:
        fieldStats?.average !== undefined
          ? `avg ${fieldStats.average.toFixed(1)}`
          : null,
      legend: readLegend(chartsElement, field.id),
      imgData: canvas.toDataURL('image/png'),
      imgAspect: canvas.height / canvas.width,
    })
  }

  return cards
}

function drawChartCard(
  doc: jsPDF,
  card: ChartCard,
  x: number,
  y: number,
  width: number,
): number {
  const innerWidth = width - CARD_PADDING * 2
  const hasLegend = card.legend.length > 0
  const imgWidth = hasLegend
    ? innerWidth * (1 - LEGEND_WIDTH_RATIO) - 8
    : innerWidth
  const imgHeight = imgWidth * card.imgAspect
  const legendHeight = card.legend.length * LEGEND_LINE_HEIGHT
  const bodyHeight = Math.max(imgHeight, legendHeight)
  const cardHeight = CARD_PADDING * 2 + LINE_HEIGHT + 10 + bodyHeight

  doc.setDrawColor(225)
  doc.roundedRect(x, y, width, cardHeight, 6, 6)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(20)
  doc.text(card.title, x + CARD_PADDING, y + CARD_PADDING + LINE_HEIGHT - 1)

  if (card.avgText) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(130)
    doc.text(
      card.avgText,
      x + width - CARD_PADDING,
      y + CARD_PADDING + LINE_HEIGHT - 1,
      {
        align: 'right',
      },
    )
  }

  const bodyY = y + CARD_PADDING + LINE_HEIGHT + 10
  doc.addImage(
    card.imgData,
    'PNG',
    x + CARD_PADDING,
    bodyY,
    imgWidth,
    imgHeight,
  )

  if (hasLegend) {
    const legendX = x + CARD_PADDING + imgWidth + 8
    doc.setFontSize(9)
    card.legend.forEach((item, i) => {
      const itemY = bodyY + i * LEGEND_LINE_HEIGHT + 8
      doc.setFillColor(item.color || '#999999')
      doc.rect(legendX, itemY - 7, 7, 7, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(20)
      doc.text(item.name, legendX + 12, itemY)
      doc.setTextColor(130)
      doc.text(item.percent, x + width - CARD_PADDING, itemY, {
        align: 'right',
      })
    })
  }

  return cardHeight
}

// "Удобный список ответов" as a real table — unlike the on-screen table
// (which ellipsis-truncates), a cell with a long answer just makes its own
// row taller instead of cutting text off. See responses page review notes.
export async function exportResponsesPdf({
  form,
  chartFields,
  stats,
  chartsElement,
  responses,
}: {
  form: Form
  chartFields: FormField[]
  stats: ResponseStats | null
  chartsElement: HTMLElement | null
  responses: FormResponseItem[]
}): Promise<void> {
  await withLightTheme(async () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const contentWidth = pageWidth - MARGIN * 2

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.setTextColor(0)
    doc.text(form.title || 'Untitled form', MARGIN, MARGIN)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(120)
    doc.text(
      `${responses.length} response${responses.length === 1 ? '' : 's'} — generated ${new Date().toLocaleString()}`,
      MARGIN,
      MARGIN + 18,
    )

    let cursorY = MARGIN + 44

    // Charts — a compact 2-up grid (survey report exports read best this
    // way — see design discussion) instead of one huge image per page.
    // Each card is captured on its own so a page break only ever falls
    // between rows, never through a card's title or chart.
    if (chartsElement && chartFields.length > 0) {
      const cards = await captureChartCards(chartsElement, chartFields, stats)
      const colGap = CARD_GAP
      const colWidth = (contentWidth - colGap) / 2

      for (let i = 0; i < cards.length; i += 2) {
        const left = cards[i]
        const right = cards[i + 1]

        // Measure both cards' heights before drawing so the row can be
        // page-broken as a unit rather than split mid-card.
        const probeHeight = (card: ChartCard) => {
          const innerWidth = colWidth - CARD_PADDING * 2
          const hasLegend = card.legend.length > 0
          const imgWidth = hasLegend
            ? innerWidth * (1 - LEGEND_WIDTH_RATIO) - 8
            : innerWidth
          const imgHeight = imgWidth * card.imgAspect
          const legendHeight = card.legend.length * LEGEND_LINE_HEIGHT
          return (
            CARD_PADDING * 2 +
            LINE_HEIGHT +
            10 +
            Math.max(imgHeight, legendHeight)
          )
        }
        const rowHeight = Math.max(
          probeHeight(left),
          right ? probeHeight(right) : 0,
        )

        if (cursorY + rowHeight > pageHeight - MARGIN && cursorY > MARGIN) {
          doc.addPage()
          cursorY = MARGIN
        }

        drawChartCard(doc, left, MARGIN, cursorY, colWidth)
        if (right)
          drawChartCard(
            doc,
            right,
            MARGIN + colWidth + colGap,
            cursorY,
            colWidth,
          )
        cursorY += rowHeight + colGap
      }
    }

    // Responses table — always starts on a fresh page.
    doc.addPage()
    cursorY = MARGIN

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text('Responses', MARGIN, cursorY)
    cursorY += 22

    const colWidths = columnWidths(form.fields, contentWidth)
    const columns = [
      { label: 'Submitted', width: DATE_COL_WIDTH },
      ...form.fields.map((field, i) => ({
        label: field.label,
        width: colWidths[i],
      })),
    ]

    const drawHeaderRow = () => {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(TABLE_FONT_SIZE)
      doc.setFillColor('#f0f0f0')
      doc.rect(
        MARGIN,
        cursorY,
        contentWidth,
        LINE_HEIGHT + CELL_PADDING * 2,
        'F',
      )

      let x = MARGIN
      const textY = cursorY + CELL_PADDING + LINE_HEIGHT - 2
      for (const col of columns) {
        const lines = doc.splitTextToSize(
          col.label,
          col.width - CELL_PADDING * 2,
        )
        doc.text(lines[0] ?? '', x + CELL_PADDING, textY)
        x += col.width
      }
      cursorY += LINE_HEIGHT + CELL_PADDING * 2
    }

    const ensureSpace = (needed: number, redrawHeader: boolean) => {
      if (cursorY + needed > pageHeight - MARGIN) {
        doc.addPage()
        cursorY = MARGIN
        if (redrawHeader) {
          drawHeaderRow()
          // drawHeaderRow leaves the doc in bold — every row after a page
          // break needs the body font restored or it renders bold too.
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(TABLE_FONT_SIZE)
        }
      }
    }

    drawHeaderRow()
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(TABLE_FONT_SIZE)

    for (const response of responses) {
      const dateStr = new Date(response.createdAt).toLocaleString()
      const cellLines = columns.map((col, i) => {
        const raw =
          i === 0
            ? dateStr
            : formatAnswerValue(response.answers[form.fields[i - 1].id])
        return doc.splitTextToSize(
          raw,
          col.width - CELL_PADDING * 2,
        ) as string[]
      })
      const rowLines = Math.max(...cellLines.map((lines) => lines.length), 1)
      const rowHeight = rowLines * LINE_HEIGHT + CELL_PADDING * 2

      ensureSpace(rowHeight, true)

      let x = MARGIN
      for (let i = 0; i < columns.length; i++) {
        doc.setTextColor(20)
        doc.text(
          cellLines[i],
          x + CELL_PADDING,
          cursorY + CELL_PADDING + LINE_HEIGHT - 2,
        )
        x += columns[i].width
      }

      doc.setDrawColor(220)
      doc.line(
        MARGIN,
        cursorY + rowHeight,
        pageWidth - MARGIN,
        cursorY + rowHeight,
      )
      cursorY += rowHeight
    }

    doc.save(`${form.title || 'responses'}.pdf`)
  })
}
