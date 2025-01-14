import { SearchLayout } from "@/layouts/SearchLayout/SearchLayout";
import { SearchHeader } from "@/layouts/SearchLayout/SearchHeader";

const Search = () => {
  // Will be replaced with real data later
  const totalWorkers = 0;
  const hasActiveSearch = false;
  
  const handleSaveSearch = () => {
    // Will be implemented later
    console.log('Save search clicked');
  };

  return (
    <SearchLayout>
      <SearchHeader
        totalWorkers={totalWorkers}
        hasActiveSearch={hasActiveSearch}
        onSaveSearch={handleSaveSearch}
      />
      {/* Worker results will be added here later */}
    </SearchLayout>
  );
};

export default Search;