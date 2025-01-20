import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  onEdit?: () => void;
  className?: string;
}

const ProfileSection = ({ title, children, onEdit, className }: ProfileSectionProps) => {
  return (
    <Card className={cn("animate-in fade-in duration-500", className)}>
      <CardHeader className="flex flex-row items-center justify-between p-6">
        <h2 className="text-xl font-semibold text-secondary">{title}</h2>
        {onEdit && (
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {children}
      </CardContent>
    </Card>
  );
};

export default ProfileSection;