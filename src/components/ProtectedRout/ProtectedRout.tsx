import { FC, ReactNode } from 'react';

interface ProtectedRoutProps {
  children: ReactNode;
}

export const ProtectedRout: FC<ProtectedRoutProps> = ({ children }) => {
  return <>{children}</>;
};
