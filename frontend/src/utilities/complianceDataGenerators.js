/**
 * Safely accesses nested object properties using a dot-notation path
 * @param {Object} obj - The object to traverse
 * @param {string} path - Dot-notation path (e.g., 'a.b.c')
 * @returns {*} The value at the path or undefined if not found
 */
const getNestedValue = (obj, path) => {
  try {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  } catch (error) {
    console.error(`Error accessing path ${path}:`, error);
    return undefined;
  }
};

/**
 * Counts boolean values in a dataset based on a specified property path
 * @param {Array} data - Array of objects to analyze
 * @param {string} target - Dot-notation path to the boolean property
 * @returns {Object} Count of true/false values
 */
function generateBooleanComplianceData(data = [], target) {
  if (!Array.isArray(data) || !target) {
    console.error('Invalid input to generateBooleanComplianceData');
    return { true: 0, false: 0 };
  }

  return data.reduce((counts, item) => {
    const value = Boolean(getNestedValue(item, target));
    counts[value] += 1;
    return counts;
  }, { true: 0, false: 0 });
}

/**
 * Counts devices with/without a specific profile installed
 * @param {Array} data - Array of device data
 * @param {string} target - Profile display name to search for
 * @returns {Object} Count of devices with/without the profile
 */
function generateProfileInstalledData(data = [], target) {
  if (!Array.isArray(data) || !target) {
    console.error('Invalid input to generateProfileInstalledData');
    return { true: 0, false: 0 };
  }

  return data.reduce((counts, item) => {
    const hasProfile = item.Profiles?.some(
      profile => profile.PayloadDisplayName === target
    );
    counts[hasProfile] += 1;
    return counts;
  }, { true: 0, false: 0 });
}

/**
 * Generates OS version distribution data
 * @param {Array} data - Array of device data
 * @returns {Array} Array of version counts
 */
function generateOSVersionComplianceData(data = []) {
  if (!Array.isArray(data)) {
    console.error('Invalid input to generateOSVersionComplianceData');
    return [];
  }

  const versionCount = data.reduce((counts, item) => {
    const version = getNestedValue(item, 'QueryResponses.OSVersion');
    if (version) {
      counts.set(version, (counts.get(version) || 0) + 1);
    }
    return counts;
  }, new Map());

  return Array.from(versionCount, ([version, count]) => ({
    version,
    count
  }));
}

/**
 * Generates application version distribution data
 * @param {Array} data - Array of device data
 * @param {string} target - Application name to analyze
 * @returns {Array} Array of version counts
 */
function generateAppVersionComplianceData(data = [], target) {
  if (!Array.isArray(data) || !target) {
    console.error('Invalid input to generateAppVersionComplianceData');
    return [];
  }

  const versionCount = data.reduce((counts, item) => {
    const targetApp = item.Applications?.find(app => app.Name === target);
    if (targetApp?.Version) {
      counts.set(
        targetApp.Version,
        (counts.get(targetApp.Version) || 0) + 1
      );
    }
    return counts;
  }, new Map());

  return Array.from(versionCount, ([version, count]) => ({
    version,
    count
  }));
}

/**
 * Type definitions for better IDE support and documentation
 * @typedef {Object} ComplianceCount
 * @property {number} true - Count of true values
 * @property {number} false - Count of false values
 * 
 * @typedef {Object} VersionCount
 * @property {string} version - Version string
 * @property {number} count - Number of devices with this version
 */

export {
  generateBooleanComplianceData,
  generateProfileInstalledData,
  generateOSVersionComplianceData,
  generateAppVersionComplianceData
};
