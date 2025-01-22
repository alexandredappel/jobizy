import { useEffect, useState } from 'react';

interface WelcomeSectionProps {
  fullName: string;
}

const WelcomeSection = ({ fullName }: WelcomeSectionProps) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-secondary">
        Hi {fullName}, {greeting}!
      </h1>
    </div>
  );
};

export default WelcomeSection;