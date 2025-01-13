import { Button } from "@/components/ui/button";
import { MessageSquare, Phone } from "lucide-react";

const FollowUpSection = () => {
  const contacts = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Waitress",
      status: "Interviewed",
      lastContact: "2d ago",
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Chef",
      status: "To Contact",
      lastContact: "1d ago",
    },
    {
      id: 3,
      name: "Anna Smith",
      role: "Bartender",
      status: "Scheduled",
      lastContact: "5h ago",
    },
  ];

  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors"
        >
          <div>
            <h4 className="font-medium">{contact.name}</h4>
            <p className="text-sm text-muted-foreground">{contact.role}</p>
            <div className="flex items-center mt-1">
              <span className="text-xs text-primary">{contact.status}</span>
              <span className="text-xs text-muted-foreground ml-2">
                • Last contact: {contact.lastContact}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="icon" variant="ghost">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost">
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowUpSection;