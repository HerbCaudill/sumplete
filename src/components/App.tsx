import { generatePuzzle } from 'generatePuzzle'
import { Game } from './Game'
import { queryString } from 'utils/queryString'
import { DEFAULT_SIZE, MAX_SIZE, MIN_SIZE } from '../constants'
import { RadioGroup } from './RadioGroup'
import { range } from 'utils/range'

const sizes = range(MIN_SIZE, MAX_SIZE).map(n => ({ label: `${n}⨉${n}`, value: String(n) }))

export const App = () => {
  // allow setting a random seed via query string (for testing or sharing)
  let seed = String(queryString('seed') || undefined)

  // allow setting grid size via query string
  let size = Number(queryString('size') || DEFAULT_SIZE)
  if (size < MIN_SIZE) size = MIN_SIZE
  if (size > MAX_SIZE) size = MAX_SIZE

  const puzzle = generatePuzzle({ seed, size })

  return (
    <div className="flex flex-col items-center ">
      <div className="container auto-mx flex flex-col max-w-lg">
        <Game initialState={puzzle} />
        <p>
          <RadioGroup
            label="Size"
            initialValue={String(size)}
            options={sizes}
            onChange={() => {}}
          />
        </p>
      </div>
    </div>
  )
}
