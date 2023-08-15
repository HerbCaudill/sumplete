import * as Headless from '@headlessui/react'
import { type ReactNode, useState } from 'react'
import cx from 'classnames'

export function RadioGroup<T extends string | number | boolean>({
  initialValue,
  onChange = () => {},
  options,
}: Props<T>) {
  const [selectedValue, setSelectedValue] = useState(initialValue)
  return (
    <Headless.RadioGroup
      value={selectedValue}
      onChange={(v: string) => {
        setSelectedValue(v)
        onChange(v)
      }}
      className="flex flex-row items-center space-x-2"
    >
      {/* options */}
      <div className="isolate inline-flex ">
        {options.map((o, i) => {
          const option = typeof o === 'string' ? { value: o, label: o } : o
          const { value, label = value.toString() } = option
          return (
            <Headless.RadioGroup.Option key={i} value={value}>
              {({ checked }) => (
                <span
                  className={cx([
                    'cursor-pointer relative inline-flex items-center border border-gray-300 px-3 py-1 text-sm font-medium',
                    'focus:z-10 focus:border-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-700',
                    // first item
                    { 'rounded-r-md': i === options.length - 1 },
                    // items after the first
                    { '-ml-px': i > 0 },
                    // last item
                    { 'rounded-l-md': i === 0 },
                    // selected
                    { 'bg-primary-600 text-white': checked },
                    // hover (unselected)
                    { 'hover:bg-gray-50 hover:text-black ': !checked },
                  ])}
                >
                  {label}
                </span>
              )}
            </Headless.RadioGroup.Option>
          )
        })}
      </div>
    </Headless.RadioGroup>
  )
}

type Props<T> = {
  label: ReactNode
  initialValue: string
  onChange?: (value: string) => void
  options: Options<T>
}

type Options<T> =
  | Array<{
      value: T
      label?: ReactNode
    }>
  | string[]
