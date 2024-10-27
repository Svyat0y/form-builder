import { MouseEvent } from 'react';
import styles from './Signin.module.scss';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../routes/routes';
//components
import { Icons } from '@components/CustomIcons/CustomIcons';
import { Input } from '@components/formElements/Input';
import { Checkbox } from '@components/formElements/checkbox';
import { Divider } from '@components/Devider';
import { Title } from '@components/Title';
import { Button } from '@components/ui/Button';
import { Layout } from '@components/Layout';
import { Container } from '@components/Container';
import { ForgotPassword } from '../components/ForgotPasword/ForgotPassword';
import { Card } from '../components/Card/Card';
//sweetalert
import { onCallSweetAlertMain } from '../../../utils/sweetAlert';

export const Signin = () => {
  const handleClickRightLabel = (e: MouseEvent) => {
    e.preventDefault();
    onCallSweetAlertMain(ForgotPassword);
  };

  return (
    <Layout>
      <Container>
        <Card>
          <Title as="h1">Sign in</Title>
          <form className={styles.form} action="#">
            <Input id="email" label="Email" type="email" autoComplete="email" />
            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              isRightItemInLabel="Forgot your password?"
              handleClickRightLabel={handleClickRightLabel}
            />
            <Checkbox label="Remember me" />
            <Button variant="primary">Sign in</Button>

            <p className={styles.question}>
              Don&apos;t have an account?
              <span>
                <Link to={ROUTES.signUp}>Sign up</Link>
              </span>
            </p>
          </form>
          <Divider label="or" />
          <Button variant="secondary" icon={<Icons.Google />}>
            Sign in with Google
          </Button>
          <Button variant="secondary" icon={<Icons.Facebook />}>
            Sign in with Facebook
          </Button>
        </Card>
      </Container>
    </Layout>
  );
};
