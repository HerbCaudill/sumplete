import { generatePuzzle } from 'generatePuzzle'
import { solve } from 'solve'
import { bench, describe } from 'vitest'

// create puzzles from 2x2 to 7x7
const puzzles = Object.fromEntries(
  Array.from({ length: 6 }, (_, i) => {
    const size = i + 2
    const puzzle = generatePuzzle({ size, seed: 'test' })
    return [size, puzzle]
  })
)

// Benchmark the solver
describe('solver', () => {
  for (const [size, puzzle] of Object.entries(puzzles)) {
    bench(`${size}x${size}`, () => {
      solve(puzzle)
    })
  }
})
