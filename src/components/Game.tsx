import { generatePuzzle } from 'generatePuzzle'
import { Fragment, useEffect, useReducer, useState } from 'react'
import { reducer } from 'reducer'
import { PuzzleState } from 'types'
import { range } from 'utils/range'
import { MAX_SIZE, MIN_SIZE } from '../constants'
import { useCompletionRecords } from '../hooks/useCompletionRecords'
import { Confetti } from './Confetti'
import { RadioGroup } from './RadioGroup'
import { RecordNotification } from './RecordNotification'
import { Timer } from './Timer'
import { TotalCell } from './TotalCell'
import { ValueCell } from './ValueCell'
import cx from 'classnames'

const sizes = range(MIN_SIZE, MAX_SIZE).map(n => ({
  label: String(n),
  value: String(n)
}))

export const Game = ({ initialState, onStateChange }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const [isNewRecord, setIsNewRecord] = useState(false)
  const [completionTime, setCompletionTime] = useState<number | null>(null)
  const [isCheckingMistakes, setIsCheckingMistakes] = useState(false)

  const { saveTime, getBestTime } = useCompletionRecords()

  const size = state.rows.length
  const nums = range(0, size - 1)
  const bestTime = getBestTime(size)
  const hasMistakes = state.rows.some(row =>
    row.some(cell => {
      return (
        (cell.state === '+' && !cell.included) ||
        (cell.state === '-' && cell.included)
      )
    })
  )
  0
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

  useEffect(() => {
    if (state.solved && !completionTime) {
      // Record completion time when the game is solved
      const time = Math.floor((Date.now() - state.startTime) / 1000)
      setCompletionTime(time)
      const isRecord = saveTime(size, time)
      if (isRecord) setIsNewRecord(true)
    } else if (!state.solved && completionTime) {
      // Reset when starting a new game
      setCompletionTime(null)
      setIsNewRecord(false)
    }
  }, [state.solved, completionTime, state.startTime])

  // Turn off mistake checking when the state changes
  useEffect(() => {
    setIsCheckingMistakes(false)
  }, [state])

  const startNewGame = (size: string) =>
    dispatch({
      type: 'NEW',
      initialState: generatePuzzle({ size: Number(size) })
    })

  const restartGame = () => dispatch({ type: 'RESTART' })
  const undoMove = () => dispatch({ type: 'UNDO' })
  const redoMove = () => dispatch({ type: 'REDO' })
  const checkMistakes = () => setIsCheckingMistakes(true)

  const removeMistakes = () => {
    // Go through all cells and correct mistakes
    state.rows.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (
          (cell.state === '+' && !cell.included) ||
          (cell.state === '-' && cell.included)
        ) {
          dispatch({
            type: 'CLEAR',
            row: rowIndex,
            col: colIndex
          })
        }
      })
    })
    setIsCheckingMistakes(false)
  }

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

      <div className="flex flex-col gap-4 select-none p-3 pb-5 h-screen">
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
        <div className={`grid grid-cols-${size + 1} w-full gap-px `}>
          {nums.map(i => (
            <Fragment key={`row-${i}`}>
              {/* row values */}
              {state.rows[i].map((cell, j) => (
                <ValueCell //
                  key={`${i}-${j}`}
                  cell={cell}
                  dispatch={dispatch}
                  isCheckingMistakes={isCheckingMistakes}
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

        <div className="flex items-start gap-2 flex-1">
          <button className="button-xs button-white" onClick={undoMove}>
            <IconArrowBackUp className="size-4" />
          </button>
          <button className="button-xs button-white" onClick={redoMove}>
            <IconArrowForwardUp className="size-4" />
          </button>

          <div className="flex-1" />

          {hasMistakes && isCheckingMistakes ? (
            <button className="button-xs button-white" onClick={removeMistakes}>
              <IconCircleX className="size-4" />
              Remove mistakes
            </button>
          ) : null}
          <button
            className={cx('button-xs', {
              'button-white': hasMistakes || !isCheckingMistakes,
              'button-success': !hasMistakes && isCheckingMistakes
            })}
            onClick={checkMistakes}
          >
            <IconCircleCheck className="size-4" />
            Check
          </button>
        </div>

        {/* size selector */}
        <div className="pb-4">
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
