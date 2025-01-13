import { Button } from "@/components/ui/button";
import { MessageSquare, Star } from "lucide-react";

const RecentMessagesSection = () => {
  const messages = [
    {
      id: 1,
      business: "Beach Club Bali",
      message: "Hi! We're looking for experienced waiters...",
      time: "2h ago",
      unread: true,
    },
    {
      id: 2,
      business: "Potato Head",
      message: "Thanks for your application. When can you...",
      time: "5h ago",
      unread: false,
    },
    {
      id: 3,
      business: "La Favela",
      message: "Perfect! See you tomorrow at 2 PM for...",
      time: "1d ago",
      unread: false,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="text-primary">
            <MessageSquare className="h-4 w-4 mr-2" />
            Recent
          </Button>
          <Button variant="ghost" size="sm">
            <Star className="h-4 w-4 mr-2" />
            Favorites
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-3 rounded-lg hover:bg-accent/10 cursor-pointer transition-colors"
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-medium">{msg.business}</h4>
              <span className="text-xs text-muted-foreground">{msg.time}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">{msg.message}</p>
            {msg.unread && (
              <div className="mt-2">
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                  New message
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentMessagesSection;