export interface RangeProps {
  start?: number
  stop: number
  step?: number
}

// signature overloads
export function range(stop: number): number[]
export function range(start: number, stop: number): number[]
export function range(props: RangeProps): number[]

export function range(...args: unknown[]): number[] {
  const props = Object.getOwnPropertyNames(args[0]).includes('stop')
    ? args[0] // range({start: 2, stop:5}) = 2..5
    : args.length === 2
    ? { start: args[0], stop: args[1] } // range(0,5) = 0..5
    : args.length === 1
    ? { stop: args[0] } // range(5) = 1..5
    : undefined
  if (props === undefined)
    throw new Error('Incorrect arguments for the range function')

  const { start = 1, stop, step = 1 } = props as RangeProps

  return Array(Math.floor((stop - start) / step) + 1)
    .fill(start)
    .map((d, i) => d + i * step)
}
