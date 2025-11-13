import { createContext, FC, ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routes';
import { Ring } from 'react-spinners-css';

interface IAuthContext {
  authToken: string | null;
  userData: any;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [authToken, setAuthToken] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserData = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject({
          status: 400,
          message: 'Bad Request',
        });
      }, 1000);
    });
  };

  const fetchUserToken = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          authToken: 'example',
        });
      }, 1000);
    });
  };

  const getUserData = async () => {
    try {
      const userTokenResponse: any = await fetchUserToken();
      setAuthToken(userTokenResponse.authToken);

      const userDataResponse: any = await fetchUserData();
      setUserData(userDataResponse);

      navigate('/');
    } catch (error: any) {
      console.log(error);
      if (location.pathname !== ROUTES.signUp) {
        navigate(ROUTES.signIn);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserData().then();
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Ring color="hsl(210, 100%, 35%)" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ authToken, userData }}>
      {children}
    </AuthContext.Provider>
  );
};
