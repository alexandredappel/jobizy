import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface WorkerCardProps {
  worker: {
    id: string;
    name: string;
    imageUrl?: string;
    job: string;
    isAvailable: boolean;
    experience: string;
    workArea: string;
    languages: string[];
  };
  onViewProfile: (workerId: string) => void;
}

export function WorkerCard({ worker, onViewProfile }: WorkerCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={worker.imageUrl} alt={worker.name} />
            <AvatarFallback>
              <User className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{worker.name}</h3>
                <p className="text-sm text-muted-foreground">{worker.job}</p>
              </div>
              {worker.isAvailable && (
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  Available Now
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{worker.experience}</Badge>
              <Badge variant="outline">{worker.workArea}</Badge>
              {worker.languages.map((lang) => (
                <Badge key={lang} variant="outline">
                  {lang}
                </Badge>
              ))}
            </div>

            <Button 
              variant="default" 
              className="w-full mt-4"
              onClick={() => onViewProfile(worker.id)}
            >
              See Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}