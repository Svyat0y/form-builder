export const formatAnswerValue = (
  value: string | string[] | number | undefined,
  emptyPlaceholder = '—',
): string => {
  if (value === undefined || value === '') return emptyPlaceholder
  if (Array.isArray(value)) {
    return value.length ? value.join(', ') : emptyPlaceholder
  }
  return String(value)
}
