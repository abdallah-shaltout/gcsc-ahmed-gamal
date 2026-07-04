import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'gcsdc-holidays'

function loadHolidays(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((d) => typeof d === 'string') : []
  } catch {
    return []
  }
}

export const useHolidaysStore = defineStore('holidays', () => {
  const holidays = ref<string[]>(loadHolidays())

  watch(holidays, (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  }, { deep: true })

  function addHoliday(date: string) {
    if (date && !holidays.value.includes(date)) {
      holidays.value = [...holidays.value, date].sort()
    }
  }

  function removeHoliday(date: string) {
    holidays.value = holidays.value.filter((d) => d !== date)
  }

  return { holidays, addHoliday, removeHoliday }
})
