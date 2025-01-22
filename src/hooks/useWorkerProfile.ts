import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { WorkerUser } from '@/types/firebase.types';
import { useToast } from '@/hooks/use-toast';

export function useWorkerProfile(userId: string) {
  const [profile, setProfile] = useState<WorkerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      (doc) => {
        if (doc.exists()) {
          setProfile({ id: doc.id, ...doc.data() } as WorkerUser);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching worker profile:', error);
        setError(error as Error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      }
    );

    return () => unsubscribe();
  }, [userId, toast]);

  return { profile, isLoading, error };
}