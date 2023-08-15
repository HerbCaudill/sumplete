import { Reducer } from 'react'
import { Coordinates, PuzzleState } from './types'
import { expandState } from 'expandState'
import { cloneDeep } from 'lodash'
import { isSolved } from 'selectors'

export const reducer: Reducer<PuzzleState, Action> = (state, action) => {
  const partialState = {
    startTime: state.startTime,
    rows: cloneDeep(state.rows),
  }

  switch (action.type) {
    case 'NEW': {
      // start new game
      return initializer(action.initialState)
    }

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
      break
    }

    case 'END': {
      // end the game
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

export const initializer = (initialState: PuzzleState) => initialState

export type Action =
  | { type: 'NEW'; initialState: PuzzleState }
  | { type: 'CLEAR'; coordinates: Coordinates }
  | { type: 'INCLUDE'; coordinates: Coordinates }
  | { type: 'EXCLUDE'; coordinates: Coordinates }
  | { type: 'RESTART' }
  | { type: 'END' }
