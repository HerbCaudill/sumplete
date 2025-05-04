import cx from 'classnames'
import { useRef, useState } from 'react'
import { Action } from 'reducer'
import { Cell } from 'types'

const LONG_PRESS_DURATION = 250 // milliseconds

export const ValueCell = ({ cell, dispatch }: Props) => {
  const { coordinates, value, state } = cell
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const [isLongPressing, setIsLongPressing] = useState(false)

  const toggleExclude = () => {
    if (state !== 'EXCLUDE') dispatch({ type: 'EXCLUDE', coordinates })
    else dispatch({ type: 'CLEAR', coordinates })
  }

  const toggleInclude = () => {
    if (state !== 'INCLUDE') dispatch({ type: 'INCLUDE', coordinates })
    else dispatch({ type: 'CLEAR', coordinates })
  }

  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsLongPressing(false)

    // Start the long press timer
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true)
      toggleInclude()
    }, LONG_PRESS_DURATION)
  }

  const handlePressEnd = (e: React.MouseEvent | React.TouchEvent) => {
    // Clear the long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    // Only trigger the normal click if it wasn't a long press
    if (!isLongPressing) {
      toggleExclude()
    }

    setIsLongPressing(false)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    // Prevent context menu from appearing
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  const handlePressCancel = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    setIsLongPressing(false)
  }

  return (
    <div
      className={cx(
        'Cell ValueCell flex items-center justify-center ', //
        'font-bold text-black cursor-pointer',
        'border border-gray-200 bg-white '
      )}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressCancel}
      onTouchStart={handlePressStart}
      onTouchEnd={e => {
        e.preventDefault()
        handlePressEnd(e)
      }}
      onTouchCancel={handlePressCancel}
      onContextMenu={handleContextMenu}
    >
      <div
        className={cx(
          'aspect-square rounded-full size-[30cqw] flex items-center justify-center',
          {
            'bg-green-500  text-white font-bold': state === 'INCLUDE',
            'text-gray-200': state === 'EXCLUDE'
          }
        )}
        style={{ fontSize: 'max(18px, min(40cqw, 30px))' }}
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
