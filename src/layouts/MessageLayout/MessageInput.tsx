import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

const MessageInput = ({ onSend, isLoading = false }: MessageInputProps) => {
  console.log("MessageInput: Rendering with loading state:", isLoading);
  
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4"
    >
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isLoading}
          className={cn(
            "transition-all",
            message.trim() && "bg-primary hover:bg-primary/90"
          )}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;