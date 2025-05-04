import { generatePuzzle } from 'generatePuzzle'
import { useState } from 'react'
import { queryString } from 'utils/queryString'
import { DEFAULT_SIZE, MAX_SIZE, MIN_SIZE } from '../constants'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { PuzzleState } from '../types'
import { Game } from './Game'

export const App = () => {
  // allow setting a random seed via query string (for testing or sharing)
  let seed = String(queryString('seed') || undefined)

  const getInitialSize = () => {
    let size = Number(queryString('size') || DEFAULT_SIZE)
    if (size < MIN_SIZE) size = MIN_SIZE
    if (size > MAX_SIZE) size = MAX_SIZE
    return size
  }

  // allow setting grid size via query string
  const [size] = useState(getInitialSize)

  // Create initial puzzle state if none exists in storage
  const createInitialPuzzle = () => generatePuzzle({ seed, size })

  // Use local storage to persist the puzzle state
  const [puzzle, setPuzzle] = useLocalStorage<PuzzleState>(
    'sumplete-puzzle',
    createInitialPuzzle
  )

  return puzzle ? (
    <div className="fixed left-0 top-0 flex flex-col items-center bg-blue-50 h-screen w-full">
      <div className="container mx-auto flex flex-col max-w-xl gap-2">
        <Game initialState={puzzle} onStateChange={setPuzzle} />
      </div>
    </div>
  ) : null
}
