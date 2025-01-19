import { 
  createDashboardLayout, 
  DashboardGrid, 
  DashboardSection 
} from "@/layouts/dashboard";

const WorkerDashboard = () => {
  return createDashboardLayout(
    <DashboardGrid columns={{ sm: 1, md: 2, lg: 3 }}>
      <DashboardSection title="Profile Overview">
        {/* Profile content will be implemented later */}
      </DashboardSection>
      <DashboardSection title="Recent Activity">
        {/* Activity content will be implemented later */}
      </DashboardSection>
      <DashboardSection title="Job Preferences">
        {/* Preferences content will be implemented later */}
      </DashboardSection>
    </DashboardGrid>
  );
};

export default WorkerDashboard;