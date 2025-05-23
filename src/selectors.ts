import { PuzzleCell, PuzzleGrid, PuzzleState } from 'types'
import { sum, zipWith } from 'lodash'

export const rowsToCols = (rows: PuzzleCell[][]) =>
  zipWith<PuzzleCell, PuzzleCell[]>(...rows)

const getTotal =
  (filterExp: (cell: PuzzleCell) => boolean) => (cells: PuzzleCell[]) =>
    sum(cells.filter(filterExp).map(cell => cell.value))

export const getCurrentTotal = getTotal(cell => cell.state !== '-') // sum of the cells that the player hasn't excluded
export const getTargetTotal = getTotal(cell => cell.included) // sum of the cells that are included in the puzzle solution

export const getRowTargets = (grid: PuzzleGrid) => grid.rows.map(getTargetTotal)
export const getColTargets = (grid: PuzzleGrid) => grid.cols.map(getTargetTotal)
export const getRowTotals = (grid: PuzzleGrid) => grid.rows.map(getCurrentTotal)
export const getColTotals = (grid: PuzzleGrid) => grid.cols.map(getCurrentTotal)

export const isSolved = (state: PuzzleState) => {
  return (
    state.rowTotals.every((total, i) => total === state.rowTargets[i]) &&
    state.colTotals.every((total, i) => total === state.colTargets[i])
  )
}
