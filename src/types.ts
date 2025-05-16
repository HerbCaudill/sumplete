export type CellState = "?" | "+" | "-"

// This is an abstract individual cell as seen by the solver
// (we don't know if the solution includes it or not)
export type Cell = {
  value: number
  state: CellState // the UI state of this cell
}

//
export type PuzzleCell = Cell & {
  row: number
  col: number
  included: boolean // is this cell included in the puzzle solution?
}

export type PuzzleGrid = {
  rows: PuzzleCell[][]
  cols: PuzzleCell[][]
}

export type PuzzleState = PuzzleGrid & {
  rowTargets: number[]
  colTargets: number[]
  rowTotals: number[]
  colTotals: number[]
  startTime: number
  solved: boolean
  past: PuzzleSnapshot[]
  future: PuzzleSnapshot[]
}

export type PuzzleForSolver = { rows: Cell[][] } & Pick<PuzzleState, "rowTargets" | "colTargets">

export type PuzzleSnapshot = Pick<PuzzleState, "rows" | "startTime">

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
