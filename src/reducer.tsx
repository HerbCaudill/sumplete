import { Reducer } from 'react'
import { Coordinates, PuzzleState } from './types'
import { expandState } from 'expandState'
import { cloneDeep } from 'lodash'

export const reducer: Reducer<PuzzleState, Action> = (state, action) => {
  const rows = cloneDeep(state.rows)
  switch (action.type) {
    case 'RESTART': {
      rows.forEach(row => {
        row.forEach(cell => {
          cell.state = 'EMPTY'
        })
      })
      break
    }
    case 'CLEAR': {
      const { row, col } = action.coordinates
      rows[row][col].state = 'EMPTY'
      break
    }
    case 'INCLUDE': {
      const { row, col } = action.coordinates
      rows[row][col].state = 'INCLUDE'
      break
    }
    case 'EXCLUDE': {
      const { row, col } = action.coordinates
      rows[row][col].state = 'EXCLUDE'
      break
    }
  }

  return expandState(rows)
}

export type Action =
  | { type: 'RESTART' }
  | { type: 'CLEAR'; coordinates: Coordinates }
  | { type: 'INCLUDE'; coordinates: Coordinates }
  | { type: 'EXCLUDE'; coordinates: Coordinates }
