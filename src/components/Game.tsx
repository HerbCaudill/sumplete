import { Fragment, useEffect, useReducer, useState, useCallback } from 'react'
import { initializer, reducer } from 'reducer'
import { PuzzleState } from 'types'
import { range } from 'utils/range'
import { MAX_SIZE, MIN_SIZE } from '../constants'
import { TotalCell } from './TotalCell'
import { ValueCell } from './ValueCell'
import { RadioGroup } from './RadioGroup'
import { generatePuzzle } from 'generatePuzzle'
import { Confetti } from './Confetti'
import { useCompletionRecords } from '../hooks/useCompletionRecords'
import { RecordNotification } from './RecordNotification'
import { Timer } from './Timer'
import cx from 'classnames'

const sizes = range(MIN_SIZE, MAX_SIZE).map(n => ({
  label: String(n),
  value: String(n)
}))

export const Game = ({ initialState, onStateChange }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState, initializer)
  const { saveTime: addRecord, getBestTime } = useCompletionRecords()
  const [isNewRecord, setIsNewRecord] = useState(false)
  const [completionTime, setCompletionTime] = useState<number | null>(null)

  const size = state.rows.length
  const nums = range(0, size - 1)
  const bestTime = getBestTime(size)

  // Update the parent component when the game state changes
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

  // Record completion time when the game is solved
  useEffect(() => {
    if (state.solved && !completionTime) {
      const time = Math.floor((Date.now() - state.startTime) / 1000)
      setCompletionTime(time)
      const isRecord = addRecord(size, time)
      if (isRecord) {
        setIsNewRecord(true)
      }
    } else if (!state.solved && completionTime) {
      // Reset when starting a new game
      setCompletionTime(null)
      setIsNewRecord(false)
    }
  }, [state.solved, completionTime, addRecord, size, state.startTime])

  const startNewGame = (size: string) => {
    const newState = generatePuzzle({ size: Number(size) })
    dispatch({ type: 'NEW', initialState: newState })
  }

  const restartGame = () => {
    dispatch({ type: 'RESTART' })
  }

  console.log('rendering game')
  return (
    <>
      {state.solved && isNewRecord && completionTime ? (
        <>
          <div className="fixed top-0 left-0 w-full h-2 flex flex-col items-center justify-center ">
            <Confetti />
          </div>

          <RecordNotification
            time={completionTime}
            size={size}
            onClose={() => setIsNewRecord(false)}
          />
        </>
      ) : null}

      <div className="flex flex-col gap-4 select-none p-3">
        {/* toolbar */}
        <div className="flex w-full gap-2">
          <Timer
            startTime={state.startTime}
            isSolved={Boolean(state.solved)}
            bestTime={bestTime}
          />

          {/* Reload */}
          {!state.solved ? (
            <button className="button-xs button-white" onClick={restartGame}>
              <IconReload className="size-4" />
              Restart
            </button>
          ) : null}

          {/* New */}
          <button
            className="button-xs button-white"
            onClick={() => startNewGame(String(size))}
          >
            <IconFile className="size-4" />
            New
          </button>
        </div>

        {/* grid */}
        <div className={`grid grid-cols-${size + 1} w-full gap-1 `}>
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
