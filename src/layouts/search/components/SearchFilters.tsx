import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SearchFiltersProps {
  onFilterChange: (filterType: string, value: any) => void;
}

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Job Type */}
      <div className="space-y-2">
        <Label>Job Type</Label>
        <Select onValueChange={(value) => onFilterChange('jobType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select job type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="waiter">Waiter</SelectItem>
            <SelectItem value="cook">Cook</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="housekeeper">Housekeeper</SelectItem>
            <SelectItem value="gardener">Gardener</SelectItem>
            <SelectItem value="bartender">Bartender</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Work Area */}
      <div className="space-y-2">
        <Label>Work Area</Label>
        <Select onValueChange={(value) => onFilterChange('workArea', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seminyak">Seminyak</SelectItem>
            <SelectItem value="canggu">Canggu</SelectItem>
            <SelectItem value="ubud">Ubud</SelectItem>
            <SelectItem value="kuta">Kuta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Languages */}
      <div className="space-y-4">
        <Label>Languages</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="english" onCheckedChange={(checked) => 
              onFilterChange('languages', { language: 'english', checked })
            } />
            <Label htmlFor="english">English</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="bahasa" onCheckedChange={(checked) => 
              onFilterChange('languages', { language: 'bahasa', checked })
            } />
            <Label htmlFor="bahasa">Bahasa</Label>
          </div>
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label>Gender</Label>
        <Select onValueChange={(value) => onFilterChange('gender', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}