import { useLocalStorage } from './useLocalStorage'
import { Completion, Completions, BestTimes } from '../types'

const COMPLETION_RECORDS_KEY = 'sumplete-completion-records'

export const useCompletionRecords = () => {
  const [records, setRecords] = useLocalStorage<Completions>(
    COMPLETION_RECORDS_KEY,
    {}
  )

  // Get all records for a specific puzzle size
  const getRecords = (size: number): Completion[] => records[size] || []

  // Record completion time for a specific puzzle size
  const saveTime = (size: number, time: number) => {
    const date = new Date().toISOString()
    setRecords({
      ...records,
      [size]: [...getRecords(size), { time, date }]
    })

    return isNewRecord(size, time)
  }

  // Check if a time is the new best time for a specific puzzle size
  const isNewRecord = (size: number, time: number): boolean => {
    const bestTime = getBestTime(size)
    return bestTime === null || time < bestTime
  }

  // Get the best time for a specific puzzle size
  const getBestTime = (size: number): number | null => {
    const sizeRecords = records[size] || []
    if (sizeRecords.length === 0) return null

    return Math.min(...sizeRecords.map(record => record.time))
  }

  return {
    records,
    saveTime,
    isNewRecord,
    getBestTime,
    getRecords
  }
}
