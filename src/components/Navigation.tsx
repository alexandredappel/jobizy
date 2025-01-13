import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export const Navigation = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Navigation: Sign out error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">Jobizy</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/messages" className="text-secondary hover:text-primary px-3 py-2">
                  Messages
                </Link>
                
                {user.role === 'worker' ? (
                  <>
                    <Link to="/worker/dashboard" className="text-secondary hover:text-primary px-3 py-2">
                      Dashboard
                    </Link>
                    <Link to="/worker/profile/edit" className="text-secondary hover:text-primary px-3 py-2">
                      Edit Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/business/search" className="text-secondary hover:text-primary px-3 py-2">
                      Search Workers
                    </Link>
                    <Link to="/business/dashboard" className="text-secondary hover:text-primary px-3 py-2">
                      Dashboard
                    </Link>
                    <Link to="/business/profile/edit" className="text-secondary hover:text-primary px-3 py-2">
                      Edit Profile
                    </Link>
                  </>
                )}
                
                <button
                  onClick={handleSignOut}
                  className="text-secondary hover:text-primary px-3 py-2"
                >
                  Sign Out
                </button>
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