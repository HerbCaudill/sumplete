import { Fragment, useEffect, useReducer, useState } from 'react'
import { reducer } from 'reducer'
import { PuzzleState } from 'types'
import { range } from 'utils/range'
import { TotalCell } from './TotalCell'
import { ValueCell } from './ValueCell'
import { isSolved } from 'selectors'

export const Game = ({ initialState }: Props) => {
  const size = initialState.rows.length
  const nums = range(0, size - 1)

  const [state, dispatch] = useReducer(reducer, initialState)

  const [timer, setTimer] = useState<NodeJS.Timer | null>(null)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const stopTimer = () => {
      if (timer !== null) {
        clearInterval(timer)
        setTimer(null)
      }
    }

    setTimer(
      setInterval(() => {
        if (state.solved) stopTimer()
        else setSeconds(Math.floor((Date.now() - state.startTime) / 1000))
      }, 1000)
    )

    return stopTimer
  }, [state.startTime, state.solved])

  return (
    <>
      <div className="my-4 border p-2 rounded-lg font-semibold">⏱️ {format(seconds)}</div>
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
      <div>
        {/* success message */}
        {state.solved && (
          <p className="text-lg font-serif mt-2">
            🥳 You solved it in {format(seconds)}. Well done!
          </p>
        )}
      </div>
      <div>
        <button className="button-xs button-white" onClick={() => dispatch({ type: 'RESTART' })}>
          Restart
        </button>
      </div>
    </>
  )
}

// format seconds as mm:ss
const format = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  const paddedSeconds = remainder < 10 ? `0${remainder}` : remainder
  return `${minutes}:${paddedSeconds}`
}

type Props = {
  initialState: PuzzleState
}
