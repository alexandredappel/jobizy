import React from 'react';
import { format } from 'date-fns';
import { WorkExperience } from '@/types/firebase.types';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface WorkExperienceSectionProps {
  experiences: WorkExperience[];
  isLoading: boolean;
  onEdit: () => void;
}

export function WorkExperienceSection({ experiences, isLoading, onEdit }: WorkExperienceSectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Work Experience</h2>
          <Skeleton className="h-10 w-10" />
        </div>
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <h2 className="text-xl font-semibold text-secondary">Work Experience</h2>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-10 w-10 text-primary hover:text-primary-hover"
          onClick={onEdit}
        >
          <Pencil className="h-6 w-6" />
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative pl-4 border-l-2 border-muted">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-background border-2 border-muted" />
              <div className="mb-1">
                <h3 className="text-lg font-medium text-primary">{exp.company}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(exp.start_date.toDate(), 'MMM yyyy')} - 
                  {exp.end_date ? format(exp.end_date.toDate(), 'MMM yyyy') : 'Present'}
                </p>
              </div>
              <p className="text-secondary">{exp.position}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}