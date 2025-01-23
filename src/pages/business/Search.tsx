import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { WorkerUser, Language, JobType, WorkArea } from '@/types/firebase.types';
import { SearchLayout } from '@/layouts/search';
import { SearchHeader } from '@/layouts/search/SearchHeader';
import { SearchFilters } from '@/layouts/search/components/SearchFilters';
import { WorkerCard } from '@/layouts/search/components/WorkerCard';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [workers, setWorkers] = useState<WorkerUser[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<WorkerUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    job: '' as JobType | '',
    workArea: '' as WorkArea | '',
    languages: [] as Language[],
    gender: '' as 'male' | 'female' | ''
  });

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        console.log('Fetching workers with filters:', filters);
        const q = query(
          collection(db, 'users'),
          where('availability_status', '==', true)
        );
        
        const querySnapshot = await getDocs(q);
        const workerData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as WorkerUser[];
        
        console.log('Fetched worker data:', workerData);
        setWorkers(workerData);
        setTotalAvailable(workerData.length);
        setFilteredWorkers(workerData);
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
    console.log('Filter change:', filterType, value);
    if (filterType === 'languages') {
      // Ensure value is of type Language[]
      const validLanguages = value.filter((lang: string) => 
        ['English', 'Bahasa'].includes(lang)
      ) as Language[];
      
      setFilters(prev => ({
        ...prev,
        [filterType]: validLanguages
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
  };

  const handleSearch = () => {
    setIsLoading(true);
    console.log('Searching with filters:', filters);
    
    const filtered = workers.filter(worker => {
      // If no filters are active, return all workers
      if (!filters.job && !filters.workArea && filters.languages.length === 0 && !filters.gender) {
        return true;
      }

      // Check job type
      if (filters.job && worker.job.toLowerCase() !== filters.job.toLowerCase()) {
        return false;
      }

      // Check work area
      if (filters.workArea && Array.isArray(worker.location)) {
        const workerAreas = worker.location.map(area => area.toLowerCase());
        if (!workerAreas.includes(filters.workArea.toLowerCase())) {
          return false;
        }
      } else if (filters.workArea && typeof worker.location === 'string') {
        if (worker.location.toLowerCase() !== filters.workArea.toLowerCase()) {
          return false;
        }
      }

      // Check languages
      if (filters.languages.length > 0 && (!worker.languages || !Array.isArray(worker.languages))) {
        return false;
      }
      if (filters.languages.length > 0) {
        const workerLanguages = worker.languages.map(lang => lang.toLowerCase());
        const filterLanguages = filters.languages.map(lang => lang.toLowerCase());
        if (!filterLanguages.every(lang => workerLanguages.includes(lang))) {
          return false;
        }
      }

      // Check gender
      if (filters.gender && worker.gender !== filters.gender) {
        return false;
      }

      return true;
    });

    console.log('Filtered workers:', filtered);
    setFilteredWorkers(filtered);
    setIsLoading(false);
  };

  const handleViewProfile = (workerId: string) => {
    navigate(`/profiles/worker/${workerId}`);
  };

  const hasActiveFilters = filters.job || filters.workArea || filters.languages.length > 0 || filters.gender;

  return (
    <SearchLayout>
      <SearchHeader 
        totalWorkers={totalAvailable}
        hasActiveSearch={hasActiveFilters}
        onSaveSearch={() => {/* To be implemented */}}
      />
      
      <SearchFilters onFilterChange={handleFilterChange} />
      
      <div className="mt-6 space-y-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : !hasActiveFilters ? (
          <div className="text-center text-lg text-muted-foreground">
            {totalAvailable} workers available in Bali
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div>No workers found matching your criteria</div>
        ) : (
          filteredWorkers.map(worker => {
            console.log('Rendering worker card:', worker);
            return (
              <WorkerCard
                key={worker.id}
                worker={{
                  id: worker.id,
                  name: worker.full_name,
                  imageUrl: worker.profile_picture_url,
                  job: worker.job,
                  isAvailable: worker.availability_status,
                  experience: worker.experience,
                  workArea: Array.isArray(worker.location) ? worker.location[0] : worker.location || 'Not specified',
                  languages: worker.languages || []
                }}
                onViewProfile={handleViewProfile}
              />
            );
          })
        )}
      </div>
    </SearchLayout>
  );
};

export default Search;