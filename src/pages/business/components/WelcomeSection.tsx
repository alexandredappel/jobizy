import { useEffect, useState } from "react";

interface WelcomeSectionProps {
  businessName: string;
}

const WelcomeSection = ({ businessName }: WelcomeSectionProps) => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const stats = [
    { label: "Available Workers", value: "124" },
    { label: "New Applications", value: "8" },
    { label: "Active Chats", value: "3" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl font-bold text-primary">
          {greeting}, {businessName}!
        </h3>
        <p className="text-secondary mt-2">Here's what's happening with your recruitment today.</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 bg-accent/10 rounded-lg">
            <div className="text-2xl font-bold text-secondary">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeSection;