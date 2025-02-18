
import { useAuth } from "@/hooks/useAuth";
import { createDashboardLayout } from "@/layouts/dashboard";
import WelcomeSection from "./components/dashboard/WelcomeSection";
import FollowUpSection from "./components/dashboard/FollowUpSection";
import RecentSearchesSection from "./components/dashboard/RecentSearchesSection";
import RemainingContactsSection from "./components/dashboard/RemainingContactsSection";
import UpgradeSection from "./components/dashboard/UpgradeSection";

const BusinessDashboard = () => {
  const { user } = useAuth();

  return createDashboardLayout(
    <div className="space-y-8">
      <WelcomeSection fullName={user?.displayName || ''} />
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2">
          <FollowUpSection />
        </div>
        <div className="space-y-8">
          <RemainingContactsSection used={5} total={10} />
          <UpgradeSection />
        </div>
      </div>

      <RecentSearchesSection />
    </div>
  );
};

export default BusinessDashboard;
