/**
 * Indian Number Formatting and Currency Utilities
 */

export const INDIAN_STATES = [
  { code: '27', name: 'Maharashtra' },
  { code: '24', name: 'Gujarat' },
  { code: '29', name: 'Karnataka' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '07', name: 'Delhi' },
  { code: '09', name: 'Uttar Pradesh' },
  { code: '06', name: 'Haryana' },
  { code: '08', name: 'Rajasthan' },
  { code: '23', name: 'Madhya Pradesh' },
  { code: '19', name: 'West Bengal' },
  { code: '28', name: 'Andhra Pradesh' },
  { code: '36', name: 'Telangana' },
  { code: '32', name: 'Kerala' },
  { code: '21', name: 'Odisha' },
  { code: '10', name: 'Bihar' },
  { code: '20', name: 'Jharkhand' },
  { code: '22', name: 'Chhattisgarh' },
  { code: '03', name: 'Punjab' },
  { code: '02', name: 'Himachal Pradesh' },
  { code: '05', name: 'Uttarakhand' },
  { code: '30', name: 'Goa' },
  { code: '04', name: 'Chandigarh' },
  { code: '01', name: 'Jammu & Kashmir' },
  { code: '11', name: 'Sikkim' },
  { code: '18', name: 'Assam' },
] as const;

/**
 * Format a number into the Indian numbering system: 1,25,000.00
 */
export function formatIndianNumber(value: number, includeDecimals = true): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '0.00';
  }

  const isNegative = value < 0;
  const absValue = Math.abs(value);
  
  const parts = absValue.toFixed(2).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  // Indian numbering pattern: last 3 digits, then groups of 2 digits
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);

  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }

  const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  const result = includeDecimals ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  return isNegative ? `-${result}` : result;
}

/**
 * Format as Indian Currency with ₹ symbol
 */
export function formatIndianCurrency(amount: number, includeDecimals = true): string {
  return `₹${formatIndianNumber(amount, includeDecimals)}`;
}

/**
 * Format date string (YYYY-MM-DD) to DD-MMM-YYYY or DD/MM/YYYY
 */
export function formatDateIndian(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(month, 10) - 1;
    return `${day} ${months[monthIndex] || month} ${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Converts a number to words in the Indian numbering system (Lakhs, Crores)
 * e.g., 125450.50 => "One Lakh Twenty-Five Thousand Four Hundred Fifty Rupees and Fifty Paise Only"
 */
export function numberToWordsIndian(amount: number): string {
  if (amount === 0) return 'Zero Rupees Only';

  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n: number): string {
    if (n === 0) return '';
    if (n < 10) return units[n];
    if (n >= 10 && n < 20) return teens[n - 10];
    const ten = Math.floor(n / 10);
    const unit = n % 10;
    return `${tens[ten]}${unit > 0 ? ' ' + units[unit] : ''}`;
  }

  function convertThreeDigits(n: number): string {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let str = '';
    if (hundred > 0) {
      str += `${units[hundred]} Hundred`;
      if (rest > 0) str += ' and ';
    }
    if (rest > 0) {
      str += convertTwoDigits(rest);
    }
    return str;
  }

  const roundedAmount = Math.abs(amount);
  const rupees = Math.floor(roundedAmount);
  const paise = Math.round((roundedAmount - rupees) * 100);

  let rupeesStr = '';

  const crore = Math.floor(rupees / 10000000);
  let remainder = rupees % 10000000;

  const lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;

  const thousand = Math.floor(remainder / 1000);
  remainder = remainder % 1000;

  const hundredAndBelow = remainder;

  if (crore > 0) {
    rupeesStr += `${convertTwoDigits(crore)} Crore `;
  }
  if (lakh > 0) {
    rupeesStr += `${convertTwoDigits(lakh)} Lakh `;
  }
  if (thousand > 0) {
    rupeesStr += `${convertTwoDigits(thousand)} Thousand `;
  }
  if (hundredAndBelow > 0) {
    rupeesStr += convertThreeDigits(hundredAndBelow);
  }

  rupeesStr = rupeesStr.trim();
  if (!rupeesStr) {
    rupeesStr = 'Zero';
  }

  let result = `${rupeesStr} Rupees`;

  if (paise > 0) {
    result += ` and ${convertTwoDigits(paise)} Paise`;
  }

  return `${result} Only`;
}
