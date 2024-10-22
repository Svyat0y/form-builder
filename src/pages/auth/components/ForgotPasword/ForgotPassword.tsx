import { ChangeEvent, FC, useState } from 'react';
import styles from './ForgotPassword.module.scss';
//components
import { Input } from '@components/formElements/Input';
import { Button } from '@components/ui/Button';

interface ForgotPasswordProps {
  onCloseSwal: () => void;
}

export const ForgotPassword: FC<ForgotPasswordProps> = ({ onCloseSwal }) => {
  const [state, setState] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState(e.target.value);
  };

  const handleReset = () => {
    setTimeout(() => onCloseSwal(), 2000);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Reset password</h2>
      <Input
        id="password"
        label="Email"
        value={state}
        onChange={handleChange}
        type="email"
        placeholder="Email address"
      />
      <div className={styles.navigation}>
        <Button variant="secondary" onClick={onCloseSwal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleReset}>
          Continue
        </Button>
      </div>
    </div>
  );
};
