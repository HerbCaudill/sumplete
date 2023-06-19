export type CellState = 'EMPTY' | 'INCLUDE' | 'EXCLUDE'

export type Coordinates = {
  row: number
  col: number
}

export type Cell = {
  coordinates: Coordinates
  value: number
  included: boolean
  state: CellState
}

export type PuzzleGrid = {
  rows: Cell[][]
  cols: Cell[][]
}

export type PuzzleState = PuzzleGrid & {
  startTime: number
  rowTargets: number[]
  colTargets: number[]
  rowTotals: number[]
  colTotals: number[]
  solved?: boolean
}
