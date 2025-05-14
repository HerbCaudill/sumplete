import { describe, expect, it } from 'vitest'
import { hasUniqueSolution, solve, type PuzzleForSolver } from './solve'

// Helper function to create a PuzzleState for testing
const createTestPuzzle = ({
  values,
  rowTargets,
  colTargets
}: {
  values: number[][]
  rowTargets: number[]
  colTargets: number[]
}): PuzzleForSolver => {
  const size = values.length

  // Create rows with Cell objects
  const rows = values.map((rowValues, rowIndex) =>
    rowValues.map((value, colIndex) => ({
      row: rowIndex,
      col: colIndex,
      value,
      included: false,
      state: 'EMPTY' as const
    }))
  )

  return {
    rows,
    rowTargets,
    colTargets
  }
}

describe('solve', () => {
  it('should find the solution for a simple 2x2 puzzle', () => {
    // Puzzle:
    //
    // 1   2  | 2
    // 3   4  | 3
    // ------
    // 3   2

    const puzzle = createTestPuzzle({
      values: [
        [1, 2],
        [3, 4]
      ],
      rowTargets: [2, 3],
      colTargets: [3, 2]
    })

    const solutions = solve(puzzle)

    // Should have 1 solution
    expect(solutions.length).toBe(1)

    // The solution is to include [0,1] and [1,0]
    const expectedSolution = [
      [false, true], // include 2, exclude 1
      [true, false] // include 3, exclude 4
    ]

    expect(solutions[0]).toEqual(expectedSolution)
  })

  it('should find multiple solutions when they exist', () => {
    // Puzzle with multiple solutions:
    //
    // 1   1  | 1
    // 1   1  | 1
    // ------
    // 1   1

    const puzzle = createTestPuzzle({
      values: [
        [1, 1],
        [1, 1]
      ],
      rowTargets: [1, 1],
      colTargets: [1, 1]
    })

    const solutions = solve(puzzle)

    // Should have 2 solutions
    expect(solutions.length).toBe(2)

    // Solutions can be either diagonal
    const expectedSolutions = [
      [
        [true, false],
        [false, true]
      ],
      [
        [false, true],
        [true, false]
      ]
    ]

    // Check that both expected solutions are in the result
    expect(solutions).toEqual(expect.arrayContaining(expectedSolutions))
  })

  it('should return an empty array for puzzles with no solution', () => {
    // Puzzle with no possible solution:
    //
    // 1   2  | 4  (impossible - max sum is 3)
    // 3   4  | 8  (impossible - max sum is 7)
    // ------
    // 5   6

    const puzzle = createTestPuzzle({
      values: [
        [1, 2],
        [3, 4]
      ],
      rowTargets: [4, 8], // Impossible targets
      colTargets: [5, 6]
    })

    const solutions = solve(puzzle)

    // Should have 0 solutions
    expect(solutions.length).toBe(0)
  })

  it('should find solution for a 3x3 puzzle', () => {
    // Puzzle:
    //
    // 1   2*  3  | 4
    // 4*  5   6  | 11
    // 7   8   9  | 24
    // ---------
    // 8  13  18

    const puzzle = createTestPuzzle({
      values: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ],
      rowTargets: [4, 11, 24],
      colTargets: [8, 13, 18]
    })

    const solutions = solve(puzzle)

    // Should have 1 solution
    expect(solutions.length).toBe(1)

    // The solution is to include the cells that add up to the target sums
    const expectedSolution = [
      [true, false, true], // 3 = 3
      [false, true, true], // 5 + 6 = 11 (close enough to 10 for this test)
      [true, true, true] // 7 + 8 + 9 = 24
    ]

    expect(solutions[0]).toEqual(expectedSolution)
  })

  it('should limit the number of solutions returned', () => {
    // Puzzle with many solutions:
    //
    // 1  1  1  | 1
    // 1  1  1  | 1
    // 1  1  1  | 1
    // ---------
    // 1  1  1

    const puzzle = createTestPuzzle({
      values: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
      ],
      rowTargets: [1, 1, 1],
      colTargets: [1, 1, 1]
    })

    // Limit to 3 solutions
    const solutions = solve(puzzle)

    // Should have exactly 6 solutions
    expect(solutions.length).toBe(6)

    const limitedSolutions = solve(puzzle, 2)

    // Should have exactly 2 solutions
    expect(limitedSolutions.length).toBe(2)
  })
})

describe('hasUniqueSolution', () => {
  it('should return true for puzzles with exactly one solution', () => {
    const puzzleWithOneSolution = createTestPuzzle({
      values: [
        [1, 2],
        [3, 4]
      ],
      rowTargets: [2, 3],
      colTargets: [3, 2]
    })

    expect(hasUniqueSolution(puzzleWithOneSolution)).toBe(true)
  })

  it('should return false for puzzles with multiple solutions', () => {
    const puzzleWithMultipleSolutions = createTestPuzzle({
      values: [
        [1, 1],
        [1, 1]
      ],
      rowTargets: [1, 1],
      colTargets: [1, 1]
    })

    expect(hasUniqueSolution(puzzleWithMultipleSolutions)).toBe(false)
  })

  it('should return false for puzzles with no solutions', () => {
    const puzzleWithNoSolution = createTestPuzzle({
      values: [
        [1, 2],
        [3, 4]
      ],
      rowTargets: [4, 8], // Impossible targets
      colTargets: [5, 6]
    })

    expect(hasUniqueSolution(puzzleWithNoSolution)).toBe(false)
  })
})
