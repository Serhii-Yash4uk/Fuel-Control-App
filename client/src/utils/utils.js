import { hasRole } from './permissionsUtils';

export const getDynamicPath = (role) =>
  hasRole(role, ['admin']) ? '/admin-panel' : '/';

export const getVisibleNavLinks = (role, allNavLinks) => {
  if (role === 'fueler') {
    return allNavLinks.filter(({ path }) => path !== '/accounting-report');
  }
  if (role === 'accountant') {
    return allNavLinks.filter(({ path }) => path !== '/');
  }
  return allNavLinks;
};
