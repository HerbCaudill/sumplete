import cx from 'classnames'
import { cellStyles } from './ValueCell'

export const TotalCell = ({ targetValue, currentValue = 0 }: Props) => (
  <div
    className={cx(
      cellStyles,
      'text-md',
      targetValue === currentValue //
        ? 'bg-green-600 text-white font-bold'
        : 'bg-gray-100'
    )}
  >
    {targetValue}
  </div>
)

type Props = {
  targetValue?: number
  currentValue?: number
}
