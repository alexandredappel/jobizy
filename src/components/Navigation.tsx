import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export const Navigation = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">Jobizy</span>
            </Link>
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                <Link to="/messages" className="text-secondary hover:text-primary px-3 py-2">
                  Messages
                </Link>
                <Link to="/profile" className="text-secondary hover:text-primary px-3 py-2">
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/signin" className="text-secondary hover:text-primary px-3 py-2">
                  Sign In
                </Link>
                <Link to="/signup" className="text-secondary hover:text-primary px-3 py-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};