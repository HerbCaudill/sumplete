import { useEffect, useState } from 'react'
import { formatSeconds } from '../formatSeconds'

export const RecordNotification = ({ time, size, onClose }: Props) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Auto-hide notification
    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) onClose()
    }, 6000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!visible) return null

  return (
    <div className="fixed top-4 left-0 w-full flex justify-center z-50">
      <div className="bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
        🏆
        <span className="font-bold">
          New {size}x{size} Record!
        </span>
        <span>{formatSeconds(time)}</span>
      </div>
    </div>
  )
}

type Props = {
  time: number
  size: number
  onClose?: () => void
}
