import { cloneDeep } from "lodash"
import { type PuzzleForSolver } from "types"

/**
 * Optimized solver implementation with early pruning techniques
 */
export const solve = (
  puzzle: PuzzleForSolver,
  limit: number = Number.MAX_SAFE_INTEGER,
): boolean[][][] => {
  const { rows, rowTargets, colTargets } = puzzle
  const size = rows.length
  const values = rows.map(row => row.map(cell => cell.value))

  const solutions: boolean[][][] = []

  // Create a temporary working state to track which cells are included
  const includedCells: boolean[][] = Array(size)
    .fill(false)
    .map(() => Array(size).fill(false))

  // Keep track of current sums for faster validation
  const rowSums = Array(size).fill(0)
  const colSums = Array(size).fill(0)

  const visit = (row: number, col: number): void => {
    // Stop if we've found enough solutions
    if (solutions.length >= limit) return

    // If we've processed all cells, check if this is a valid solution
    if (row === size) {
      // At this point all our running sums should match targets
      const isSolved =
        rowSums.every((sum, i) => sum === rowTargets[i]) &&
        colSums.every((sum, j) => sum === colTargets[j])

      if (isSolved) solutions.push(cloneDeep(includedCells))
      return
    }

    // Calculate next cell position
    const nextCol = (col + 1) % size
    const nextRow = nextCol === 0 ? row + 1 : row

    // Can we include this cell?

    includedCells[row][col] = true
    rowSums[row] += values[row][col]
    colSums[col] += values[row][col]

    // Early pruning for inclusion path
    let canContinueWithInclusion = true

    if (nextCol === 0)
      if (rowSums[row] !== rowTargets[row])
        // If we've completed a row and it doesn't match target, prune
        canContinueWithInclusion = false
      else if (rowSums[row] > rowTargets[row])
        // If current row sum already exceeds target, prune
        canContinueWithInclusion = false

    if (row === size - 1)
      if (colSums[col] !== colTargets[col])
        // If we're on the last row and the column doesn't match target, prune
        canContinueWithInclusion = false
      else if (colSums[col] > colTargets[col])
        // If current column sum already exceeds target, prune
        canContinueWithInclusion = false

    if (canContinueWithInclusion) visit(nextRow, nextCol)

    // Backtrack and try excluding this cell
    rowSums[row] -= values[row][col]
    colSums[col] -= values[row][col]
    includedCells[row][col] = false

    // Early pruning for exclusion path
    let canContinueWithExclusion = true

    // Check if excluding this cell makes it impossible to reach row target
    if (nextCol === 0)
      if (rowSums[row] !== rowTargets[row]) canContinueWithExclusion = false
      else {
        const remainingMaxPossible = values[row].slice(col + 1).reduce((sum, val) => sum + val, 0)

        if (rowSums[row] + remainingMaxPossible < rowTargets[row]) {
          canContinueWithExclusion = false
        }
      }

    // Check if excluding this cell makes it impossible to reach column target
    if (row === size - 1)
      if (colSums[col] !== colTargets[col]) canContinueWithExclusion = false
      else {
        // Calculate remaining max possible sum for this column after exclusion
        let remainingMaxPossible = 0
        for (let r = row + 1; r < size; r++) {
          remainingMaxPossible += values[r][col]
        }

        if (colSums[col] + remainingMaxPossible < colTargets[col]) {
          canContinueWithExclusion = false
        }
      }

    if (canContinueWithExclusion) visit(nextRow, nextCol)
  }

  // Start with first cell
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
