import styles from '../../pages/auth/SignIn/Signin.module.scss';
import { ComponentType } from 'react';
//sweetalert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

export const onCallSweetAlertMain = (
  NodeComponent: ComponentType<Partial<{ onClose: () => void }>>,
) => {
  const closeAlert = () => MySwal.close();

  MySwal.fire({
    html: <NodeComponent onClose={closeAlert} />,
    showConfirmButton: false,
    customClass: {
      popup: styles.myCustomModal,
    },
  });
};
