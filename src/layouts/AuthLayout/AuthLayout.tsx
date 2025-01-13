import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sand">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;