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
        'Cell ValueCell', //
        'font-bold text-black cursor-pointer',
        {
          'border border-gray-200 bg-white ': state === 'EMPTY',
          'bg-green-600  text-white font-bold': state === 'INCLUDE',
          'border border-gray-200 bg-white text-gray-200': state === 'EXCLUDE',
        }
      )}
      onClick={onClick}
    >
      <span>{value}</span>
    </div>
  )
}

type Props = {
  cell: Cell
  dispatch: React.Dispatch<Action>
}
