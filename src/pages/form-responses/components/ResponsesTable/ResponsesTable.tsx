import { FC } from 'react'
import styles from './ResponsesTable.module.scss'
import { FormResponseItem } from '@/features/form-responses/model'
import { FormField } from '@/features/forms/model'

interface ResponsesTableProps {
  fields: FormField[]
  items: FormResponseItem[]
  page: number
  limit: number
  total: number
  isLoading: boolean
  onPageChange: (page: number) => void
}

const formatAnswer = (value: string | string[] | number | undefined) => {
  if (value === undefined || value === '') return '—'
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—'
  return String(value)
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

export const ResponsesTable: FC<ResponsesTableProps> = ({
  fields,
  items,
  page,
  limit,
  total,
  isLoading,
  onPageChange,
}) => {
  const pageCount = Math.max(1, Math.ceil(total / limit))

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Submitted</th>
              {fields.map((field) => (
                <th key={field.id}>{field.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className={styles.emptyCell} colSpan={fields.length + 1}>
                  {isLoading ? 'Loading…' : 'No responses yet.'}
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className={styles.dateCell}>
                    {formatDate(item.createdAt)}
                  </td>
                  {fields.map((field) => (
                    <td key={field.id}>
                      {formatAnswer(item.answers[field.id])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 0 && (
        <div className={styles.pagination}>
          <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {pageCount}
          </span>
          <button
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
