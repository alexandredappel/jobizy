import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface AboutMeSectionProps {
  aboutMe: string | null | undefined;
  isLoading: boolean;
  onEdit: () => void;
}

export function AboutMeSection({ aboutMe, isLoading, onEdit }: AboutMeSectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">About Me</h2>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">About Me</h2>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        
        <div className="space-y-6">
          <p className="text-muted-foreground">
            {aboutMe || "No description provided yet."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}