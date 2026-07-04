// Soft, client-only guard against accidental double submits — NOT a server
// block. See decision #8 in docs/forms-realtime-architecture.md and
// docs/pages/public-form.md.
const key = (formId: string) => `fb:submitted:${formId}`

export const hasSubmitted = (formId: string): boolean =>
  localStorage.getItem(key(formId)) === '1'

export const markSubmitted = (formId: string): void => {
  localStorage.setItem(key(formId), '1')
}

export const clearSubmitted = (formId: string): void => {
  localStorage.removeItem(key(formId))
}
