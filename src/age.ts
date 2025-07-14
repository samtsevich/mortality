export function calculateAge(dob: Date): string {
  const now = new Date();
  const duration = now.getTime() - dob.getTime();
  const years = duration / 31556900000;
  const majorMinor = years.toFixed(9).toString().split(".");

  return `${majorMinor[0]}.${majorMinor[1]}`;
}
