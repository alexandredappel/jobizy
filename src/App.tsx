import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { router } from './routes';
import { useAuth } from './hooks/useAuth';
import './App.css';
import './lib/i18n';

function App() {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      // Initialize language preference when user logs in
      import('./lib/i18n').then(({ getUserLanguage }) => {
        getUserLanguage(user.id).then((lang) => {
          import('i18next').then((i18n) => {
            i18n.default.changeLanguage(lang);
          });
        });
      });
    }
  }, [user?.id]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;