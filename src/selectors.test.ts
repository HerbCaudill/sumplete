import { generatePuzzle } from 'generatePuzzle'
import { isSolved } from './selectors'
import { Action, reducer } from 'reducer'

// puzzle (* = excluded)
//
//   7* 7* 8* | 0
//   1  5  8* | 6
//   2* 2* 3  | 3
//   ---------+--
//   1  5  3  |

describe('selectors', () => {
  const setup = () => {
    const state = generatePuzzle({ seed: 'test', size: 3 })
    return { state }
  }

  describe('isSolved', () => {
    it('at the beginning, returns false', () => {
      const { state } = setup()
      expect(isSolved(state)).toBe(false)
    })

    it('when partially solved, returns false', () => {
      const { state } = setup()
      const actions: Action[] = [
        { type: 'EXCLUDE', coordinates: { row: 0, col: 0 } },
        { type: 'EXCLUDE', coordinates: { row: 0, col: 1 } },
        { type: 'EXCLUDE', coordinates: { row: 0, col: 2 } },
      ]
      const newState = actions.reduce(reducer, state)
      expect(isSolved(newState)).toBe(false)
    })

    it('when solved, returns true', () => {
      const { state } = setup()
      const actions: Action[] = [
        { type: 'EXCLUDE', coordinates: { row: 0, col: 0 } },
        { type: 'EXCLUDE', coordinates: { row: 0, col: 1 } },
        { type: 'EXCLUDE', coordinates: { row: 0, col: 2 } },
        { type: 'EXCLUDE', coordinates: { row: 1, col: 2 } },
        { type: 'EXCLUDE', coordinates: { row: 2, col: 0 } },
        { type: 'EXCLUDE', coordinates: { row: 2, col: 1 } },
      ]
      const newState = actions.reduce(reducer, state)
      expect(isSolved(newState)).toBe(true)
    })
  })
})
