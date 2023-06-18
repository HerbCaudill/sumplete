import cx from 'classnames'
import { Action } from 'reducer'
import { Cell } from 'types'

export const ValueCell = ({ cell, dispatch }: Props) => {
  const { coordinates, value, state } = cell
  const toggleExclude = () => {
    if (state !== 'EXCLUDE') dispatch({ type: 'EXCLUDE', coordinates })
    else dispatch({ type: 'CLEAR', coordinates })
  }

  const toggleInclude = () => {
    if (state !== 'INCLUDE') dispatch({ type: 'INCLUDE', coordinates })
    else dispatch({ type: 'CLEAR', coordinates })
  }

  const onClick = (e: React.MouseEvent) => {
    if (e.shiftKey) toggleInclude()
    else toggleExclude()
  }

  return (
    <div
      className={cx(
        cellStyles,
        'font-bold text-lg text-black text-transition-all duration-100 cursor-pointer',
        {
          'bg-white cursor-pointer hover:text-gray-400': state === undefined,
          'bg-green-600 hover:bg-green-500 text-white font-bold': state === 'INCLUDE',
          'bg-white text-gray-300': state === 'EXCLUDE',
        }
      )}
      onClick={onClick}
    >
      {value}
    </div>
  )
}

export const cellStyles = [
  'mx-[-1px] my-[-1px] w-16 h-16 border border-gray-200',
  'flex items-center justify-center',
  'transition-all duration-100',
]

type Props = {
  cell: Cell
  dispatch: React.Dispatch<Action>
}
