import cx from 'classnames'

export const TotalCell = ({ targetValue, currentValue = 0, dir }: Props) => (
  <div className={cx('Cell TotalCell')}>
    <span
      className={cx('flex items-center justify-center gap-2', {
        'text-green-600': targetValue === currentValue,
        'flex-col': dir === 'column'
      })}
    >
      <span>{targetValue}</span>
      {targetValue === currentValue ? (
        <IconCircleCheckFilled className="size-[20cqw]" />
      ) : null}
    </span>
  </div>
)

type Props = {
  targetValue?: number
  currentValue?: number
  dir?: 'row' | 'column'
}
