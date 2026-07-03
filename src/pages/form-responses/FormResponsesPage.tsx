import { FC, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './FormResponsesPage.module.scss'
import { Header } from '@/widgets/header'
import { FormPageToolbar } from '@/widgets/form-page-toolbar'
import { ROUTES } from '@/shared/config/routes'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { showSimpleAlert } from '@/shared/lib/utils/sweetAlert'
import { CHOICE_FIELD_TYPES, Form, formsApi } from '@/features/forms/model'
import {
  fetchResponses,
  fetchStats,
  resetResponses,
} from '@/features/form-responses/model'
import { FieldChart } from './components/FieldChart'
import { ResponsesTable } from './components/ResponsesTable'
import { MetricsSidebar } from './components/MetricsSidebar'
import { buildResponsesCsv } from './lib/buildResponsesCsv'
import { fetchAllResponses } from './lib/fetchAllResponses'

export const FormResponsesPage: FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { items, total, page, limit, stats, isLoading } = useAppSelector(
    (state) => state.formResponses,
  )

  const [form, setForm] = useState<Form | null>(null)
  const [formLoadError, setFormLoadError] = useState(false)
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [isExportingPdf, setIsExportingPdf] = useState(false)

  const chartsGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) return

    let cancelled = false
    formsApi
      .getOne(id)
      .then((response) => {
        if (!cancelled) setForm(response.data)
      })
      .catch(() => {
        if (!cancelled) setFormLoadError(true)
      })

    dispatch(fetchResponses({ formId: id, params: { page: 1, limit: 20 } }))
    dispatch(fetchStats(id))

    return () => {
      cancelled = true
      dispatch(resetResponses())
    }
  }, [id, dispatch])

  useEffect(() => {
    if (!formLoadError) return
    showSimpleAlert(
      'error',
      'Error',
      'You do not have access to this form, or it does not exist.',
    )
    navigate(ROUTES.dashboard)
  }, [formLoadError, navigate])

  const handlePageChange = (nextPage: number) => {
    if (!id) return
    dispatch(fetchResponses({ formId: id, params: { page: nextPage, limit } }))
  }

  const handleExportCsv = async () => {
    if (!id || !form) return
    setIsExportingCsv(true)
    try {
      const all = await fetchAllResponses(id)
      const csv = buildResponsesCsv(form.fields, all)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${form.title || 'responses'}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      showSimpleAlert('error', 'Error', 'Failed to export responses.')
    } finally {
      setIsExportingCsv(false)
    }
  }

  // Only choice-type fields with trackStats on get a chart — text/textarea
  // (and anything without the toggle) stay in the raw table only. See
  // docs/pages/form-editor.md §5.1.
  const chartFields =
    form?.fields.filter(
      (field) => CHOICE_FIELD_TYPES.includes(field.type) && field.trackStats,
    ) ?? []

  const handleExportPdf = async () => {
    if (!id || !form) return
    setIsExportingPdf(true)
    try {
      const all = await fetchAllResponses(id)
      const { exportResponsesPdf } = await import('./lib/buildResponsesPdf')
      await exportResponsesPdf({
        form,
        chartFields,
        stats,
        chartsElement: chartsGridRef.current,
        responses: all,
      })
    } catch {
      showSimpleAlert('error', 'Error', 'Failed to export responses.')
    } finally {
      setIsExportingPdf(false)
    }
  }

  if (!form) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.loading}>Loading…</div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Header />

      <FormPageToolbar
        active="responses"
        onBack={() => navigate(ROUTES.dashboard)}
        onNavigate={(tab) =>
          tab === 'edit' && navigate(`/forms/${form.id}/edit`)
        }
      />

      <div className={styles.body}>
        <div className={styles.main}>
          <h1 className={styles.title}>{form.title}</h1>

          {chartFields.length > 0 && (
            <div className={styles.chartsGrid} ref={chartsGridRef}>
              {chartFields.map((field) => {
                const fieldStats = stats?.fields.find(
                  (f) => f.fieldId === field.id,
                )
                return fieldStats ? (
                  <FieldChart key={field.id} field={field} stats={fieldStats} />
                ) : null
              })}
            </div>
          )}

          <ResponsesTable
            fields={form.fields}
            items={items}
            page={page}
            limit={limit}
            total={total}
            isLoading={isLoading}
            onPageChange={handlePageChange}
          />
        </div>

        <MetricsSidebar
          stats={stats}
          isExportingCsv={isExportingCsv}
          isExportingPdf={isExportingPdf}
          onExportCsv={handleExportCsv}
          onExportPdf={handleExportPdf}
        />
      </div>
    </div>
  )
}
