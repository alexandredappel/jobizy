import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { WorkerUser, Language, JobType, WorkArea, ContractType } from '@/types/firebase.types';
import { SearchLayout } from '@/layouts/search';
import { SearchHeader } from '@/layouts/search/SearchHeader';
import { SearchFilters } from '@/layouts/search/components/SearchFilters';
import { WorkerCard } from '@/layouts/search/components/WorkerCard';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { searchService, SearchResult } from '@/services/searchService';

interface ExtendedSearchCriteria extends SearchCriteria {
  job: JobType | '';
  workArea: WorkArea | '';
  contractType: ContractType | '';
  gender: 'male' | 'female' | '';
}

const Search = () => {
  const [workers, setWorkers] = useState<WorkerUser[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<WorkerUser[]>([]);
  const [scoredWorkers, setScoredWorkers] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [useNewSearch, setUseNewSearch] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<ExtendedSearchCriteria>({
    job: '',
    workArea: '',
    languages: [],
    gender: '',
    contractType: ''
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
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    console.log('Searching with filters:', filters);
    
    try {
      if (useNewSearch) {
        const searchFilters: SearchCriteria = {
          ...(filters.job && { job: filters.job }),
          ...(filters.workArea && { workArea: filters.workArea }),
          ...(filters.languages.length > 0 && { languages: filters.languages }),
          ...(filters.gender && { gender: filters.gender }),
          ...(filters.contractType && { contractType: filters.contractType }),
          availability: true
        };
        
        const results = await searchService.searchWorkers(searchFilters);
        console.log('Search results with scoring:', results);
        setScoredWorkers(results);
        setFilteredWorkers([]);
      } else {
        const filtered = workers.filter(worker => {
          if (!filters.job && !filters.workArea && filters.languages.length === 0 && !filters.gender && !filters.contractType) {
            return true;
          }

          if (filters.job && worker.job) {
            if (worker.job.toLowerCase() !== filters.job.toLowerCase()) {
              return false;
            }
          }

          if (filters.workArea && Array.isArray(worker.location)) {
            const workerAreas = worker.location.map(area => area.toLowerCase());
            if (!workerAreas.includes(filters.workArea.toLowerCase())) {
              return false;
            }
          }

          if (filters.contractType && worker.contract_type) {
            if (worker.contract_type !== filters.contractType) {
              return false;
            }
          }

          if (filters.languages.length > 0 && Array.isArray(worker.languages)) {
            const workerLanguages = worker.languages.map(lang => lang.toLowerCase());
            const hasAnyLanguage = filters.languages.some(lang => 
              workerLanguages.includes(lang.toLowerCase())
            );
            if (!hasAnyLanguage) {
              return false;
            }
          }

          if (filters.gender && worker.gender !== filters.gender) {
            return false;
          }

          return true;
        });

        console.log('Filtered workers (old logic):', filtered);
        setFilteredWorkers(filtered);
        setScoredWorkers([]);
      }
    } catch (error) {
      console.error('Error during search:', error);
      toast({
        title: "Error",
        description: "An error occurred during search",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfile = (workerId: string) => {
    console.log('Navigating to worker profile:', workerId);
    navigate(`/worker/${workerId}`);
  };

  const displayedWorkers = useNewSearch 
    ? scoredWorkers.map(result => result.worker)
    : filteredWorkers;

  const hasActiveFilters = Boolean(
    filters.job || 
    filters.workArea || 
    filters.languages.length > 0 || 
    filters.gender ||
    filters.contractType
  );

  return (
    <SearchLayout>
      <SearchHeader 
        totalWorkers={totalAvailable}
        hasActiveSearch={hasActiveFilters}
        onSaveSearch={() => {/* To be implemented */}}
      />
      
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={useNewSearch}
            onChange={(e) => setUseNewSearch(e.target.checked)}
            className="form-checkbox h-4 w-4"
          />
          <span className="text-sm text-muted-foreground">
            Use new search algorithm (with scoring)
          </span>
        </label>
      </div>

      <SearchFilters 
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />
      
      <div className="mt-6 space-y-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : !hasSearched ? (
          <div className="text-center text-lg text-muted-foreground">
            Use the filters above and click Search to find workers
          </div>
        ) : displayedWorkers.length === 0 ? (
          <div>No workers found matching your criteria</div>
        ) : (
          displayedWorkers.map(worker => (
            <WorkerCard
              key={worker.id}
              worker={{
                id: worker.id,
                name: worker.full_name,
                imageUrl: worker.profile_picture_url,
                job: worker.job,
                isAvailable: worker.availability_status === true,
                experience: worker.experience || 'Not specified',
                workArea: Array.isArray(worker.location) ? worker.location[0] : worker.location || 'Not specified',
                languages: worker.languages || []
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
