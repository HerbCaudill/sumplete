import { makeRandom } from '@herbcaudill/random'
import { expandState } from 'expandState'
import { hasUniqueSolution } from 'solve'
import { PuzzleState, PuzzleCell } from 'types'
import { range } from 'utils/range'

const INCLUDE_RATIO = 0.5 // % of cells to include

export const generatePuzzle = ({
  size = 3,
  seed = Math.random().toString(36)
}: Props = {}): PuzzleState => {
  const compositeSeed = `${seed}_${size}`
  const rand = makeRandom(compositeSeed)
  const nums = range(0, size - 1)
  const rows: PuzzleCell[][] = nums.map(row =>
    nums.map(col => ({
      row,
      col,
      value: rand.integer(1, 9),
      included: rand.probability(INCLUDE_RATIO),
      state: '?'
    }))
  )

  const expanded = expandState({ rows, startTime: Date.now() })

  const { rowTargets, colTargets } = expanded

  if (hasUniqueSolution({ rows, rowTargets, colTargets })) {
    return expanded
  } else {
    return generatePuzzle({ size, seed: seed + '!' })
  }
}

type Props = {
  size?: number
  seed?: string
}
