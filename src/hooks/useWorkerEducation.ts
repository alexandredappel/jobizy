import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Education } from '@/types/firebase.types';
import { useToast } from '@/hooks/use-toast';

export function useWorkerEducation(userId: string) {
  const [education, setEducation] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'education'),
      where('user_id', '==', userId),
      orderBy('start_date', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const educationData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Education[];
        setEducation(educationData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching education:', error);
        setError(error as Error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to load education data",
          variant: "destructive",
        });
      }
    );

    return () => unsubscribe();
  }, [userId, toast]);

  return { education, isLoading, error };
}