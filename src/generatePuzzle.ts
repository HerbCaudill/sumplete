import { makeRandom } from '@herbcaudill/random'
import { expandState } from 'expandState'
import { PuzzleState, Cell } from 'types'
import { range } from 'utils/range'

const INCLUDE_RATIO = 0.5 // % of cells to include

export const generatePuzzle = ({ size = 3, seed = undefined }: Props = {}): PuzzleState => {
  const compositeSeed = seed ? `${seed}_${size}` : undefined
  const rand = makeRandom(compositeSeed)
  const nums = range(0, size - 1)
  const rows: Cell[][] = nums.map(row =>
    nums.map(col => ({
      coordinates: { row, col },
      value: rand.integer(1, 9),
      included: rand.probability(INCLUDE_RATIO),
      state: 'EMPTY',
    }))
  )
  return expandState({ rows })
}

type Props = {
  size?: number
  seed?: string
}
