import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

interface RecentSearch {
  id: string;
  timestamp: Date;
  criteria: {
    job?: string;
    areas?: string[];
    languages?: string[];
  };
}

const RecentSearchesSection = () => {
  const navigate = useNavigate();

  const { data: recentSearches, isLoading } = useQuery({
    queryKey: ['recentSearches'],
    queryFn: async () => {
      // This will be implemented in the userService
      return [];
    },
  });

  const handleSearchClick = (search: RecentSearch) => {
    // Navigate to search page with criteria
    navigate('/business/search', { state: { criteria: search.criteria } });
  };

  if (isLoading) {
    return <div>Loading recent searches...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Searches</h2>
      {(!recentSearches || recentSearches.length === 0) ? (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No recent searches yet. Start searching for workers to see your history here.</p>
            <Button onClick={() => navigate('/business/search')}>
              Start Searching
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentSearches.map((search) => (
            <Card key={search.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleSearchClick(search)}>
              <div className="space-y-2">
                <p className="font-medium">{search.criteria.job || 'All Jobs'}</p>
                <p className="text-sm text-muted-foreground">
                  {search.criteria.areas?.join(', ') || 'All Areas'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {search.timestamp.toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentSearchesSection;