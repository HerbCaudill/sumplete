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

  return (
    <div className="flex flex-col max-w-md">
      <div className="flex select-none">
        <div className={`grid grid-cols-${size + 1} border-2 object-scale-down`}>
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
      </div>
      <p className="text-lg font-serif mt-2 ">{solved && <>🥳 You solved it. Well done!</>}</p>
    </div>
  )
}

type Props = {
  initialState: PuzzleState
}
