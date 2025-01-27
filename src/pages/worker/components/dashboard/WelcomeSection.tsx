import { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface WelcomeSectionProps {
  fullName: string;
  profilePicture?: string;
}

const WelcomeSection = ({ fullName, profilePicture }: WelcomeSectionProps) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <div className="mb-6 flex items-center gap-4">
      <Avatar className="h-12 w-12">
        <AvatarImage 
          src={profilePicture} 
          alt={fullName}
          className="rounded-[var(--radius-sm)]" 
        />
        <AvatarFallback>
          <User className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col md:flex-row md:items-center md:gap-1">
        <h1 className="text-3xl font-bold text-primary">Hi {fullName}</h1>
        <span className="text-3xl font-bold text-primary">, {greeting}!</span>
      </div>
    </div>
  );
};

export default WelcomeSection;