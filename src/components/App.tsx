import { generatePuzzle } from 'generatePuzzle'
import { Game } from './Game'
import { queryString } from 'utils/queryString'
import { DEFAULT_SIZE, MAX_SIZE, MIN_SIZE } from '../constants'

export const App = () => {
  // allow setting a random seed via query string (for testing or sharing)
  let seed = String(queryString('seed') || undefined)

  // allow setting grid size via query string
  let size = Number(queryString('size') || DEFAULT_SIZE)
  if (size < MIN_SIZE) size = MIN_SIZE
  if (size > MAX_SIZE) size = MAX_SIZE

  const puzzle = generatePuzzle({ seed, size })

  return (
    <div className="p-3">
      <Game initialState={puzzle} />
    </div>
  )
}
