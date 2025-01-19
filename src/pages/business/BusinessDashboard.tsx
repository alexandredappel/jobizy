import { 
  createDashboardLayout, 
  DashboardGrid, 
  DashboardSection 
} from "@/layouts/dashboard";

const BusinessDashboard = () => {
  return createDashboardLayout(
    <DashboardGrid columns={{ sm: 1, md: 2, lg: 3 }}>
      <DashboardSection title="Business Overview">
        Overview content will be implemented later
      </DashboardSection>
      <DashboardSection title="Recent Searches">
        Searches content will be implemented later
      </DashboardSection>
      <DashboardSection title="Account Status">
        Status content will be implemented later
      </DashboardSection>
    </DashboardGrid>
  );
};

export default BusinessDashboard;