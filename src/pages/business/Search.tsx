import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { WorkerUser } from '@/types/firebase.types';
import { SearchLayout } from '@/layouts/search';
import { SearchHeader } from '@/layouts/search';
import { SearchFilters } from '@/layouts/search';
import { WorkerCard } from '@/layouts/search';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [workers, setWorkers] = useState<WorkerUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    job: '',
    workArea: '',
    languages: [] as string[],
    gender: ''
  });

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          where('availability_status', '==', true)
        );
        
        const querySnapshot = await getDocs(q);
        const workerData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as WorkerUser[];
        
        setWorkers(workerData);
        setTotalAvailable(workerData.length);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching workers:', error);
        toast({
          title: "Error",
          description: "Failed to load workers",
          variant: "destructive",
        });
      }
    };

    fetchWorkers();
  }, [toast]);

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      let q = query(
        collection(db, 'users'),
        where('availability_status', '==', true)
      );

      if (filters.job) {
        q = query(q, where('job', '==', filters.job));
      }
      if (filters.workArea) {
        q = query(q, where('location', 'array-contains', filters.workArea));
      }
      if (filters.gender) {
        q = query(q, where('gender', '==', filters.gender));
      }

      const querySnapshot = await getDocs(q);
      let filteredWorkers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WorkerUser[];

      // Filter by languages if selected (client-side filtering)
      if (filters.languages.length > 0) {
        filteredWorkers = filteredWorkers.filter(worker =>
          filters.languages.every(lang => worker.languages.includes(lang))
        );
      }

      setWorkers(filteredWorkers);
      
      // Save search to recent searches
      // This will be implemented in a separate PR
      
    } catch (error) {
      console.error('Error searching workers:', error);
      toast({
        title: "Error",
        description: "Failed to search workers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfile = (workerId: string) => {
    navigate(`/profiles/worker/${workerId}`);
  };

  return (
    <SearchLayout>
      <SearchHeader 
        totalWorkers={totalAvailable}
        hasActiveSearch={Object.values(filters).some(v => v !== '' && v.length !== 0)}
        onSaveSearch={() => {/* To be implemented */}}
      />
      
      <SearchFilters onFilterChange={handleFilterChange} />
      
      <div className="mt-6 space-y-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : workers.length === 0 ? (
          <div>No workers found matching your criteria</div>
        ) : (
          workers.map(worker => (
            <WorkerCard
              key={worker.id}
              worker={{
                id: worker.id,
                name: worker.full_name,
                imageUrl: worker.profile_picture_url,
                job: worker.job,
                isAvailable: worker.availability_status,
                experience: worker.experience,
                workArea: worker.location[0],
                languages: worker.languages
              }}
              onViewProfile={handleViewProfile}
            />
          ))
        )}
      </div>
    </SearchLayout>
  );
};

export default Search;