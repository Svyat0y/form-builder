import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './PublicForm.module.scss'
import { PublicFormLayout } from './components/PublicFormLayout/PublicFormLayout'
import { FieldRenderer, FieldValue } from '@/features/forms/ui/field-renderer'
import {
  publicFormApi,
  PublicForm as PublicFormData,
  SubmitAnswers,
} from '@/features/forms/model'
import { ROUTES } from '@/shared/config/routes'
import {
  clearSubmitted,
  hasSubmitted,
  markSubmitted,
} from './lib/submittedGuard'

const isEmptyValue = (value: FieldValue): boolean =>
  value === undefined ||
  value === '' ||
  (Array.isArray(value) && value.length === 0)

export const PublicForm: FC = () => {
  const { uuid } = useParams<{ uuid: string }>()
  const navigate = useNavigate()

  const [form, setForm] = useState<PublicFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  const [answers, setAnswers] = useState<SubmitAnswers>({})
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!uuid) return

    let cancelled = false

    publicFormApi
      .getOne(uuid)
      .then((response) => {
        if (cancelled) return
        const data = response.data
        setForm(data)
        if (!data.allowMultipleResponses && hasSubmitted(uuid)) {
          setAlreadySubmitted(true)
        }
      })
      .catch(() => {
        if (cancelled) return
        navigate(ROUTES.publicFormClosed.replace(':uuid', uuid), {
          replace: true,
        })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [uuid, navigate])

  const setAnswer = (fieldId: string, value: FieldValue) => {
    setAnswers((prev) => {
      const next = { ...prev }
      if (value === undefined || value === '') {
        delete next[fieldId]
      } else {
        next[fieldId] = value
      }
      return next
    })
  }

  const handleAnswerAgain = () => {
    if (!uuid) return
    clearSubmitted(uuid)
    setAlreadySubmitted(false)
  }

  const handleSubmit = async () => {
    if (!uuid || !form) return

    const missing = form.fields
      .filter((field) => field.required && isEmptyValue(answers[field.id]))
      .map((field) => field.label)

    if (missing.length > 0) {
      setErrors(missing.map((label) => `"${label}" is required`))
      return
    }

    setErrors([])
    setSubmitting(true)

    try {
      await publicFormApi.submit(uuid, { answers })
      markSubmitted(uuid)
      navigate(ROUTES.publicFormSuccess.replace(':uuid', uuid), {
        state: {
          successMessage: form.successMessage,
          allowMultipleResponses: form.allowMultipleResponses,
        },
      })
    } catch (err) {
      const message = (
        err as { response?: { data?: { message?: string | string[] } } }
      )?.response?.data?.message
      setErrors(
        Array.isArray(message)
          ? message
          : [message || 'Something went wrong. Please try again.'],
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <PublicFormLayout>
        <div className={styles.shell} />
      </PublicFormLayout>
    )
  }

  if (!uuid || !form) return null

  if (alreadySubmitted) {
    return (
      <PublicFormLayout>
        <div className={styles.shell}>
          <div className={styles.statusIcon}>✅</div>
          <h1 className={styles.statusTitle}>You&apos;ve already responded</h1>
          <p className={styles.statusText}>
            Thanks for your response. Only one response is allowed per person
            for this form.
          </p>
          <button className={styles.linkBtn} onClick={handleAnswerAgain}>
            Not you? Answer again
          </button>
        </div>
      </PublicFormLayout>
    )
  }

  return (
    <PublicFormLayout>
      <div className={styles.shell}>
        <div className={styles.formHeader}>
          <h1 className={styles.title}>{form.title}</h1>
          {form.description && (
            <p className={styles.description}>{form.description}</p>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            void handleSubmit()
          }}
        >
          {form.fields.map((field) => (
            <div key={field.id} className={styles.field}>
              <label className={styles.fieldLabel}>
                {field.label}
                {field.required && <span className={styles.required}>*</span>}
              </label>
              <FieldRenderer
                field={field}
                disabled={false}
                value={answers[field.id]}
                onChange={(value) => setAnswer(field.id, value)}
              />
            </div>
          ))}

          {errors.length > 0 && (
            <div className={styles.errors}>
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        </form>

        <p className={styles.branding}>Powered by Form Builder</p>
      </div>
    </PublicFormLayout>
  )
}
