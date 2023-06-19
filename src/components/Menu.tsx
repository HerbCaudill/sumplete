import * as Headless from '@headlessui/react'
import cx from 'classnames'

export default function Menu({ button, buttonStyles, header, items }: Props) {
  return (
    <Headless.Menu as="div" className="Menu relative inline-block text-left">
      <Headless.Menu.Button className={buttonStyles}>{button}</Headless.Menu.Button>

      <Headless.Menu.Items
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        unmount={false}
      >
        {header && <div className="px-4 py-3">{header} </div>}
        <div className="py-1">
          {items.map((item, i) => (
            <Headless.Menu.Item key={i}>
              {({ active }) => (
                <span
                  className={cx(
                    'MenuItem block',
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  )}
                >
                  {item}
                </span>
              )}
            </Headless.Menu.Item>
          ))}
        </div>
      </Headless.Menu.Items>
    </Headless.Menu>
  )
}

type Props = {
  button: React.ReactNode
  buttonStyles?: string
  header?: React.ReactNode
  items: React.ReactNode[]
}
