import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';

interface BaseLayoutProps {
  children?: ReactNode;
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="container mx-auto p-4 lg:p-8">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default BaseLayout;