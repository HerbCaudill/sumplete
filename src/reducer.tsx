import { expandState } from 'expandState'
import { Reducer } from 'react'
import type { Coordinates, PuzzleState, PuzzleSnapshot } from './types'
import cloneDeep from 'lodash/cloneDeep'

// Helper to create a minimal state snapshot for history tracking
const snapshot = (state: PuzzleState): PuzzleSnapshot => {
  const { rows, startTime } = state
  // Only store the essential game state, not the full history
  return { rows: cloneDeep(rows), startTime }
}

export const reducer: Reducer<PuzzleState, Action> = (state, action) => {
  const { startTime, rows, past = [], future = [] } = state

  switch (action.type) {
    case 'NEW': {
      // start new game
      return action.initialState
    }

    case 'UNDO': {
      // Get the last state from history
      const previousState = past.pop()

      // If there's nothing to undo, return current state
      if (!previousState) return state

      // Return the previous state with updated history
      return {
        ...expandState(previousState),
        past,
        future: [snapshot(state), ...future]
      }
    }

    case 'REDO': {
      // If there's nothing to redo, return current state
      if (future.length === 0) return state

      // Get the next state from future history
      const nextState = future[0]

      // Return the next state with updated history
      return {
        ...expandState(nextState),
        past: [...past, snapshot(state)],
        future: future.slice(1)
      }
    }

    default: {
      // For all other actions, save current state to history before changing

      // Create partial state with history tracking
      const partialState = {
        startTime: startTime,
        rows: [...rows],
        past: [...past, snapshot(state)]
      }

      switch (action.type) {
        case 'CLEAR': {
          // clear this cell
          const { row, col } = action.coordinates
          partialState.rows[row][col].state = 'EMPTY'
          break
        }

        case 'INCLUDE': {
          // mark this cell included
          const { row, col } = action.coordinates
          partialState.rows[row][col].state = 'INCLUDE'
          break
        }

        case 'EXCLUDE': {
          // mark this cell excluded
          const { row, col } = action.coordinates
          partialState.rows[row][col].state = 'EXCLUDE'
          break
        }

        case 'RESTART': {
          // start this game over (clear all included/excluded cells)
          partialState.rows.forEach(row => {
            row.forEach(cell => {
              cell.state = 'EMPTY'
            })
          })
          // reset timer
          partialState.startTime = Date.now()
          break
        }
      }

      // calculate totals etc.
      const newState = expandState(partialState)

      // when puzzle is solved, mark all empty (non-excluded) cells as included
      if (newState.solved) {
        newState.rows.forEach(row => {
          row.forEach(cell => {
            if (cell.state === 'EMPTY') cell.state = 'INCLUDE'
          })
        })
      }

      return newState
    }
  }
}

export type Action =
  | { type: 'NEW'; initialState: PuzzleState }
  | { type: 'CLEAR'; coordinates: Coordinates }
  | { type: 'INCLUDE'; coordinates: Coordinates }
  | { type: 'EXCLUDE'; coordinates: Coordinates }
  | { type: 'RESTART' }
  | { type: 'END' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
