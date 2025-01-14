import { useState } from "react";
import { SearchLayout } from "@/layouts/SearchLayout/SearchLayout";
import { SearchHeader } from "@/layouts/SearchLayout/SearchHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { mockUsers } from "@/services/mocks/data/mockData";
import { UserProfile } from "@/types/database.types";

const WorkerCardContent = ({ worker }: { worker: UserProfile }) => (
  <CardContent className="flex items-center gap-4 p-6">
    <Avatar className="h-16 w-16">
      <AvatarImage src={worker.profile_picture_url} alt={worker.firstName} />
      <AvatarFallback>{worker.firstName?.[0]}</AvatarFallback>
    </Avatar>

    <div className="flex-1">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg">{`${worker.firstName} ${worker.lastName}`}</h3>
          <p className="text-sm text-muted-foreground">{worker.job}</p>
        </div>
        {worker.availability_status && (
          <Badge variant="secondary">Available Now</Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {worker.languages?.map(lang => (
          <Badge key={lang} variant="outline">{lang}</Badge>
        ))}
        {worker.workAreas?.map(area => (
          <Badge key={area} variant="outline">{area}</Badge>
        ))}
      </div>
    </div>

    <div className="flex gap-2">
      <Button variant="outline" size="icon">
        <MessageSquare className="h-4 w-4" />
      </Button>
      <Button>See Profile</Button>
    </div>
  </CardContent>
);

const Search = () => {
  const [filteredWorkers] = useState(mockUsers.filter(user => user.role === 'worker'));
  const totalWorkers = filteredWorkers.length;
  const hasActiveSearch = false;
  
  const handleSaveSearch = () => {
    console.log('Save search clicked');
  };

  return (
    <SearchLayout>
      <SearchHeader
        totalWorkers={totalWorkers}
        hasActiveSearch={hasActiveSearch}
        onSaveSearch={handleSaveSearch}
      />
      <div className="space-y-4">
        {filteredWorkers.map((worker) => (
          <Card key={worker.id}>
            <WorkerCardContent worker={worker} />
          </Card>
        ))}
      </div>
    </SearchLayout>
  );
};

export default Search;