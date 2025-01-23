import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth';
import { UserRole } from '@/types/firebase.types';

const SignUp = () => {
  const [role, setRole] = useState<UserRole>('worker');
  const [showRoleSelection, setShowRoleSelection] = useState(true);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setShowRoleSelection(false);
  };

  if (showRoleSelection) {
    return (
      <AuthLayout title="Choose your role">
        <div className="space-y-4">
          <Button
            type="button"
            variant={role === 'worker' ? 'default' : 'outline'}
            className="w-full"
            onClick={() => handleRoleSelect('worker')}
          >
            I'm a Worker
          </Button>
          <Button
            type="button"
            variant={role === 'business' ? 'default' : 'outline'}
            className="w-full"
            onClick={() => handleRoleSelect('business')}
          >
            I'm a Business
          </Button>
        </div>
      </AuthLayout>
    );
  }

  // Redirect to respective onboarding
  window.location.href = `/${role}/onboarding`;
  return null;
};

export default SignUp;