import { ReactNode, useEffect, useRef, useState } from 'react'
import { checkAuth } from '@store/features/auth/authSlice'

import { Ring } from 'react-spinners-css'
import { useAppDispatch } from '@store/hooks/useAppDispatch'
import { useAppSelector } from '@store/hooks/useAppSelector'
import { LOADING_STYLE, SPINNER_COLOR } from '@constants/constants'

interface RootLoaderProps {
  children: ReactNode
}

export const RootLoader = ({ children }: RootLoaderProps) => {
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.auth)
  const [initialCheckDone, setInitialCheckDone] = useState(false)
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (hasInitialized.current) {
      setInitialCheckDone(true)
      return
    }

    hasInitialized.current = true

    const initAuth = async () => {
      try {
        await dispatch(checkAuth()).unwrap()
      } catch (error) {
        console.log('Not authenticated:', error)
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
