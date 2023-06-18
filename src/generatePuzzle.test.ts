import { generatePuzzle } from './generatePuzzle'

describe('generatePuzzle', () => {
  it('should generate a puzzle of the specified size', () => {
    const size = 5
    const puzzle = generatePuzzle({ size })
    expect(puzzle.rows.length).toBe(size)
    expect(puzzle.rows[0].length).toBe(size)
    expect(puzzle.rowTotals.length).toBe(size)
    expect(puzzle.colTotals.length).toBe(size)
  })

  it('should generate a puzzle with the specified seed', () => {
    const seed = 'test'
    const puzzle1 = generatePuzzle({ seed })
    const puzzle2 = generatePuzzle({ seed })
    expect(puzzle1).toEqual(puzzle2)
  })

  it('should generate a puzzle with random values', () => {
    const puzzle1 = generatePuzzle()
    const puzzle2 = generatePuzzle()
    expect(puzzle1).not.toEqual(puzzle2)
  })

  it('should calculate the correct row & column totals', () => {
    const puzzle = generatePuzzle({ size: 3, seed: 'test' })
    expect(puzzle.rowTotals.join()).toMatchInlineSnapshot('"22,14,7"')
    expect(puzzle.colTotals.join()).toMatchInlineSnapshot('"10,14,19"')
  })
})
