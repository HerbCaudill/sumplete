import { Fragment, useReducer } from 'react'
import { reducer } from 'reducer'
import { PuzzleState } from 'types'
import { range } from 'utils/range'
import { TotalCell } from './TotalCell'
import { ValueCell } from './ValueCell'
import { isSolved } from 'selectors'

export const Game = ({ initialState: initialState }: Props) => {
  const size = initialState.rows.length
  const nums = range(0, size - 1)

  const [state, dispatch] = useReducer(reducer, initialState)
  const solved = isSolved(state)

  const restart = () => dispatch({ type: 'RESTART' })

  return (
    <>
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
      <div className="mt-4">
        {/* success message */}
        {solved && <p className="text-lg font-serif mt-2">🥳 You solved it. Well done!</p>}
        <button className="button-xs button-white" onClick={restart}>
          Restart
        </button>
      </div>
    </>
  )
}

type Props = {
  initialState: PuzzleState
}
