import { describe, it, expect } from 'vitest'
import { combinations } from 'combinations'

describe('combinations', () => {
  const testCases = [
    {
      name: 'all combinations of an array',
      values: [1, 2, 3],
      expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]
    },
    {
      name: 'all combinations of an array with duplicates',
      values: [1, 2, 2],
      expected: [[], [1], [2], [2], [1, 2], [1, 2], [2, 2], [1, 2, 2]]
    },
    {
      name: 'all combinations of an empty array',
      values: [] as number[],
      expected: [[]] as number[][]
    }
  ]

  testCases.forEach(({ name, values, expected }) => {
    it('name', () =>
      expect(Array.from(combinations(values)).sort(arraySort)).toEqual(
        expected
      ))
  })
})

const arraySort = (a: number[], b: number[]): number =>
  a.length - b.length || a[0] - b[0]
