/**
 * Application-wide constants
 */

export const DEFAULT_POLLING_INTERVAL_MS = 150000;

export const POLLING_INTERVALS = {
  /** 10 minutes - default polling interval */
  DEFAULT: 150000,
  /** 10 seconds - for frequent updates */
  FREQUENT: 10000,
  /** 30 seconds - for moderate updates */
  MODERATE: 30000,
  /** 1 minute - for less frequent updates */
  MINUTE: 60000,
  /** 5 minutes - for periodic updates */
  PERIODIC: 300000,
} as const;
