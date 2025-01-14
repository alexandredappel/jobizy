import { ProfileContainer, ProfileHeader, ProfileSection } from "@/layouts/ProfileLayout";
import { useAuth } from "@/contexts/AuthContext";

const WorkerProfile = () => {
  const { user } = useAuth();
  console.log('WorkerProfile: Rendering for user:', user?.id);

  return (
    <ProfileContainer type="worker" mode="view">
      <ProfileHeader
        image={user?.profile_picture_url || ""}
        name={`${user?.firstName || ''} ${user?.lastName || ''}`}
        role={user?.job}
        isAvailable={user?.availability_status}
        badges={[
          { label: "Experience", value: "2 years" },
          { label: "Languages", value: user?.languages?.join(", ") || "N/A" }
        ]}
      />

      <div className="mt-8 space-y-6">
        <ProfileSection title="About Me">
          <p className="text-muted-foreground">{user?.aboutMe || "No description available."}</p>
        </ProfileSection>

        <ProfileSection title="Work Areas">
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

export default WorkerProfile;