import { getColTargets, getColTotals, getRowTargets, getRowTotals, rowsToCols } from 'selectors'
import { Cell, PuzzleGrid, PuzzleState } from 'types'

export const expandState = (rows: Cell[][]): PuzzleState => {
  const cols = rowsToCols(rows)
  const grid = { rows, cols } as PuzzleGrid
  return {
    ...grid,
    rowTargets: getRowTargets(grid),
    colTargets: getColTargets(grid),
    rowTotals: getRowTotals(grid),
    colTotals: getColTotals(grid),
  }
}
