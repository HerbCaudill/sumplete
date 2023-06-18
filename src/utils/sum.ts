interface HasValue {
  value: number
}
export const sum = (total: number, cell: HasValue) => total + cell.value
