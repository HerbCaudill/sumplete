export function* combinations<T>(values: T[]): Generator<T[]> {
  yield []

  // Generate combinations of all sizes from 1 to values.length
  for (let size = 1; size <= values.length; size++) {
    // Use a recursive helper function to generate combinations of a specific size
    yield* generateCombinations(values, size)
  }
}

function* generateCombinations<T>(
  values: T[],
  size: number,
  startIndex = 0,
  current: T[] = []
): Generator<T[]> {
  // Base case: if we've selected enough elements, yield the current combination
  if (current.length === size) {
    yield [...current]
    return
  }

  // Try adding each remaining element to the current combination
  for (let i = startIndex; i < values.length; i++) {
    current.push(values[i])
    yield* generateCombinations(values, size, i + 1, current)
    current.pop() // Backtrack to try the next element
  }
}
