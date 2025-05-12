import { useEffect, useState } from 'react'
import { formatSeconds } from '../formatSeconds'
import cx from 'classnames'

type Props = {
  startTime: number
  isSolved: boolean
  bestTime: number | null
}

export const Timer = ({ startTime, isSolved, bestTime }: Props) => {
  const [timer, setTimer] = useState<Interval | null>(null)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (timer) clearInterval(timer)

    setTimer(
      setInterval(
        () => setSeconds(Math.floor((Date.now() - startTime) / 1000)),
        100
      )
    )

    // Clean up the interval when the component unmounts or when the effect runs again
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [startTime])

  // Stop the timer when the game is solved
  useEffect(() => {
    if (isSolved && timer) {
      clearInterval(timer)
      setTimer(null)
    }
  }, [isSolved])

  return (
    <div
      className={cx('border p-2 rounded-lg grow flex items-center gap-2', {
        'text-white border-transparent bg-success-500': isSolved
      })}
    >
      <IconStopwatch className="size-4" />
      <span className="text-sm font-semibold grow">
        {formatSeconds(seconds)}
      </span>
      {bestTime !== null && (
        <span className="text-xs">Best: {formatSeconds(bestTime)}</span>
      )}
    </div>
  )
}

type Interval = ReturnType<typeof setInterval>
