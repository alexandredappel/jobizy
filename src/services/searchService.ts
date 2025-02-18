
import { WorkerUser, JobType, WorkArea, Language, ContractType } from '@/types/firebase.types';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export interface SearchCriteria {
  availability?: boolean;
  job?: JobType;
  workArea?: WorkArea;
  languages?: Language[];
  gender?: 'male' | 'female';
  contractType?: ContractType;
}

export interface WorkerScore {
  total: number;
  breakdown: {
    experience: number;
    profilePicture: number;
    completeness: number;
  };
}

export interface SearchResult {
  worker: WorkerUser;
  score: WorkerScore;
  matchDetails: {
    yearsOfExperience: number;
    experienceBreakdown: Array<{
      company: string;
      years: number;
      points: number;
    }>;
    isProfileComplete: boolean;
    hasProfilePicture: boolean;
  };
}

class SearchService {
  // Phase 1: Filtrage éliminatoire
  private async applyMandatoryFilters(criteria: SearchCriteria): Promise<WorkerUser[]> {
    console.log('Applying mandatory filters with criteria:', criteria);
    
    try {
      const baseQuery = query(
        collection(db, 'users'),
        where('availability_status', '==', true)
      );

      const querySnapshot = await getDocs(baseQuery);
      let workers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WorkerUser[];

      console.log('Initial workers count:', workers.length);

      // Filtre par job (obligatoire)
      if (criteria.job) {
        workers = workers.filter(worker => 
          worker.job?.toLowerCase() === criteria.job?.toLowerCase()
        );
        console.log('After job filter:', workers.length);
      }

      // Filtre par zone de travail (obligatoire)
      if (criteria.workArea) {
        workers = workers.filter(worker => 
          Array.isArray(worker.location) && 
          worker.location.map(area => area.toLowerCase())
            .includes(criteria.workArea!.toLowerCase())
        );
        console.log('After work area filter:', workers.length);
      }

      // Filtre par langues (obligatoire)
      if (criteria.languages && criteria.languages.length > 0) {
        workers = workers.filter(worker => {
          if (!Array.isArray(worker.languages)) return false;
          const workerLanguages = worker.languages.map(lang => lang.toLowerCase());
          return criteria.languages!.every(lang => 
            workerLanguages.includes(lang.toLowerCase())
          );
        });
        console.log('After languages filter:', workers.length);
      }

      // Filtre par genre (si spécifié)
      if (criteria.gender) {
        workers = workers.filter(worker => 
          worker.gender === criteria.gender
        );
        console.log('After gender filter:', workers.length);
      }

      // Filtre par type de contrat (si spécifié)
      if (criteria.contractType) {
        workers = workers.filter(worker => 
          worker.contract_type === criteria.contractType
        );
        console.log('After contract type filter:', workers.length);
      }

      return workers;
    } catch (error) {
      console.error('Error in applyMandatoryFilters:', error);
      throw error;
    }
  }

  // Phase 2: Calcul des scores
  private calculateWorkerScore(worker: WorkerUser, jobType: JobType): SearchResult {
    console.log('Calculating score for worker:', worker.id);
    
    let score: WorkerScore = {
      total: 0,
      breakdown: {
        experience: 0,
        profilePicture: 0,
        completeness: 0
      }
    };

    // Points pour la photo de profil (10 points)
    if (worker.profile_picture_url) {
      score.breakdown.profilePicture = 10;
    }

    // Points pour le profil complet (10 points)
    const isProfileComplete = Boolean(
      worker.full_name &&
      worker.gender &&
      worker.job &&
      worker.contract_type &&
      worker.languages?.length > 0 &&
      worker.location?.length > 0
    );

    if (isProfileComplete) {
      score.breakdown.completeness = 10;
    }

    // Calcul du score total
    score.total = Object.values(score.breakdown).reduce((a, b) => a + b, 0);

    // Construction du résultat détaillé
    const result: SearchResult = {
      worker,
      score,
      matchDetails: {
        yearsOfExperience: 0, // Sera calculé avec useWorkerExperience
        experienceBreakdown: [], // Sera calculé avec useWorkerExperience
        isProfileComplete,
        hasProfilePicture: Boolean(worker.profile_picture_url)
      }
    };

    console.log('Score calculated:', score);
    return result;
  }

  // Méthode principale qui combine les deux phases
  async searchWorkers(criteria: SearchCriteria): Promise<SearchResult[]> {
    console.log('Starting worker search with criteria:', criteria);
    
    try {
      // Phase 1: Filtrage
      const filteredWorkers = await this.applyMandatoryFilters(criteria);
      console.log('Filtered workers count:', filteredWorkers.length);

      // Phase 2: Scoring et tri
      const results = filteredWorkers
        .map(worker => this.calculateWorkerScore(worker, criteria.job!))
        .sort((a, b) => b.score.total - a.score.total);

      console.log('Search completed. Results count:', results.length);
      return results;
    } catch (error) {
      console.error('Error in searchWorkers:', error);
      throw error;
    }
  }
}

export const searchService = new SearchService();
