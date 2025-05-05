import cx from 'classnames'
import { Action } from 'reducer'
import { Cell } from 'types'

export const ValueCell = ({ cell, dispatch }: Props) => {
  const { coordinates, value, state } = cell

  return (
    <div
      className={cx(
        'Cell flex items-center justify-center ',
        'font-bold text-black cursor-pointer',
        'border border-gray-200 bg-white rounded-md'
      )}
      onClick={e => {
        // cycle through the states
        if (state === 'EMPTY') {
          dispatch({ type: 'EXCLUDE', coordinates })
        } else if (state === 'EXCLUDE') {
          dispatch({ type: 'INCLUDE', coordinates })
        } else if (state === 'INCLUDE') {
          dispatch({ type: 'CLEAR', coordinates })
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
}
