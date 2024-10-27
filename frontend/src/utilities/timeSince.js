const TIME_DIVISIONS = [
  { amount: 31536000, name: 'year' },
  { amount: 2592000, name: 'month' },
  { amount: 86400, name: 'day' },
  { amount: 3600, name: 'hour' },
  { amount: 60, name: 'minute' },
  { amount: 1, name: 'second' }
];

/**
 * Formats a Unix timestamp (in milliseconds) into a human-readable time-ago string
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @param {Object} options - Formatting options
 * @param {boolean} options.addAgo - Whether to append "ago" to the result (default: true)
 * @param {boolean} options.maxPrecision - Maximum number of units to show (default: 1)
 * @returns {string} Formatted time string
 */
export default function timeSince(timestamp, options = {}) {
  const {
    addAgo = true,
    maxPrecision = 1
  } = options;

  // Calculate seconds difference
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  
  // Handle very recent times
  if (seconds === 0) {
    return 'just now';
  }

  // Find all applicable time divisions
  const parts = [];
  let remainingSeconds = seconds;

  for (const division of TIME_DIVISIONS) {
    if (parts.length >= maxPrecision) break;
    
    const value = Math.floor(remainingSeconds / division.amount);
    if (value >= 1) {
      parts.push({
        value,
        unit: pluralize(division.name, value)
      });
      remainingSeconds %= division.amount;
    }
  }

  // Format the string
  const timeString = parts
    .map(({ value, unit }) => `${value} ${unit}`)
    .join(', ');

  return addAgo ? `${timeString} ago` : timeString;
}

/**
 * Pluralizes a word based on count
 * @param {string} word - Word to potentially pluralize
 * @param {number} count - Count determining pluralization
 * @returns {string} Pluralized or singular word
 */
function pluralize(word, count) {
  return count === 1 ? word : `${word}s`;
}
