import { useCallback, useState } from 'react'

export type TUseOpen = ReturnType<typeof useOpen>

export const useOpen = (init?: boolean) => {
  const [isOpen, setIsOpen] = useState<boolean>(init || false)
  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [])
  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [])
  const onToggle = useCallback(() => {
    setIsOpen((prev) => {
      return !prev
    })
  }, [])

  return {
    isOpen,
    setIsOpen,
    onOpen,
    onClose,
    onToggle,
  }
}
