export type CellState = 'EMPTY' | 'INCLUDE' | 'EXCLUDE'

export type Cell = {
  row: number
  col: number
  value: number
  included: boolean // is this cell included in the puzzle solution?
  state: CellState // the UI state of this cell
}

export type PuzzleGrid = {
  rows: Cell[][]
  cols: Cell[][]
}

export type PuzzleState = PuzzleGrid & {
  rowTotals: number[]
  rowTargets: number[]
  colTotals: number[]
  colTargets: number[]
  startTime: number
  solved: boolean
  past: PuzzleSnapshot[]
  future: PuzzleSnapshot[]
}

export type PuzzleSnapshot = Pick<PuzzleState, 'rows' | 'startTime'>

export type Completion = {
  time: number // time in seconds
  date: string // ISO date string
}

export type Completions = {
  [size: number]: Completion[]
}

export type BestTimes = {
  [size: number]: number | null
}
