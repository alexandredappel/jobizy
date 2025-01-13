import { useEffect, useState } from "react";

interface WelcomeSectionProps {
  userName: string;
}

const WelcomeSection = ({ userName }: WelcomeSectionProps) => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="space-y-2">
      <h3 className="text-3xl font-bold text-primary">
        {greeting}, {userName}!
      </h3>
      <p className="text-secondary">Welcome to your dashboard. Here's your overview for today.</p>
    </div>
  );
};

export default WelcomeSection;