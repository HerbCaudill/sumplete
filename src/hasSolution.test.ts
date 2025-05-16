import { describe, expect, it } from 'vitest'
import { hasSolution } from './hasSolution'

describe('hasSolution', () => {
  const testCases = [
    { values: [1, 2], target: 3, expected: true },

    { values: [1, 2, 3], target: 7, expected: false },
    { values: [1, 2, 3], target: 6, expected: true },
    { values: [1, 2, 3], target: 5, expected: true },
    { values: [1, 2, 3], target: 4, expected: true },
    { values: [1, 2, 3], target: 3, expected: true },
    { values: [1, 2, 3], target: 2, expected: true },
    { values: [1, 2, 3], target: 1, expected: true },
    { values: [1, 2, 3], target: 0, expected: true },

    { values: [7, 8, 9], target: 1, expected: false },

    { values: [2, 2, 6, 4, 8], target: 11, expected: false },
    { values: [5, 8, 8, 2, 2, 6], target: 28, expected: false }
  ]

  testCases.forEach(({ values, target, expected }) => {
    it(`${values.join()} (${target}) ${expected}`, () => {
      expect(hasSolution(values, target)).toBe(expected)
    })
  })
})
