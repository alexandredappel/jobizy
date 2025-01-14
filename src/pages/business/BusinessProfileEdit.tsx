import { ProfileContainer, ProfileHeader, ProfileSection } from "@/layouts/ProfileLayout";
import { useAuth } from "@/contexts/AuthContext";

const BusinessProfileEdit = () => {
  const { user } = useAuth();
  console.log('BusinessProfileEdit: Rendering for user:', user?.id);

  return (
    <ProfileContainer type="business" mode="edit">
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
        <ProfileSection 
          title="About Business"
          onEdit={() => console.log('Edit About Business clicked')}
        >
          <p className="text-muted-foreground">
            {user?.aboutBusiness || "No description available."}
          </p>
        </ProfileSection>

        <ProfileSection 
          title="Contact Information"
          onEdit={() => console.log('Edit Contact Information clicked')}
        >
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

export default BusinessProfileEdit;