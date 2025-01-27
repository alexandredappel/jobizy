import React from 'react';
import DashboardContainer from './DashboardContainer';
import DashboardGrid from './DashboardGrid';
import DashboardSection from './DashboardSection';
import DashboardSectionHeader from './DashboardSectionHeader';

// Export all components
export { default as DashboardContainer } from './DashboardContainer';
export { default as DashboardGrid } from './DashboardGrid';
export { default as DashboardSection } from './DashboardSection';
export { default as DashboardSectionHeader } from './DashboardSectionHeader';

// Helper for consistent layout structure
export const createDashboardLayout = (children: React.ReactNode) => (
  <div className="min-h-screen bg-sand">
    <DashboardContainer>
      <div className="mb-20 lg:mb-0">
        {children}
      </div>
    </DashboardContainer>
  </div>
);
