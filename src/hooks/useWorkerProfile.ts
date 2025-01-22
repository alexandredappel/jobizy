import { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
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

    console.log('Setting up real-time listener for user:', userId);
    
    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      (doc) => {
        console.log('Received Firestore update:', doc.data());
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

    return () => {
      console.log('Cleaning up Firestore listener');
      unsubscribe();
    };
  }, [userId, toast]);

  const updateProfile = async (data: Partial<WorkerUser>) => {
    if (!userId) return;
    
    try {
      console.log('Updating profile with data:', data);
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...data,
        updated_at: new Date()
      });
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { profile, isLoading, error, updateProfile };
}