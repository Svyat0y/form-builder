import { createContext, FC, ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      navigate('/login');
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
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ authToken, userData }}>
      {children}
    </AuthContext.Provider>
  );
};
