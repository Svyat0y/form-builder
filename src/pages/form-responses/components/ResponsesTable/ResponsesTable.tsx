import { FC } from 'react'
import classNames from 'classnames'
import styles from './ResponsesTable.module.scss'
import { formatAnswerValue } from '../../lib/formatAnswer'
import { FormResponseItem } from '@/features/form-responses/model'
import { FormField } from '@/features/forms/model'
import { showSwalComponent } from '@/shared/lib/utils/sweetAlert'
import { FastTooltip } from '@/shared/ui/fast-tooltip'
import { AnswerModal } from '../AnswerModal'

const MODAL_HINT = 'Click a cell in this column to view the full answer.'

interface ResponsesTableProps {
  fields: FormField[]
  items: FormResponseItem[]
  page: number
  limit: number
  total: number
  isLoading: boolean
  onPageChange: (page: number) => void
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

  const openAnswerModal = (label: string, answer: string) => {
    showSwalComponent(AnswerModal, { label, answer })
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Submitted</th>
              {fields.map((field) => (
                <th key={field.id}>
                  {field.label}
                  {/* Only textarea answers can run long enough to need the
                      full-text modal — a single-line `text` field (like a
                      name) just gets a native title tooltip on its cell. */}
                  {field.type === 'textarea' && (
                    <FastTooltip text={MODAL_HINT} />
                  )}
                </th>
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
                  {fields.map((field) => {
                    const value = formatAnswerValue(item.answers[field.id])
                    const isTextarea = field.type === 'textarea'
                    const isModalTrigger = isTextarea && value !== '—'

                    return (
                      <td
                        key={field.id}
                        className={classNames({
                          [styles.modalCell]: isModalTrigger,
                        })}
                        title={isTextarea ? undefined : value}
                        onClick={
                          isModalTrigger
                            ? () => openAnswerModal(field.label, value)
                            : undefined
                        }
                      >
                        {value}
                      </td>
                    )
                  })}
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
