import cx from 'classnames'

export const TotalCell = ({ targetValue, currentValue = 0 }: Props) => (
  <div
    className={cx(
      'Cell TotalCell m-4',
      targetValue === currentValue //
        ? 'bg-green-600 text-white font-extrabold rounded-full'
        : ''
    )}
  >
    <span className="text-[30cqw]">{targetValue}</span>
  </div>
)

type Props = {
  targetValue?: number
  currentValue?: number
}
