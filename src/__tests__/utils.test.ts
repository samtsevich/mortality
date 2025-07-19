import { calculateMortality } from "../utils";

describe("calculateMortality", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-01-01T12:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should calculate mortality correctly for a person born 30 years ago", () => {
    const dob = new Date("1995-01-01T12:00:00.000Z");
    const result = calculateMortality(dob);

    expect(result).toMatch(/^30\.\d{6}$/);
  });

  it("should calculate mortality correctly for a person born 1 year ago", () => {
    const dob = new Date("2024-01-01T12:00:00.000Z");
    const result = calculateMortality(dob);

    expect(result).toMatch(/^1\.\d{6}$/);
  });

  it("should handle newborn (born today)", () => {
    const dob = new Date("2025-01-01T12:00:00.000Z");
    const result = calculateMortality(dob);

    expect(result).toBe("0.000000");
  });

  it("should return precise decimal places", () => {
    const dob = new Date("2020-01-01T12:00:00.000Z");
    const result = calculateMortality(dob);

    const decimalPart = result.split(".")[1];
    expect(decimalPart).toHaveLength(6);
  });
});
