import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SearchHeaderProps {
  totalWorkers: number;
  hasActiveSearch: boolean;
  onSaveSearch: () => void;
}

export function SearchHeader({ totalWorkers, hasActiveSearch, onSaveSearch }: SearchHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Available Workers</h1>
        <p className="text-sm text-muted-foreground">
          {totalWorkers} workers available in Bali
        </p>
      </div>
      {hasActiveSearch && (
        <Button
          variant="outline"
          size="sm"
          className="w-full md:w-auto"
          onClick={onSaveSearch}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Search
        </Button>
      )}
    </div>
  );
}