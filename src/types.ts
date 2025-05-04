export type CellState = 'EMPTY' | 'INCLUDE' | 'EXCLUDE'

export type Coordinates = {
  row: number
  col: number
}

export type Cell = {
  coordinates: Coordinates
  value: number
  included: boolean // is this cell included in the puzzle solution?
  state: CellState // the UI state of this cell
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

export type CompletionRecord = {
  time: number // time in seconds
  date: string // ISO date string
}

export type CompletionRecords = {
  [size: number]: CompletionRecord[]
}

export type BestTimes = {
  [size: number]: number | null
}
