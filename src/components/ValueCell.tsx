import cx from 'classnames'
import { Action } from 'reducer'
import { PuzzleCell } from 'types'

export const ValueCell = ({
  cell,
  dispatch,
  isCheckingMistakes = false
}: Props) => {
  const { row, col, value, state, included } = cell

  // Determine if this cell has a mistake (only when actively checking)
  const hasMistake =
    isCheckingMistakes &&
    ((state === '+' && !included) || // Included but shouldn't be
      (state === '-' && included)) // Excluded but should be included

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
        if (state === '?') {
          dispatch({ type: '-', row, col })
        } else if (state === '-') {
          dispatch({ type: '+', row, col })
        } else if (state === '+') {
          dispatch({ type: 'CLEAR', row, col })
        }
      }}
    >
      <div
        className={cx(
          'aspect-square rounded-full size-[60%] flex items-center justify-center',
          {
            'bg-green-500 text-white font-bold': state === '+',
            'text-gray-200': state === '-'
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
  cell: PuzzleCell
  dispatch: React.Dispatch<Action>
  isCheckingMistakes?: boolean
}
