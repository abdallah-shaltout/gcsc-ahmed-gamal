<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAbsenceStore } from '@/stores/absence'
import { useHolidaysStore } from '@/stores/holidays'
import { useArabicDate } from '@/composables/useArabicDate'
import DatePicker from 'primevue/datepicker'
import RadioButton from 'primevue/radiobutton'
import Checkbox from 'primevue/checkbox'
import Chip from 'primevue/chip'

const store = useAbsenceStore()
const holidaysStore = useHolidaysStore()
const disabledHolidayDates = computed(() =>
  holidaysStore.holidays.map((d) => {
    const parts = d.split('-').map(Number)
    return new Date(parts[0] ?? 0, (parts[1] ?? 1) - 1, parts[2] ?? 1)
  })
)
const { formatArabicDate } = useArabicDate()

// map "YYYY-MM-DD" holiday strings for quick lookup by calendar cell (date.year/month/day, month is 0-based)
const holidaySet = computed(() => new Set(holidaysStore.holidays))
function cellIso(date: { year: number; month: number; day: number }): string {
  return `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
}
function isHolidayCell(date: { year: number; month: number; day: number }): boolean {
  return holidaySet.value.has(cellIso(date))
}

const excuseDeadlineDisplay = computed(() => formatArabicDate(store.excuseDeadline))

const sendDateInvalid = computed(() => {
  if (!store.sendDate) return false
  if (store.absenceType === 'continuous') {
    if (!store.endDate) return false
    return !store.sendDateValid
  }
  if (!store.day15Date) return false
  return !store.sendDateValid
})

// ISO string (YYYY-MM-DD) <-> Date object bridges for DatePicker, since the
// store keeps plain date strings for all downstream day-count calculations.
function toDate(iso: string): Date | null {
  if (!iso) return null
  const parts = iso.split('-').map(Number)
  return new Date(parts[0] ?? 0, (parts[1] ?? 1) - 1, parts[2] ?? 1)
}
function toIso(d: Date | null): string {
  if (!d) return ''
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  const day = d.getDate()
  return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const startDateModel = computed<Date | null>({
  get: () => toDate(store.startDate),
  set: (d) => { store.startDate = toIso(d) },
})
const endDateModel = computed<Date | null>({
  get: () => toDate(store.endDate),
  set: (d) => { store.endDate = toIso(d) },
})
const sendDateModel = computed<Date | null>({
  get: () => toDate(store.sendDate),
  set: (d) => { store.sendDate = toIso(d) },
})
const terminationDueDateModel = computed<Date | null>({
  get: () => toDate(store.terminationDueDate),
  set: (d) => { store.terminationDueDate = toIso(d) },
})
const currentAbsenceDateModel = computed<Date | null>({
  get: () => toDate(store.currentAbsenceDate),
  set: (d) => { store.currentAbsenceDate = toIso(d) },
})

// intermittent date picker — multi-select, committed on confirm (max 15 days)
const pickerDates = ref<Date[]>([])
const remainingSlots = computed(() => store.MAX_ABSENCE_DATES - store.absenceDates.length)
function handleConfirmDates() {
  if (!pickerDates.value.length) return
  for (const d of pickerDates.value) {
    store.addAbsenceDate(toIso(d))
  }
  pickerDates.value = []
}

// second date picker — additional days beyond the 15, used to compute the
// valid send-date window (day 16-19 after the 15th absence day)
const extraPickerDates = ref<Date[]>([])
const extraDisabledDates = computed(() => [
  ...disabledHolidayDates.value,
  ...store.absenceDates.map((d) => toDate(d)).filter((d): d is Date => d !== null),
])
function handleConfirmExtraDates() {
  if (!extraPickerDates.value.length) return
  for (const d of extraPickerDates.value) {
    store.addExtraAbsenceDate(toIso(d))
  }
  extraPickerDates.value = []
}
</script>

<template>
  <div class="space-y-3.5">

    <!-- متصل: بداية + نهاية -->
    <div v-if="store.absenceType === 'continuous'" class="grid grid-cols-2 gap-3">
      <div>
        <label class="block text-[11px] font-bold text-slate-700 mb-1">بداية الانقطاع</label>
        <DatePicker v-model="startDateModel" dateFormat="yy-mm-dd" showIcon iconDisplay="input" fluid inputClass="text-xs font-medium">
          <template #date="{ date }">
            <span :title="isHolidayCell(date) ? 'عطلة رسمية' : undefined">{{ date.day }}</span>
          </template>
        </DatePicker>
      </div>
      <div>
        <label class="block text-[11px] font-bold text-slate-700 mb-1">نهاية الانقطاع</label>
        <DatePicker v-model="endDateModel" dateFormat="yy-mm-dd" showIcon iconDisplay="input" fluid inputClass="text-xs font-medium">
          <template #date="{ date }">
            <span :title="isHolidayCell(date) ? 'عطلة رسمية' : undefined">{{ date.day }}</span>
          </template>
        </DatePicker>
      </div>
    </div>

    <!-- منقطع: منتقي أيام فردية -->
    <div v-else class="space-y-2">
      <div class="flex items-center justify-between mb-1">
        <label class="text-[11px] font-bold text-slate-700">أيام الغياب المتقطع (حد أقصى 15 يوم)</label>
        <div class="flex items-center gap-2">
          <span v-if="store.absenceDates.length > 0" class="text-[10px] font-bold bg-slate-800 text-white px-2 py-0.5 rounded-full">
            {{ store.absenceDates.length }} / {{ store.MAX_ABSENCE_DATES }} يوم
          </span>
          <button v-if="store.absenceDates.length > 0" @click="store.clearAbsenceDates()"
            class="text-[10px] text-red-500 hover:text-red-700 font-bold transition-colors">
            حذف الكل
          </button>
        </div>
      </div>

      <!-- multi-select date picker -->
      <DatePicker v-model="pickerDates" selectionMode="multiple" :manualInput="false" inline
        :disabledDates="disabledHolidayDates"
        dateFormat="yy-mm-dd" class="w-full">
        <template #date="{ date }">
          <span :title="isHolidayCell(date) ? 'معطل — عطلة رسمية' : undefined">{{ date.day }}</span>
        </template>
      </DatePicker>
      <button @click="handleConfirmDates" :disabled="!pickerDates.length || remainingSlots <= 0"
        class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-colors">
        تأكيد الإضافة{{ pickerDates.length ? ` (${pickerDates.length})` : '' }}
      </button>
      <p v-if="remainingSlots <= 0" class="text-[10px] text-amber-600 font-semibold text-center">
        تم الوصول للحد الأقصى (15 يوم)
      </p>

      <!-- selected days chips -->
      <div v-if="store.absenceDates.length > 0"
        class="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl max-h-32 overflow-y-auto">
        <Chip v-for="d in store.absenceDates" :key="d"
          :label="formatArabicDate(d)"
          removable
          @remove="store.removeAbsenceDate(d)"
          class="text-[10px] font-bold" />
      </div>

      <p v-else class="text-[10px] text-slate-400 text-center py-2 border border-dashed border-slate-200 rounded-xl">
        لم يتم إضافة أي أيام غياب بعد
      </p>

      <!-- second picker: extra days to reach 21+, for send-date validity -->
      <div class="flex items-center justify-between mb-1 pt-2 border-t border-slate-200">
        <label class="text-[11px] font-bold text-slate-700">أيام إضافية (21 يوم أو أكثر إجمالاً)</label>
        <div class="flex items-center gap-2">
          <span v-if="store.extraAbsenceDates.length > 0" class="text-[10px] font-bold bg-slate-800 text-white px-2 py-0.5 rounded-full">
            {{ store.allAbsenceDates.length }} يوم إجمالي
          </span>
          <button v-if="store.extraAbsenceDates.length > 0" @click="store.clearExtraAbsenceDates()"
            class="text-[10px] text-red-500 hover:text-red-700 font-bold transition-colors">
            حذف الكل
          </button>
        </div>
      </div>

      <div v-if="store.day15Date" class="grid grid-cols-4 gap-1.5 text-center">
        <div v-for="(label, i) in ['يوم 16', 'يوم 17', 'يوم 18', 'يوم 19']" :key="label"
          class="rounded-lg border px-1.5 py-1"
          :class="[store.day16Date, store.day17Date, store.day18Date, store.day19Date][i]
            ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
            : 'border-slate-200 bg-slate-50 text-slate-400'">
          <div class="text-[9px] font-bold">{{ label }}</div>
          <div class="text-[9px] font-semibold">
            {{ [store.day16Date, store.day17Date, store.day18Date, store.day19Date][i]
              ? formatArabicDate([store.day16Date, store.day17Date, store.day18Date, store.day19Date][i])
              : '—' }}
          </div>
        </div>
      </div>

      <DatePicker v-model="extraPickerDates" selectionMode="multiple" :manualInput="false" inline
        :disabledDates="extraDisabledDates"
        dateFormat="yy-mm-dd" class="w-full">
        <template #date="{ date }">
          <span :title="isHolidayCell(date) ? 'معطل — عطلة رسمية' : undefined">{{ date.day }}</span>
        </template>
      </DatePicker>
      <button @click="handleConfirmExtraDates" :disabled="!extraPickerDates.length"
        class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-colors">
        تأكيد الإضافة{{ extraPickerDates.length ? ` (${extraPickerDates.length})` : '' }}
      </button>

      <div v-if="store.extraAbsenceDates.length > 0"
        class="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl max-h-32 overflow-y-auto">
        <Chip v-for="d in store.extraAbsenceDates" :key="d"
          :label="formatArabicDate(d)"
          removable
          @remove="store.removeExtraAbsenceDate(d)"
          class="text-[10px] font-bold" />
      </div>

      <p v-else class="text-[10px] text-slate-400 text-center py-2 border border-dashed border-slate-200 rounded-xl">
        لم يتم إضافة أي أيام إضافية بعد
      </p>
    </div>

    <!-- تاريخ الإرسال -->
    <div>
      <label class="block text-[11px] font-bold text-slate-700 mb-1">
        تاريخ الإرسال
        <span v-if="store.absenceType === 'continuous' && store.endDate" class="text-[10px] font-normal text-slate-500 mr-2">
          — يجب أن يكون خلال 3 أيام من نهاية الانقطاع
        </span>
        <span v-else-if="store.absenceType === 'intermittent' && store.day15Date" class="text-[10px] font-normal text-slate-500 mr-2">
          — يجب أن يكون من {{ formatArabicDate(store.day15Date) }}<template v-if="store.day19Date"> إلى {{ formatArabicDate(store.day19Date) }}</template><template v-else> وحتى تسجيل اليوم 19</template>
        </span>
      </label>
      <DatePicker v-model="sendDateModel" dateFormat="yy-mm-dd" showIcon iconDisplay="input" fluid :invalid="sendDateInvalid" inputClass="text-xs font-medium" />
      <p v-if="store.absenceType === 'continuous' && store.endDate && !store.sendDateValid" class="text-[10px] text-red-500 font-semibold mt-1">
        ⚠️ تاريخ الإرسال خارج النافذة المسموحة (نهاية الانقطاع + يومان فقط)
      </p>
      <p v-else-if="store.absenceType === 'intermittent' && store.day15Date && !store.sendDateValid" class="text-[10px] text-red-500 font-semibold mt-1">
        ⚠️ تاريخ الإرسال خارج النافذة المسموحة (من اليوم 15 إلى اليوم 19 من الغياب المتقطع)
      </p>
    </div>

    <!-- تاريخ اتمام مدة موجبة -->
    <div>
      <label class="block text-[11px] font-bold text-slate-700 mb-1">تاريخ اتمام مدة موجبة لإنهاء الخدمة</label>
      <DatePicker v-model="terminationDueDateModel" dateFormat="yy-mm-dd" showIcon iconDisplay="input" fluid inputClass="text-xs font-medium" />
    </div>

    <!-- مهلة تقديم العذر — عرض فقط، محسوبة من بداية الانقطاع + 25 -->
    <div v-if="store.excuseDeadline" class="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
      <span class="text-[11px] font-bold text-blue-800">مهلة تقديم العذر (25 يوم من البداية)</span>
      <span class="text-[11px] font-extrabold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
        {{ excuseDeadlineDisplay }}
      </span>
    </div>

    <!-- الموقف الحالي للعمل -->
    <div>
      <label class="block text-xs font-bold text-slate-700 mb-2">الموقف الحالي للعمل</label>
      <div class="grid grid-cols-2 gap-3">
        <label
          :class="store.currentStatus === 'committed'
            ? 'border-emerald-500 bg-emerald-50/50'
            : 'border-slate-200 hover:bg-slate-50'"
          class="flex items-center gap-2.5 p-3 border rounded-xl cursor-pointer transition-all"
        >
          <RadioButton v-model="store.currentStatus" value="committed" />
          <span class="text-xs font-bold text-slate-800">ملتزم</span>
        </label>
        <label
          :class="store.currentStatus === 'absent'
            ? 'border-red-500 bg-red-50/50'
            : 'border-slate-200 hover:bg-slate-50'"
          class="flex items-center gap-2.5 p-3 border rounded-xl cursor-pointer transition-all"
        >
          <RadioButton v-model="store.currentStatus" value="absent" />
          <span class="text-xs font-bold text-slate-800">منقطع</span>
        </label>
      </div>
      <div v-if="store.currentStatus === 'absent'" class="mt-3">
        <label class="block text-[11px] font-bold text-slate-700 mb-1">تاريخ الانقطاع الحالي</label>
        <DatePicker v-model="currentAbsenceDateModel" dateFormat="yy-mm-dd" showIcon iconDisplay="input" fluid inputClass="text-xs font-medium" />
      </div>
    </div>

    <!-- تم انتهاء المدة القانونية -->
    <div v-if="store.absenceType === 'continuous'" class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
      <label class="flex items-start gap-2.5 cursor-pointer">
        <Checkbox v-model="store.legalPeriodExpired" binary class="mt-1" />
        <div class="flex flex-col">
          <span class="text-xs font-bold text-slate-800">تم انتهاء المدة القانونية لتقديم العذر</span>
          <span class="text-[10px] text-slate-500 mt-0.5">يُعدّل محتوى المذكرة للإشارة إلى انتهاء مهلة تقديم العذر.</span>
        </div>
      </label>
    </div>

  </div>
</template>
