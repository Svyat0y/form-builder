import { useAppSelector } from './useAppSelector'

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
