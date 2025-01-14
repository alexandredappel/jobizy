import { ProfileContainer, ProfileHeader, ProfileSection } from "@/layouts/ProfileLayout";
import { useAuth } from "@/contexts/AuthContext";

const BusinessProfile = () => {
  const { user } = useAuth();
  console.log('BusinessProfile: Rendering for user:', user?.id);

  return (
    <ProfileContainer type="business" mode="view">
      <ProfileHeader
        image={user?.logo_picture_url || ""}
        name={user?.company_name || ""}
        businessType={user?.business_type}
        badges={[
          { label: "Location", value: user?.location || "N/A" },
          { label: "Type", value: user?.business_type || "N/A" }
        ]}
      />

      <div className="mt-8 space-y-6">
        <ProfileSection title="About Business">
          <p className="text-muted-foreground">
            {user?.aboutBusiness || "No description available."}
          </p>
        </ProfileSection>

        <ProfileSection title="Contact Information">
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            {user?.website && (
              <p className="text-sm">
                <span className="font-medium">Website:</span> {user.website}
              </p>
            )}
          </div>
        </ProfileSection>
      </div>
    </ProfileContainer>
  );
};

export default BusinessProfile;