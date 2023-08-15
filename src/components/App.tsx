import { generatePuzzle } from 'generatePuzzle'
import { useState } from 'react'
import { queryString } from 'utils/queryString'
import { DEFAULT_SIZE, MAX_SIZE, MIN_SIZE } from '../constants'
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
  const [puzzle] = useState(generatePuzzle({ seed, size }))

  return (
    <div className="flex flex-col items-center ">
      <div className="container auto-mx flex flex-col max-w-xl gap-2">
        <Game initialState={puzzle} />
      </div>
    </div>
  )
}
