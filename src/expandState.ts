import {
  getColTargets,
  getColTotals,
  getRowTargets,
  getRowTotals,
  isSolved,
  rowsToCols,
} from 'selectors'
import { Cell, PuzzleGrid, PuzzleState } from 'types'

export const expandState = ({
  startTime = Date.now(),
  rows,
}: Partial<PuzzleState> & Pick<PuzzleState, 'rows'>): PuzzleState => {
  const cols = rowsToCols(rows)
  const grid = { rows, cols } as PuzzleGrid

  const expandedState: PuzzleState = {
    startTime,
    ...grid,
    rowTargets: getRowTargets(grid),
    colTargets: getColTargets(grid),
    rowTotals: getRowTotals(grid),
    colTotals: getColTotals(grid),
  }
  expandedState.solved = isSolved(expandedState)
  return expandedState
}
