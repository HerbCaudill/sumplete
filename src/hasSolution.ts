import { combinations } from "combinations"
import { sum } from "lodash"

/**
 * Is there a subset of these values that sum to the target?
 */
export function hasSolution(values: number[], target: number): boolean {
  const total = sum(values)
  if (total < target) return false
  if (total === target) return true

  // try every combination of values
  for (const combination of combinations(values)) {
    if (sum(combination) === target) return true
  }
  return false
}
