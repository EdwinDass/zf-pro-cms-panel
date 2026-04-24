// RBAC Configuration - Role-based module access

// Map module IDs to their routes
export const moduleRoutes: Record<string, string[]> = {
  dashboard: ["/dashboard"],
  "qr-management": ["/qr"],
  communication: ["/communication"],
  "mis-analytics": ["/mis-analytics", "/reports"],
  "role-management": ["/role-management"],
  process: ["/process-management"],
  tickets: ["/tickets"],
  members: ["/members-management"],
  faqs: ["/faqs"],
  assets: ["/assets-management"],
  "amazon-marketplace": ["/amazon-marketplace"],
  surveys: ["/survey-questions", "/survey-responses"],
  "survey-questions": ["/survey-questions"],
  "survey-responses": ["/survey-responses"],
  "sku-management": ["/categories", "/categories/:categoryId/subcategories", "/subcategories/:subcategoryId/skus"],
  integrations: ["/integrations"],
  "delete-account": ["/delete-account"],
};

const allModules = Object.keys(moduleRoutes);

// Define which modules are accessible by each role
export const roleModuleAccess: Record<number, string[]> = {
  1:allModules,// mechanic
  2: allModules, // regional_manager
  3: allModules, // call_centre_executive
  4: allModules, // marketing_manager
  5: allModules, // operator
  6: allModules, // viewer
  7: allModules, // qr_admin
  8: allModules, // evolve_admin
  9: allModules, // client_admin
};

// Get allowed routes for a specific roleId
export const getAllowedRoutes = (roleId: number | string | null | undefined): string[] => {
  if (!roleId) return [];
  
  const roleIdNum = Number(roleId);
  const allowedModules = roleModuleAccess[roleIdNum] || [];
  
  const allowedRoutes: string[] = [];
  allowedModules.forEach(moduleId => {
    const routes = moduleRoutes[moduleId];
    if (routes) {
      allowedRoutes.push(...routes);
    }
  });

  return allowedRoutes;
};

// Get allowed modules for a specific roleId
export const getAllowedModules = (roleId: number | string | null | undefined): string[] => {
  if (!roleId) return [];
  const roleIdNum = Number(roleId);
  return roleModuleAccess[roleIdNum] || [];
};

