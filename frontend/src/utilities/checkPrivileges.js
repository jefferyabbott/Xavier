/**
 * Checks if the current user has administrator privileges
 * @returns {boolean} True if user is an administrator, false otherwise
 * @throws {Error} If stored user data is invalid JSON
 */
export default function isAdministrator() {
  try {
    // Use constant for role name to avoid typos and enable easy updates
    const ADMIN_ROLE = 'consoleAdministrator';
    
    // Get user data from storage
    const tokenStr = localStorage.getItem('user');
    
    if (!tokenStr) {
      return false;
    }
    
    // Parse user data and use optional chaining to safely access nested property
    const userData = JSON.parse(tokenStr);
    return userData?.userType === ADMIN_ROLE;
    
  } catch (error) {
    // Log error for debugging but don't expose details to caller
    console.error('Error checking administrator status:', error);
    return false;
  }
}
