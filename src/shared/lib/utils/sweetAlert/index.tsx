import styles from './styles.module.scss'
import { ComponentType } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

// Render a React component inside Swal — only onClose is passed automatically.
// Use showSwalComponent when you need extra props (e.g. callbacks).
export const onCallSwalWithComponent = (
  NodeComponent: ComponentType<Partial<{ onClose: () => void }>>,
) => {
  const closeAlert = () => MySwal.close()

  MySwal.fire({
    html: <NodeComponent onClose={closeAlert} />,
    showConfirmButton: false,
    customClass: {
      popup: styles.myCustomModal,
    },
  })
}

// Like onCallSwalWithComponent but supports any extra props (callbacks, data, etc.)
// and an optional wider popup (default SweetAlert width is ~32em, too narrow
// for content like a form preview).
export const showSwalComponent = <T extends object>(
  NodeComponent: ComponentType<T & { onClose?: () => void }>,
  extraProps?: Omit<T, 'onClose'>,
  options?: { width?: string | number },
) => {
  const closeAlert = () => MySwal.close()

  return MySwal.fire({
    html: <NodeComponent {...(extraProps as T)} onClose={closeAlert} />,
    showConfirmButton: false,
    width: options?.width,
    customClass: {
      popup: styles.myCustomModal,
    },
  })
}

export const showSimpleAlert = (
  icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info',
  title: string = '',
  text: string = '',
) => {
  return MySwal.fire({
    title,
    text,
    icon,
    confirmButtonText: 'OK',
    buttonsStyling: false,
    customClass: {
      popup: styles.myCustomModal,
      confirmButton: styles.button,
    },
  })
}
