import {
  getColTargets,
  getColTotals,
  getRowTargets,
  getRowTotals,
  isSolved,
  rowsToCols
} from 'selectors'
import { PuzzleGrid, PuzzleState, type PuzzleSnapshot } from 'types'

export const expandState = (partialState: PuzzleSnapshot): PuzzleState => {
  const { rows = [] } = partialState
  const cols = rowsToCols(rows)
  const grid = { rows, cols } as PuzzleGrid

  const expandedState: PuzzleState = {
    past: [],
    future: [],
    ...partialState,
    ...grid,
    rowTargets: getRowTargets(grid),
    colTargets: getColTargets(grid),
    rowTotals: getRowTotals(grid),
    colTotals: getColTotals(grid),
    solved: false
  }
  expandedState.solved = isSolved(expandedState)

  return expandedState
}
