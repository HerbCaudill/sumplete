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

const sizes = range(MIN_SIZE, MAX_SIZE).map(n => ({
  label: `${n}⨉${n}`,
  value: String(n)
}))

export const Game = ({ initialState, onStateChange }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState, initializer)

  // Use useEffect to call onStateChange after state updates
  useEffect(() => {
    if (onStateChange) onStateChange(state)
  }, [state, onStateChange])

  // Start a new game if the loaded game is already solved
  useEffect(() => {
    if (initialState.solved) {
      const newState = generatePuzzle({ size: initialState.rows.length })
      dispatch({ type: 'NEW', initialState: newState })
    }
  }, [])

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
        </div>
      ) : null}

      <div className="flex flex-col h-screen gap-4 select-none p-3">
        <div className="flex gap-2 ">
          <div className="border p-2 text-sm rounded-lg font-semibold grow flex items-center gap-2">
            <IconStopwatch className="size-4" />
            {formatSeconds(seconds)}
          </div>

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

        {/* grid */}
        <div className={` grid grid-cols-${size + 1} w-full gap-1 `}>
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
                dir="row"
              />
            </Fragment>
          ))}
          {/* column totals */}
          {nums.map(j => (
            <TotalCell
              key={`col-total-${j}`}
              targetValue={state.colTargets[j]}
              currentValue={state.colTotals[j]}
              dir="column"
            />
          ))}

          {/* blank lower-right cell */}
          <TotalCell />
        </div>

        <div className="grow"></div>

        {/* size selector */}
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
  onStateChange?: (state: PuzzleState) => void
}
