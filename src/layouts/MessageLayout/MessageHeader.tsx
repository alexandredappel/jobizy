import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageHeaderProps {
  profileImage: string;
  name: string;
  subtitle: string;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onBackClick: () => void;
}

const MessageHeader = ({
  profileImage,
  name,
  subtitle,
  isFavorite,
  onFavoriteToggle,
  onBackClick,
}: MessageHeaderProps) => {
  console.log("MessageHeader: Rendering", { name, isFavorite });

  return (
    <div className="flex items-center gap-3 border-b p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onBackClick}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Avatar className="h-10 w-10 cursor-pointer">
        <AvatarImage src={profileImage} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <h2 className="text-base font-semibold">{name}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onFavoriteToggle}
        className={cn(
          "transition-colors",
          isFavorite && "text-yellow-500 hover:text-yellow-600"
        )}
      >
        <Star className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MessageHeader;