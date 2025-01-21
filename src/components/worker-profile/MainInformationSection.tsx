import React, { useState } from "react";
import { ProfileSection } from "@/layouts/profile/ProfileSection";
import { MainInformationEdit } from "./MainInformationEdit";
import { Badge } from "@/components/ui/badge";
import { JobType, Language, WorkArea } from "@/types/database.types";

interface MainInformationSectionProps {
  data: {
    job: JobType;
    workAreas: WorkArea[];
    languages: Language[];
    aboutMe?: string;
  };
  onUpdate: (data: {
    job: JobType;
    workAreas: WorkArea[];
    languages: Language[];
    aboutMe?: string;
  }) => Promise<void>;
}

export function MainInformationSection({
  data,
  onUpdate,
}: MainInformationSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (updatedData: typeof data) => {
    setIsLoading(true);
    try {
      await onUpdate(updatedData);
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileSection
      title="Main Information"
      onEdit={isEditing ? undefined : () => setIsEditing(true)}
    >
      {isEditing ? (
        <MainInformationEdit
          initialData={data}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          isLoading={isLoading}
        />
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Job</h4>
            <p className="font-medium">{data.job}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Work Areas
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.workAreas.map((area) => (
                <Badge key={area} variant="secondary">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Languages
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.languages.map((language) => (
                <Badge key={language} variant="secondary">
                  {language}
                </Badge>
              ))}
            </div>
          </div>

          {data.aboutMe && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                About Me
              </h4>
              <p className="text-sm text-muted-foreground">{data.aboutMe}</p>
            </div>
          )}
        </div>
      )}
    </ProfileSection>
  );
}