import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { WorkerUser } from '@/types/firebase.types';
import { ProfileContainer, ProfileHeader, ProfileSection } from '@/layouts/profile';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { useWorkerEducation } from '@/hooks/useWorkerEducation';
import { useWorkerExperience } from '@/hooks/useWorkerExperience';

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<WorkerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const { toast } = useToast();
  const { education } = useWorkerEducation(id || '');
  const { experience } = useWorkerExperience(id || '');

  useEffect(() => {
    const fetchWorker = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setWorker({ id: docSnap.id, ...docSnap.data() } as WorkerUser);
        } else {
          toast({
            title: "Error",
            description: "Worker not found",
            variant: "destructive",
          });
          navigate('/business/search');
        }
      } catch (error) {
        console.error('Error fetching worker:', error);
        toast({
          title: "Error",
          description: "Failed to load worker profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorker();
  }, [id, navigate, toast]);

  const handleContact = () => {
    if (!worker?.phone_number) {
      toast({
        title: "Error",
        description: "Phone number not available",
        variant: "destructive",
      });
      return;
    }

    // Check if device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const phoneNumber = worker.phone_number.replace(/\D/g, '');

    if (isMobile) {
      // Open WhatsApp directly on mobile
      window.location.href = `https://wa.me/${phoneNumber}`;
    } else {
      // Show phone number on desktop and provide WhatsApp web link
      setShowPhone(true);
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!worker) return null;

  const badges = [
    { label: 'Experience', value: worker.experience || '0 years' },
    { label: 'Languages', value: worker.languages?.join(', ') || 'None' },
    { label: 'Location', value: worker.location?.join(', ') || 'Not specified' }
  ];

  return (
    <ProfileContainer type="worker" mode="view">
      <Button
        variant="ghost"
        size="icon"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div className="space-y-6 pb-24">
        <ProfileHeader
          image={worker.profile_picture_url}
          name={worker.full_name}
          role={worker.job}
          isAvailable={worker.availability_status}
          badges={badges}
        />

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">About Me</h3>
            <p className="text-muted-foreground">
              {worker.about_me || "No description provided."}
            </p>
          </CardContent>
        </Card>

        <ProfileSection title="Work Experience">
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id} className="relative pl-4 border-l-2 border-muted">
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-background border-2 border-muted" />
                <div className="mb-1">
                  <h3 className="text-lg font-medium">{exp.company}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(exp.start_date.toDate(), 'MMM yyyy')} - 
                    {exp.end_date ? format(exp.end_date.toDate(), 'MMM yyyy') : 'Present'}
                  </p>
                </div>
                <p className="text-muted-foreground">{exp.position}</p>
              </div>
            ))}
            {(!experience || experience.length === 0) && (
              <p className="text-muted-foreground">No work experience listed.</p>
            )}
          </div>
        </ProfileSection>

        <ProfileSection title="Education">
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id} className="relative pl-4 border-l-2 border-muted">
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-background border-2 border-muted" />
                <div className="mb-1">
                  <h3 className="text-lg font-medium">{edu.institution}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(edu.start_date.toDate(), 'MMM yyyy')} - 
                    {edu.end_date ? format(edu.end_date.toDate(), 'MMM yyyy') : 'Present'}
                  </p>
                </div>
                <p className="text-muted-foreground">{edu.degree}</p>
              </div>
            ))}
            {(!education || education.length === 0) && (
              <p className="text-muted-foreground">No education listed.</p>
            )}
          </div>
        </ProfileSection>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t max-w-4xl mx-auto">
        <Button 
          className="w-full"
          size="lg"
          onClick={handleContact}
        >
          <Phone className="mr-2 h-4 w-4" />
          {showPhone ? worker.phone_number : "Contact Worker"}
        </Button>
      </div>
    </ProfileContainer>
  );
};

export default WorkerProfile;