import styles from './Login.module.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '@components/CustomIcons/CustomIcons';

export const Login = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign in</h1>
        <form className={styles.form} action="#">
          <div className={styles.formControl}>
            <div className={styles.formBoxLabel}>
              <label htmlFor="email">Email</label>
            </div>
            <div className={styles.inputWrapper}>
              <input id="email" type="email" autoComplete="email" />
            </div>
            <span className={styles.helperText}></span>
          </div>

          <div className={styles.formControl}>
            <div className={styles.formBoxLabel}>
              <label htmlFor="password">Password</label>
              <button className={styles.forgotBtn}>
                Forgot your password?
              </button>
            </div>
            <div className={styles.inputWrapper}>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
              />
            </div>
            <span className={styles.helperText}></span>
          </div>

          <div className={styles.formControl}>
            <div className={styles.checkBoxWrapper}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  onChange={() => {
                    setIsChecked(!isChecked);
                  }}
                />
                <svg
                  className={`${styles.checkbox} ${isChecked ? styles.active : ''}`}
                  aria-hidden="true"
                  viewBox="0 0 15 11"
                  fill="none"
                >
                  <path
                    d="M1 4.5L5 9L14 1"
                    strokeWidth="2"
                    stroke={isChecked ? '#fff' : 'none'}
                  />
                </svg>
                Remember me
              </label>
            </div>
          </div>
          <button className={styles.buttonWrapper}>Sign in</button>

          <p className={styles.question}>
            Don&apos;t have an account?
            <span>
              <Link to="#">Sign up</Link>
            </span>
          </p>
        </form>
        <div className={styles.divider}>
          <span>or</span>
        </div>
        <button
          className={`${styles.buttonWrapper} ${styles.socialButtonWrapper}`}
        >
          <Icons.Google />
          Sign in with Google
        </button>
        <button
          className={`${styles.buttonWrapper} ${styles.socialButtonWrapper}`}
        >
          <Icons.Facebook />
          Sign in with Facebook
        </button>
      </div>
    </div>
  );
};
