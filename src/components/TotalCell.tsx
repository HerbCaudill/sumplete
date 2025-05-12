import cx from 'classnames'

export const TotalCell = ({ targetValue, currentValue = 0, dir }: Props) => (
  <div className="Cell TotalCell">
    <div
      className={cx('flex gap-1 w-full leading-none p-[10cqw]', {
        'text-success-600': targetValue === currentValue,
        'flex-col items-center justify-start': dir === 'column',
        'flex-row items-center justify-start': dir === 'row'
      })}
      style={{
        fontSize: 'max(10px, min(30cqw, 20px))'
      }}
    >
      <span>{targetValue}</span>
      <span className="text-success-500">
        {targetValue === currentValue ? (
          <IconCircleCheckFilled className="size-[1.5em]" />
        ) : null}
      </span>
    </div>
  </div>
)

type Props = {
  targetValue?: number
  currentValue?: number
  dir?: 'row' | 'column'
}
