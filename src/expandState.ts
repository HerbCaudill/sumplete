import {
  getColTargets,
  getColTotals,
  getRowTargets,
  getRowTotals,
  isSolved,
  rowsToCols,
} from "selectors"
import { PuzzleGrid, PuzzleState, type PuzzleSnapshot } from "types"

export const expandState = (snapshot: PuzzleSnapshot): PuzzleState => {
  const { rows = [] } = snapshot
  const cols = rowsToCols(rows)
  const grid = { rows, cols } as PuzzleGrid

  const expandedState: PuzzleState = {
    past: [],
    future: [],
    ...snapshot,
    ...grid,
    rowTargets: getRowTargets(grid),
    colTargets: getColTargets(grid),
    rowTotals: getRowTotals(grid),
    colTotals: getColTotals(grid),
    solved: false,
  }
  expandedState.solved = isSolved(expandedState)

  return expandedState
}
