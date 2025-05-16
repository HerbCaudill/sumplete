import { describe, it, expect } from "vitest"
import { solveLine } from "./solveLine"
import type { Cell } from "types"

describe("solveLine", () => {
  // prettier-ignore
  const testCases = [
    { values: [],             target: 0,  expected: "" },
    { values: [1,2],          target: 3,  expected: "+ +" },
    { values: [3,2,1],        target: 3,  expected: "? ? ?" },
    { values: [7,3,2,1],      target: 3,  expected: "- ? ? ?" },
    { values: [22,1,2,3],     target: 25, expected: "+ ? ? ?" },
    { values: [3,4,5,3,4,3],  target: 7,  expected: "? ? - ? ? ?" },
    { values: [5,6,7],        target: 11, expected: "+ + -" },
  ]

  for (const { values, target, expected } of testCases) {
    it(`[${values.join()}] (${target})`, () => {
      const cells: Cell[] = values.map(value => ({ value, state: "?" }))
      const result = solveLine(cells, target)
      expect(result.map(cell => cell.state)).toEqual(expected.split(/\s*/))
    })
  }
})
