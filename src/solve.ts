import { cloneDeep } from 'lodash'
import { PuzzleState } from 'types'

export const solve = (
  puzzle: PuzzleForSolver,
  limit: number = Number.MAX_SAFE_INTEGER
): boolean[][][] => {
  const { rows, rowTargets, colTargets } = puzzle
  const size = rows.length
  const values = rows.map(row => row.map(cell => cell.value))

  const solutions: boolean[][][] = []

  // Create a temporary working state to track which cells are included
  const includedCells: boolean[][] = Array(size)
    .fill(false)
    .map(() => Array(size).fill(false))

  const visit = (row: number, col: number) => {
    // Stop if we've found enough solutions
    if (solutions.length >= limit) return

    // If we've processed all cells, check if this is a valid solution
    if (row === size) {
      // Calculate row sums for current configuration
      const rowSums = includedCells.map((row, i) =>
        row.reduce((sum, included, j) => sum + (included ? values[i][j] : 0), 0)
      )

      // Calculate column sums for current configuration
      const colSums = Array(size)
        .fill(0)
        .map((_, j) =>
          Array(size)
            .fill(0)
            .map((_, i) => (includedCells[i][j] ? values[i][j] : 0))
            .reduce((a, b) => a + b, 0)
        )

      // Check if all targets are met
      const isValid =
        rowSums.every((sum, i) => sum === rowTargets[i]) &&
        colSums.every((sum, j) => sum === colTargets[j])

      if (isValid) solutions.push(cloneDeep(includedCells))

      return
    }

    // Calculate next cell position
    const nextCol = (col + 1) % size
    const nextRow = nextCol === 0 ? row + 1 : row

    // Try including this cell
    includedCells[row][col] = true
    visit(nextRow, nextCol)

    // Try excluding this cell
    includedCells[row][col] = false
    visit(nextRow, nextCol)
  }

  // Start backtracking from first cell
  visit(0, 0)

  return solutions
}

/**
 * Checks if a puzzle has a unique solution
 *
 * @param puzzle The puzzle to check
 * @returns true if the puzzle has exactly one solution, false otherwise
 */
export const hasUniqueSolution = (puzzle: PuzzleForSolver): boolean => {
  // Stop searching after finding 2 solutions to optimize performance
  return solve(puzzle, 2).length === 1
}

export type PuzzleForSolver = Pick<
  PuzzleState,
  'rows' | 'rowTargets' | 'colTargets'
>
