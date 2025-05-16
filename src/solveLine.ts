import { hasSolution } from "hasSolution"
import { sum } from "lodash"
import type { Cell } from "types"

export const solveLine = (cells: Cell[], target: number): Cell[] => {
  const values = cells.map(c => c.value)
  const total = sum(values)

  // exclude values that are larger than target
  const exclude = values.filter(v => v > target)

  // include values that are larger than the amount that needs to be excluded
  const include = values.filter(v => v > total - target)

  const unknown = values.filter(v => !exclude.includes(v) && !include.includes(v))
  const remainingTotal = target - sum(include)

  // check each unknown value to see if (a) it must be part of the solution, or (b) cannot be part of the solution
  for (let i = 0; i < unknown.length; i++) {
    const v = unknown[i]
    const remaining = unknown.filter((_, j) => j !== i)

    // if we exclude v, can we match the target? if not, include it
    if (!hasSolution(remaining, remainingTotal)) include.push(v)
    // if we include v, can we match the target? if not, exclude it
    else if (!hasSolution(remaining, remainingTotal - v)) exclude.push(v)
  }

  return cells.map(({ value }) => ({
    value,
    state:
      include.includes(value) ? "+"
      : exclude.includes(value) ? "-"
      : "?",
  }))
}
