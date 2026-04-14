/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const calculateMean = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

export const calculateStandardDeviation = (values: number[]): number => {
  if (values.length === 0) return 0;
  const mean = calculateMean(values);
  const squareDiffs = values.map((val) => Math.pow(val - mean, 2));
  const avgSquareDiff = calculateMean(squareDiffs);
  return Math.sqrt(avgSquareDiff);
};

export const isOutlier = (value: number, values: number[], threshold = 3): boolean => {
  if (values.length < 5) return false;
  const mean = calculateMean(values);
  const stdDev = calculateStandardDeviation(values);
  if (stdDev === 0) return false;
  return Math.abs(value - mean) > threshold * stdDev;
};
