
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { JobType, Language, WorkArea, ContractType } from "@/types/firebase.types";
import { CheckboxDropdown } from "@/components/ui/checkbox-dropdown";

interface SearchFiltersProps {
  onFilterChange?: (filterType: string, value: any) => void;
  onSearch: () => void;
}

export function SearchFilters({ onFilterChange, onSearch }: SearchFiltersProps) {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const handleLanguagesChange = (values: string[]) => {
    setSelectedLanguages(values);
    onFilterChange?.('languages', values);
  };

  const languageOptions = [
    { label: "English", value: "English" },
    { label: "Bahasa", value: "Bahasa" }
  ];

  return (
    <div className="space-y-6">
      {/* Job Type */}
      <div className="space-y-2">
        <Label>Job Type</Label>
        <Select onValueChange={(value) => onFilterChange?.('job', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select job type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Waiter">Waiter</SelectItem>
            <SelectItem value="Cook">Cook</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="Housekeeper">Housekeeper</SelectItem>
            <SelectItem value="Gardener">Gardener</SelectItem>
            <SelectItem value="Pool guy">Pool Guy</SelectItem>
            <SelectItem value="Bartender">Bartender</SelectItem>
            <SelectItem value="Seller">Seller</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Work Area */}
      <div className="space-y-2">
        <Label>Work Area</Label>
        <Select onValueChange={(value) => onFilterChange?.('workArea', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Seminyak">Seminyak</SelectItem>
            <SelectItem value="Kuta">Kuta</SelectItem>
            <SelectItem value="Canggu">Canggu</SelectItem>
            <SelectItem value="Ubud">Ubud</SelectItem>
            <SelectItem value="Uluwatu">Uluwatu</SelectItem>
            <SelectItem value="Denpasar">Denpasar</SelectItem>
            <SelectItem value="Sanur">Sanur</SelectItem>
            <SelectItem value="Jimbaran">Jimbaran</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contract Type */}
      <div className="space-y-2">
        <Label>Contract Type</Label>
        <Select onValueChange={(value) => onFilterChange?.('contractType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select contract type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="part_time">Part Time</SelectItem>
            <SelectItem value="full_time">Full Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Languages */}
      <div className="space-y-2">
        <Label>Languages</Label>
        <CheckboxDropdown
          options={languageOptions}
          selected={selectedLanguages}
          onChange={handleLanguagesChange}
          placeholder="Select languages"
        />
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label>Gender</Label>
        <Select onValueChange={(value) => onFilterChange?.('gender', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        className="w-full mt-6" 
        onClick={onSearch}
      >
        Search
      </Button>
    </div>
  );
}
