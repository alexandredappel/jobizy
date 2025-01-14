import React, { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isSent: boolean;
}

interface MessagesAreaProps {
  messages: Message[];
  currentUserId: string;
}

const MessagesArea = ({ messages, currentUserId }: MessagesAreaProps) => {
  console.log("MessagesArea: Rendering messages count:", messages.length);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex",
            message.isSent ? "justify-end" : "justify-start"
          )}
        >
          <Card
            className={cn(
              "max-w-[85%] px-4 py-2 animate-fade-in md:max-w-[70%]",
              message.isSent
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-accent-foreground"
            )}
          >
            <p className="break-words">{message.content}</p>
            <p
              className={cn(
                "text-xs mt-1",
                message.isSent
                  ? "text-primary-foreground/80"
                  : "text-accent-foreground/80"
              )}
            >
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </Card>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesArea;