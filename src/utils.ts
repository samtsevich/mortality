export function calculateMortality(dob: Date): string {
  const now = new Date();
  const duration = now.getTime() - dob.getTime();
  const years = duration / 31556900000; // milliseconds in a year (365.24 days)

  // Format with high precision and add commas for readability
  const formattedYears = years.toFixed(6);
  const [wholePart, decimalPart] = formattedYears.split(".");

  // Add commas to the whole number part
  const wholeWithCommas = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `${wholeWithCommas}.${decimalPart}`;
}
