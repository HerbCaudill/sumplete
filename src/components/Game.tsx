import { Fragment, useEffect, useReducer, useState, useCallback } from 'react'
import { initializer, reducer } from 'reducer'
import { PuzzleState } from 'types'
import { range } from 'utils/range'
import { MAX_SIZE, MIN_SIZE } from '../constants'
import { formatSeconds } from '../formatSeconds'
import { TotalCell } from './TotalCell'
import { ValueCell } from './ValueCell'
import { RadioGroup } from './RadioGroup'
import { generatePuzzle } from 'generatePuzzle'
import { Confetti } from './Confetti'
import cx from 'classnames'

const sizes = range(MIN_SIZE, MAX_SIZE).map((n) => ({
  label: `${n}⨉${n}`,
  value: String(n)
}))

export const Game = ({ initialState, onStateChange }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState, initializer)

  // Use useEffect to call onStateChange after state updates
  useEffect(() => {
    if (onStateChange) onStateChange(state)
  }, [state, onStateChange])

  const size = state.rows.length
  const nums = range(0, size - 1)

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
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

  const startNewGame = (size: string) => {
    const newState = generatePuzzle({ size: Number(size) })
    dispatch({ type: 'NEW', initialState: newState })
  }

  const restartGame = () => {
    dispatch({ type: 'RESTART' })
  }

  return (
    <>
      {state.solved ? (
        <div className="fixed top-0 left-0 w-full h-1/2 flex flex-col items-center justify-center ">
          <Confetti />
          <div
            className={cx(
              'bg-white text-black font-semibold whitespace-nowrap text-center tracking-wide',
              'py-1 px-4 rounded border border-black',
              'animate-celebrate'
            )}
            style={{
              transform: ' scale3d(1,1,1)'
            }}
          >
            🥳 You solved it in {formatSeconds(seconds)}. Well done!
          </div>
        </div>
      ) : null}

      <div className="m-3">
        <div className="my-4 border p-2 rounded-lg font-semibold">
          ⏱️ {formatSeconds(seconds)}
        </div>
        {/* grid */}
        <div className={`select-none grid grid-cols-${size + 1} w-full gap-1 `}>
          {nums.map((i) => (
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
          {nums.map((j) => (
            <TotalCell
              key={`col-total-${j}`}
              targetValue={state.colTargets[j]}
              currentValue={state.colTotals[j]}
            />
          ))}

          {/* blank lower-right cell */}
          <TotalCell />
        </div>

        <div className="flex gap-2 my-4">
          <button className="button-xs button-white" onClick={restartGame}>
            <IconReload className="size-4" />
            Restart
          </button>
          <button
            className="button-xs button-white"
            onClick={() => startNewGame(String(size))}
          >
            <IconFile className="size-4" />
            New
          </button>
        </div>
        {/* size selector */}
        <div className="flex gap-2">
          <RadioGroup
            label="Size"
            initialValue={String(size)}
            options={sizes}
            onChange={startNewGame}
          />
        </div>
      </div>
    </>
  )
}

type Props = {
  initialState: PuzzleState
  onStateChange?: (state: PuzzleState) => void
}
