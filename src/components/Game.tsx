import { Fragment, useEffect, useReducer, useState } from 'react'
import { initializer, reducer } from 'reducer'
import { PuzzleState } from 'types'
import { range } from 'utils/range'
import { MAX_SIZE, MIN_SIZE } from '../constants'
import { formatSeconds } from '../formatSeconds'
import { TotalCell } from './TotalCell'
import { ValueCell } from './ValueCell'
import { RadioGroup } from './RadioGroup'
import { generatePuzzle } from 'generatePuzzle'

const sizes = range(MIN_SIZE, MAX_SIZE).map(n => ({ label: `${n}⨉${n}`, value: String(n) }))

export const Game = ({ initialState }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState, initializer)
  const size = state.rows.length
  const nums = range(0, size - 1)

  const [timer, setTimer] = useState<NodeJS.Timer | null>(null)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const stopTimer = () => {
      if (timer !== null) {
        clearInterval(timer)
        setTimer(null)
      }
    }

    if (timer) stopTimer()
    setTimer(
      setInterval(() => {
        if (state.solved) stopTimer()
        else setSeconds(Math.floor((Date.now() - state.startTime) / 1000))
      }, 100)
    )

    return stopTimer
  }, [state.startTime, state.solved])

  const startNewGame = (value: string) => {
    dispatch({ type: 'NEW', initialState: generatePuzzle({ size: Number(value) }) })
  }

  const restartGame = () => {
    dispatch({ type: 'RESTART' })
  }

  return (
    <>
      <div className="my-4 border p-2 rounded-lg font-semibold">⏱️ {formatSeconds(seconds)}</div>
      {/* grid */}
      <div className={`select-none grid grid-cols-${size + 1} w-full gap-1 `}>
        {nums.map(i => (
          <Fragment key={`row-${i}`}>
            {/* row values */}
            {state.rows[i].map((cell, j) => (
              <ValueCell //
                key={`${i}-${j}`}
                cell={cell}
                dispatch={dispatch}
              />
            ))}

            {/* row total */}
            <TotalCell //
              targetValue={state.rowTargets[i]}
              currentValue={state.rowTotals[i]}
            />
          </Fragment>
        ))}
        {/* column totals */}
        {nums.map(j => (
          <TotalCell
            key={`col-total-${j}`}
            targetValue={state.colTargets[j]}
            currentValue={state.colTotals[j]}
          />
        ))}

        {/* blank lower-right cell */}
        <TotalCell />
      </div>
      {/* success message */}
      {state.solved ? (
        <p className="text-lg font-serif mt-2">
          🥳 You solved it in {formatSeconds(seconds)}. Well done!
        </p>
      ) : (
        <div>
          <button className="button-xs button-white" onClick={restartGame}>
            Restart
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <RadioGroup
          label="Size"
          initialValue={String(size)}
          options={sizes}
          onChange={startNewGame}
        />
      </div>
    </>
  )
}

type Props = {
  initialState: PuzzleState
}
