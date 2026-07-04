<script setup lang="ts">
import { ref } from 'vue'
import { useHolidaysStore } from '@/stores/holidays'
import { useArabicDate } from '@/composables/useArabicDate'
import DatePicker from 'primevue/datepicker'
import Chip from 'primevue/chip'

const store = useHolidaysStore()
const { formatArabicDate } = useArabicDate()

const pickerDate = ref<Date | null>(null)

function toIso(d: Date | null): string {
  if (!d) return ''
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  const day = d.getDate()
  return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function handleAdd() {
  if (!pickerDate.value) return
  store.addHoliday(toIso(pickerDate.value))
  pickerDate.value = null
}
</script>

<template>
  <main class="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <h1 class="text-lg font-extrabold text-slate-800 mb-1">العطلات الرسمية</h1>
    <p class="text-xs text-slate-500 mb-5">
      الأيام المضافة هنا يتم تعطيلها تلقائيًا عند اختيار أيام الغياب المتقطع، بالإضافة إلى يوم الجمعة.
    </p>

    <div class="flex gap-2 mb-4">
      <DatePicker v-model="pickerDate" dateFormat="yy-mm-dd" showIcon iconDisplay="input" fluid inputClass="text-xs font-medium" class="flex-1" />
      <button @click="handleAdd" :disabled="!pickerDate"
        class="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-colors shrink-0">
        + إضافة
      </button>
    </div>

    <div v-if="store.holidays.length > 0"
      class="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
      <Chip v-for="d in store.holidays" :key="d"
        :label="formatArabicDate(d)"
        removable
        @remove="store.removeHoliday(d)"
        class="text-[10px] font-bold" />
    </div>
    <p v-else class="text-[10px] text-slate-400 text-center py-4 border border-dashed border-slate-200 rounded-xl">
      لم يتم إضافة أي عطلات رسمية بعد
    </p>
  </main>
</template>
