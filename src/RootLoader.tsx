import { ReactNode, useEffect, useState } from 'react'
import { checkAuth } from '@store/features/auth/authSlice'
import {
  LOADING_STYLE,
  SPINNER_COLOR,
} from '@store/features/auth/helpers/auth.constants'
import { Ring } from 'react-spinners-css'
import { useAppDispatch } from '@store/hooks/useAppDispatch'
import { useAppSelector } from '@store/hooks/useAppSelector'

interface RootLoaderProps {
  children: ReactNode
}

export const RootLoader = ({ children }: RootLoaderProps) => {
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.auth)
  const [initialCheckDone, setInitialCheckDone] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(checkAuth()).unwrap()
      } catch (error) {
        console.debug('Auth check failed on init:', error)
      } finally {
        setInitialCheckDone(true)
      }
    }

    initAuth()
  }, [dispatch])

  if (isLoading || !initialCheckDone) {
    return (
      <div style={LOADING_STYLE}>
        <Ring color={SPINNER_COLOR} />
      </div>
    )
  }

  return <>{children}</>
}
