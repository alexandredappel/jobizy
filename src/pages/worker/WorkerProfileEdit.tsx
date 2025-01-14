import { ProfileContainer, ProfileHeader, ProfileSection } from "@/layouts/ProfileLayout";
import { useAuth } from "@/contexts/AuthContext";

const WorkerProfileEdit = () => {
  const { user } = useAuth();
  console.log('WorkerProfileEdit: Rendering for user:', user?.id);

  return (
    <ProfileContainer type="worker" mode="edit">
      <ProfileHeader
        image={user?.profile_picture_url || ""}
        name={`${user?.firstName || ''} ${user?.lastName || ''}`}
        role={user?.job}
        isAvailable={user?.availability_status}
        badges={[
          { label: "Experience", value: "2 years" },
          { label: "Languages", value: user?.languages?.join(", ") || "N/A" }
        ]}
        onAvailabilityChange={(value) => {
          console.log('Availability changed to:', value);
          // Implementation for availability toggle will be added later
        }}
      />

      <div className="mt-8 space-y-6">
        <ProfileSection 
          title="About Me"
          onEdit={() => console.log('Edit About Me clicked')}
        >
          <p className="text-muted-foreground">{user?.aboutMe || "No description available."}</p>
        </ProfileSection>

        <ProfileSection 
          title="Work Areas"
          onEdit={() => console.log('Edit Work Areas clicked')}
        >
          <div className="flex flex-wrap gap-2">
            {user?.workAreas?.map((area) => (
              <span key={area} className="px-2 py-1 bg-accent/10 rounded-md text-sm">
                {area}
              </span>
            ))}
          </div>
        </ProfileSection>
      </div>
    </ProfileContainer>
  );
};

export default WorkerProfileEdit;