import { useAppSelector } from '@store/hooks/useAppSelector'

export const useAuth = () => {
  const { user, token, isLoading, error } = useAppSelector(
    (state) => state.auth,
  )

  return {
    user,
    token,
    isLoading,
    error,
  }
}
