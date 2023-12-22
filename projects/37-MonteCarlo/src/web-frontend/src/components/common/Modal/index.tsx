import { type ReactNode, useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  children?: ReactNode
}

export default function (props: ModalProps) {
  const { children } = props

  const [enabled, setEnabled] = useState(false)
  const id = useId()

  const isBrowser = typeof window !== 'undefined' && !!window.matchMedia
  const element = isBrowser && window.document.querySelector('#app-modal-container')

  useEffect(() => {
    setEnabled(true)
  }, [])

  if (!enabled || !element) {
    return <></>
  }

  return createPortal(children, element, id)
}
