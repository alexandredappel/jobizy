import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";

const RecentSearchesSection = () => {
  const searches = [
    {
      id: 1,
      role: "Waiter",
      filters: ["Seminyak", "English", "1+ year exp"],
      results: 24,
    },
    {
      id: 2,
      role: "Chef",
      filters: ["Canggu", "Available now"],
      results: 12,
    },
    {
      id: 3,
      role: "Bartender",
      filters: ["Kuta", "2+ years exp"],
      results: 18,
    },
  ];

  return (
    <div className="space-y-4">
      {searches.map((search) => (
        <div
          key={search.id}
          className="p-4 border rounded-lg hover:border-primary transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium">{search.role}</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {search.filters.map((filter) => (
                  <span
                    key={filter}
                    className="px-2 py-1 text-xs bg-accent/10 rounded-full"
                  >
                    {filter}
                  </span>
                ))}
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">
              {search.results} candidates found
            </span>
            <Button variant="link" size="sm" className="text-primary p-0">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentSearchesSection;