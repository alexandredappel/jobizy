import DashboardContainer from "@/components/Layout/DashboardContainer";
import DashboardGrid from "@/components/Layout/DashboardGrid";
import DashboardSection from "@/components/Layout/DashboardSection";
import WelcomeSection from "./components/WelcomeSection";
import AvailabilitySection from "./components/AvailabilitySection";
import ProfileCompletionSection from "./components/ProfileCompletionSection";
import RecentMessagesSection from "./components/RecentMessagesSection";
import { useAuth } from "@/contexts/AuthContext";

const WorkerDashboard = () => {
  const { user } = useAuth();
  
  return (
    <DashboardContainer>
      <DashboardSection title="Welcome">
        <WelcomeSection userName={user?.firstName || 'Worker'} />
      </DashboardSection>
      
      <DashboardGrid columns={{ sm: 1, md: 2, lg: 2 }}>
        <DashboardSection title="Availability Status">
          <AvailabilitySection />
        </DashboardSection>
        
        <DashboardSection title="Complete Your Profile">
          <ProfileCompletionSection />
        </DashboardSection>
        
        <DashboardSection 
          title="Recent Messages"
          className="md:col-span-2"
        >
          <RecentMessagesSection />
        </DashboardSection>
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default WorkerDashboard;