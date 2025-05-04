import cx from 'classnames'
import { Action } from 'reducer'
import { Cell } from 'types'
import { useState, useRef } from 'react'

const DOUBLE_TAP_DELAY = 300 // milliseconds

export const ValueCell = ({ cell, dispatch }: Props) => {
  const { coordinates, value, state } = cell
  const lastTap = useRef<number>(0)

  const toggleExclude = () => {
    if (state !== 'EXCLUDE') dispatch({ type: 'EXCLUDE', coordinates })
    else dispatch({ type: 'CLEAR', coordinates })
  }

  const toggleInclude = () => {
    if (state !== 'INCLUDE') dispatch({ type: 'INCLUDE', coordinates })
    else dispatch({ type: 'CLEAR', coordinates })
  }

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now()
    const timeSinceLastTap = now - lastTap.current

    if (timeSinceLastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      e.preventDefault()
      e.stopPropagation()
      toggleInclude()
      lastTap.current = 0 // Reset to prevent triple-tap detection
    } else {
      // Single tap
      toggleExclude()
      lastTap.current = now
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    // Prevent context menu from appearing
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  return (
    <div
      className={cx(
        'Cell ValueCell flex items-center justify-center', //
        'font-bold text-black cursor-pointer',
        {
          'border border-gray-200 bg-white ': state === 'EMPTY',
          'bg-green-500  text-white font-bold': state === 'INCLUDE',
          'border border-gray-200 bg-white text-gray-200': state === 'EXCLUDE'
        }
      )}
      onClick={handleTap}
      onTouchEnd={e => {
        e.preventDefault()
        handleTap(e)
      }}
      onContextMenu={handleContextMenu}
    >
      <span style={{ fontSize: 'max(18px, min(40cqw, 30px))' }}>{value}</span>
    </div>
  )
}

type Props = {
  cell: Cell
  dispatch: React.Dispatch<Action>
}
