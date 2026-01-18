import { showSimpleAlert } from '@utils/sweetAlert'

export const handleApiError = async (
  error: any,
  defaultMessage: string,
): Promise<string> => {
  const errorMessage = error.response?.data?.message || defaultMessage
  await showSimpleAlert('error', 'Error', errorMessage)
  return errorMessage
}

export const showSuccessAlert = async (message: string) => {
  await showSimpleAlert('success', 'Success', message)
}
