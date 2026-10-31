/**
 * Validation limits shared between client (Zod) and server (mock)
 * Single source of truth for all validation rules
 */

export const limits = {
  title: { min: 3, max: 80 },
  description: { min: 10, max: 1000 },
  photos: { max: 3 },
  approxDate: { future: false },
  comment: { min: 1, max: 500 },
  claimMessage: { min: 10, max: 500 },
  reportReason: { min: 5, max: 300 },
  displayName: { min: 3, max: 50 },
} as const;

export type Limits = typeof limits;