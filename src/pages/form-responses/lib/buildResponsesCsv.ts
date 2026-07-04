import { FormResponseItem } from '@/features/form-responses/model'
import { FormField } from '@/features/forms/model'

const csvCell = (value: string): string => {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const formatValue = (value: string | string[] | number | undefined): string => {
  if (value === undefined || value === '') return ''
  if (Array.isArray(value)) return value.join('; ')
  return String(value)
}

export const buildResponsesCsv = (
  fields: FormField[],
  items: FormResponseItem[],
): string => {
  const header = ['Submitted at', ...fields.map((f) => f.label)]
  const rows = items.map((item) => [
    new Date(item.createdAt).toISOString(),
    ...fields.map((field) => formatValue(item.answers[field.id])),
  ])

  return [header, ...rows]
    .map((row) => row.map((cell) => csvCell(cell)).join(','))
    .join('\n')
}
