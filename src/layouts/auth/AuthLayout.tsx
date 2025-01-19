import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <span className="text-4xl font-bold text-primary">Jobizy</span>
          </Link>
          <h1 className="text-2xl font-semibold text-secondary">{title}</h1>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;