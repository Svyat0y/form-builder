import { Link } from 'react-router-dom';
import styles from './Signup.module.scss';
import { ROUTES } from '../../../routes/routes';
//components
import { Icons } from '@components/CustomIcons/CustomIcons';
import { Title } from '@components/Title';
import { Input } from '@components/formElements/Input';
import { Checkbox } from '@components/formElements/checkbox';
import { Button } from '@components/ui/Button';
import { Divider } from '@components/Devider';
import { Layout } from '@components/Layout';
import { Container } from '@components/Container';
import { Card } from '../components/Card/Card';

export const Signup = () => {
  return (
    <Layout>
      <Container>
        <Card>
          <Title as="h1">Sign up</Title>
          <form className={styles.form} action="#">
            <Input id="name" label="Name" type="name" autoComplete="name" />
            <Input id="email" label="Email" type="email" autoComplete="email" />
            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
            />
            <Checkbox label="I want to receive updates via email." />
            <Button variant="primary">Sign up</Button>

            <p className={styles.question}>
              Already have an account?
              <span>
                <Link to={ROUTES.signIn}>Sign in</Link>
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
