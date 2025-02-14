
import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { WorkExperience } from '@/types/firebase.types';
import { useToast } from '@/hooks/use-toast';

export function useWorkerExperience(userId: string) {
  const [experience, setExperience] = useState<WorkExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'work_experiences'),
      where('user_id', '==', userId),
      orderBy('start_date', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const experienceData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            types: data.types || [],
            primaryType: data.primaryType || null
          };
        }) as WorkExperience[];
        
        console.log('Fetched experiences with types:', experienceData);
        setExperience(experienceData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching work experience:', error);
        setError(error as Error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to load work experience data",
          variant: "destructive",
        });
      }
    );

    return () => unsubscribe();
  }, [userId, toast]);

  return { experience, isLoading, error };
}
