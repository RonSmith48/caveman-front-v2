/**
 * Converts an SHKEY string to a readable date and shift format.
 * @param {string} shkey - The 10-character SHKEY string.
 * @returns {string} - The formatted date and shift (e.g., "14-12-2024 NS").
 * @throws {Error} - Throws an error if the input is invalid.
 */
export function shkeyToShift(shkey) {
  if (!shkey || shkey.length !== 10) {
    throw new Error('Invalid input: The input string must be exactly 10 characters long.');
  }

  const year = shkey.slice(0, 4);
  const month = shkey.slice(4, 6);
  const day = shkey.slice(6, 8);
  const finalDigit = shkey[9];

  let formattedDate = `${day}-${month}-${year} `;

  if (finalDigit === '2') {
    formattedDate += 'NS'; // Night Shift
  } else {
    formattedDate += 'DS'; // Day Shift
  }

  return formattedDate;
}

/**
 * Converts a YYYY-MM-DD or DD-MM-YYYY formatted date to DD-MM-YYYY format.
 * @param {string} dateStr - The date string in YYYY-MM-DD or DD-MM-YYYY format.
 * @returns {string} - The formatted date in DD-MM-YYYY.
 */
export function formatDateToDDMMYYYY(dateStr) {
  if (!dateStr || dateStr.length !== 10) {
    throw new Error('Invalid input: The date string must be exactly 10 characters long.');
  }

  const isISOFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateStr); // Check for YYYY-MM-DD
  const isEuropeanFormat = /^\d{2}-\d{2}-\d{4}$/.test(dateStr); // Check for DD-MM-YYYY

  if (isISOFormat) {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  } else if (isEuropeanFormat) {
    return dateStr; // Already in DD-MM-YYYY format
  } else {
    throw new Error('Invalid input: The date string is not in a recognized format.');
  }
}

/**
 * Determines the format of the input string and converts it to DD-MM-YYYY with or without shift.
 * @param {string} input - The input string in SHKEY, YYYY-MM-DD, or DD-MM-YYYY format.
 * @returns {string} - The formatted date in DD-MM-YYYY with shift (if applicable) or just DD-MM-YYYY.
 */
export function formatToShift(input) {
  if (!input) {
    return ''; // Return empty string for null/undefined input
  }

  try {
    if (input.length === 10 && /^\d{4}[01]\d[0-3]\dP[12]$/.test(input)) {
      // Check if input matches SHKEY format (YYYYMMDDP#)
      return shkeyToShift(input);
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(input) || /^\d{2}-\d{2}-\d{4}$/.test(input)) {
      // Check for YYYY-MM-DD or DD-MM-YYYY format
      return formatDateToDDMMYYYY(input);
    } else {
      throw new Error('Input format not recognized.');
    }
  } catch (error) {
    console.error('Error formatting input:', input, error.message);
    return input; // Return original input if formatting fails
  }
}
