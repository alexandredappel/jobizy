import DashboardContainer from "@/components/Layout/DashboardContainer";
import DashboardGrid from "@/components/Layout/DashboardGrid";
import DashboardSection from "@/components/Layout/DashboardSection";
import WelcomeSection from "./components/WelcomeSection";
import FollowUpSection from "./components/FollowUpSection";
import RecentSearchesSection from "./components/RecentSearchesSection";
import ContactCreditsSection from "./components/ContactCreditsSection";
import UpgradeSection from "./components/UpgradeSection";
import RecentMessagesSection from "../worker/components/RecentMessagesSection";
import { useAuth } from "@/contexts/AuthContext";

const BusinessDashboard = () => {
  const { user } = useAuth();
  
  return (
    <DashboardContainer>
      <DashboardSection>
        <WelcomeSection businessName={user?.company_name || 'Business'} />
      </DashboardSection>
      
      <DashboardGrid columns={{ sm: 1, md: 2, lg: 3 }}>
        <DashboardSection 
          title="Follow Up"
          className="lg:col-span-2"
        >
          <FollowUpSection />
        </DashboardSection>
        
        <DashboardSection title="Contact Credits">
          <ContactCreditsSection />
        </DashboardSection>
        
        <DashboardSection title="Recent Searches">
          <RecentSearchesSection />
        </DashboardSection>
        
        <DashboardSection title="Recent Messages">
          <RecentMessagesSection />
        </DashboardSection>
        
        <DashboardSection title="Premium Features">
          <UpgradeSection />
        </DashboardSection>
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default BusinessDashboard;