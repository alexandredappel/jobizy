import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  onEdit?: () => void;
}

const ProfileSection = ({ title, children, onEdit }: ProfileSectionProps) => {
  return (
    <Card className="animate-in fade-in duration-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <h2 className="text-xl font-semibold text-secondary">{title}</h2>
        {onEdit && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onEdit}
            aria-label={`Edit ${title}`}
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default ProfileSection;