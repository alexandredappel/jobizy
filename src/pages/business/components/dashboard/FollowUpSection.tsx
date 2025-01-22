import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';

interface FollowUpCardProps {
  searchDate: Date;
  jobTitle: string;
  contactedWorkers: Array<{ id: string; name: string }>;
  onResponse: (hired: boolean, workerId?: string) => void;
}

const FollowUpCard = ({ searchDate, jobTitle, contactedWorkers, onResponse }: FollowUpCardProps) => {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-2">Follow-up: {jobTitle}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Search from {searchDate.toLocaleDateString()}
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">Provide Feedback</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Did you hire someone?</DialogTitle>
            <DialogDescription>
              Let us know if you found someone for the {jobTitle} position
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {contactedWorkers.map((worker) => (
              <Button
                key={worker.id}
                variant="outline"
                className="w-full"
                onClick={() => onResponse(true, worker.id)}
              >
                Yes, I hired {worker.name}
              </Button>
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onResponse(true)}
            >
              Yes, I hired someone else
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => onResponse(false)}
            >
              No, still looking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const FollowUpSection = () => {
  const { toast } = useToast();
  const userService = new UserService();

  const { data: followUps, isLoading } = useQuery({
    queryKey: ['followUps'],
    queryFn: async () => {
      // This will be implemented in the userService
      return [];
    },
  });

  const handleFollowUpResponse = async (hired: boolean, workerId?: string) => {
    try {
      // Implementation for handling the follow-up response
      toast({
        title: "Thank you for your feedback",
        description: "We've recorded your response.",
      });
    } catch (error) {
      console.error('Error handling follow-up:', error);
      toast({
        title: "Error",
        description: "Failed to save your response. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading follow-ups...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Follow up with Workers</h2>
      {(!followUps || followUps.length === 0) ? (
        <Card className="p-6">
          <p className="text-muted-foreground">No follow-ups available yet. They will appear here after you contact workers.</p>
        </Card>
      ) : (
        <Carousel>
          <CarouselContent>
            {followUps.map((followUp, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <FollowUpCard {...followUp} onResponse={handleFollowUpResponse} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </div>
  );
};

export default FollowUpSection;