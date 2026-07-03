import { FormResponseItem, responsesApi } from '@/features/form-responses/model'

const PAGE_LIMIT = 100
const PAGE_CAP = 50 // safety cap — 5000 responses, plenty for MVP scale

// Both CSV and PDF export need every response, not just the current table
// page — this pages through GET /responses until it has them all.
export async function fetchAllResponses(
  formId: string,
): Promise<FormResponseItem[]> {
  const all: FormResponseItem[] = []

  for (let page = 1; page <= PAGE_CAP; page++) {
    const response = await responsesApi.list(formId, {
      page,
      limit: PAGE_LIMIT,
    })
    all.push(...response.data.items)
    if (all.length >= response.data.total) break
  }

  return all
}
