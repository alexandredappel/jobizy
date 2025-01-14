import { cn } from "@/lib/utils";

interface ProfileContainerProps {
  children: React.ReactNode;
  type: 'worker' | 'business';
  mode: 'view' | 'edit';
}

const ProfileContainer = ({ children, type, mode }: ProfileContainerProps) => {
  console.log('ProfileContainer: Rendering with type:', type, 'mode:', mode);
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default ProfileContainer;