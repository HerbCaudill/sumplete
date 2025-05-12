import cx from 'classnames'
import { Action } from 'reducer'
import { Cell } from 'types'

export const ValueCell = ({
  cell,
  dispatch,
  isCheckingMistakes = false
}: Props) => {
  const { row, col, value, state, included } = cell

  // Determine if this cell has a mistake (only when actively checking)
  const hasMistake =
    isCheckingMistakes &&
    ((state === 'INCLUDE' && !included) || // Included but shouldn't be
      (state === 'EXCLUDE' && included)) // Excluded but should be included

  return (
    <div
      className={cx(
        'Cell flex items-center justify-center ',
        'font-bold text-black cursor-pointer',
        'border border-gray-200 bg-white rounded-md',
        { 'border-red-500 border-2': hasMistake }
      )}
      onClick={e => {
        // cycle through the states
        if (state === 'EMPTY') {
          dispatch({ type: 'EXCLUDE', row, col })
        } else if (state === 'EXCLUDE') {
          dispatch({ type: 'INCLUDE', row, col })
        } else if (state === 'INCLUDE') {
          dispatch({ type: 'CLEAR', row, col })
        }
      }}
    >
      <div
        className={cx(
          'aspect-square rounded-full size-[60%] flex items-center justify-center',
          {
            'bg-green-500 text-white font-bold': state === 'INCLUDE',
            'text-gray-200': state === 'EXCLUDE'
          }
        )}
        style={{ fontSize: '40cqw' }}
      >
        {value}
      </div>
    </div>
  )
}

type Props = {
  cell: Cell
  dispatch: React.Dispatch<Action>
  isCheckingMistakes?: boolean
}
