import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageContainer,
  MessageHeader,
  MessagesArea,
  MessageInput,
} from "@/layouts/MessageLayout";
import { Message } from "@/types/ui.types";
import { getMockUIMessages } from "@/services/mocks/data/mockData";

const Conversation = () => {
  const navigate = useNavigate();
  const conversationId = 'conv1'; // Will be replaced with real ID later
  const [messages, setMessages] = useState<Message[]>(() => getMockUIMessages(conversationId));
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log("Conversation: Rendering with messages:", messages.length);

  const handleSend = async (content: string) => {
    setIsLoading(true);
    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        timestamp: new Date(),
        isSent: true,
      };
      setMessages((prev) => [...prev, newMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/messages");
  };

  const handleFavoriteToggle = () => {
    setIsFavorite((prev) => !prev);
  };

  return (
    <MessageContainer>
      <MessageHeader
        profileImage="/placeholder.svg"
        name="John Doe"
        subtitle="Waiter at Beach Club"
        isFavorite={isFavorite}
        onFavoriteToggle={handleFavoriteToggle}
        onBackClick={handleBack}
      />
      <MessagesArea
        messages={messages}
        currentUserId="current_user_id"
      />
      <MessageInput
        onSend={handleSend}
        isLoading={isLoading}
      />
    </MessageContainer>
  );
};

export default Conversation;