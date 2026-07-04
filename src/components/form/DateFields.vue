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
const disabledHolidayDates = computed(() => holidaysStore.holidays.map((d) => new Date(d)))
const { formatArabicDate } = useArabicDate()

const excuseDeadlineDisplay = computed(() => formatArabicDate(store.excuseDeadline))

const sendDateInvalid = computed(() => {
  if (!store.endDate || !store.sendDate || store.absenceType !== 'continuous') return false
  return !store.sendDateValid
})

// ISO string (YYYY-MM-DD) <-> Date object bridges for DatePicker, since the
// store keeps plain date strings for all downstream day-count calculations.
function toDate(iso: string): Date | null {
  return iso ? new Date(iso) : null
}
function toIso(d: Date | null): string {
  return d ? d.toISOString().slice(0, 10) : ''
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

// intermittent date picker — multi-select, committed on confirm
const pickerDates = ref<Date[]>([])
function handleConfirmDates() {
  if (!pickerDates.value.length) return
  for (const d of pickerDates.value) {
    store.addAbsenceDate(toIso(d))
  }
  pickerDates.value = []
}
</script>

<template>
  <div class="space-y-3.5">

    <!-- متصل: بداية + نهاية -->
    <div v-if="store.absenceType === 'continuous'" class="grid grid-cols-2 gap-3">
      <div>
        <label class="block text-[11px] font-bold text-slate-700 mb-1">بداية الانقطاع</label>
        <DatePicker v-model="startDateModel" dateFormat="yy-mm-dd" showIcon iconDisplay="input" fluid inputClass="text-xs font-medium" />
      </div>
      <div>
        <label class="block text-[11px] font-bold text-slate-700 mb-1">نهاية الانقطاع</label>
        <DatePicker v-model="endDateModel" dateFormat="yy-mm-dd" showIcon iconDisplay="input" fluid inputClass="text-xs font-medium" />
      </div>
    </div>

    <!-- منقطع: منتقي أيام فردية -->
    <div v-else class="space-y-2">
      <div class="flex items-center justify-between mb-1">
        <label class="text-[11px] font-bold text-slate-700">أيام الغياب المتقطع</label>
        <div class="flex items-center gap-2">
          <span v-if="store.absenceDates.length > 0" class="text-[10px] font-bold bg-slate-800 text-white px-2 py-0.5 rounded-full">
            {{ store.absenceDates.length }} يوم
          </span>
          <button v-if="store.absenceDates.length > 0" @click="store.clearAbsenceDates()"
            class="text-[10px] text-red-500 hover:text-red-700 font-bold transition-colors">
            حذف الكل
          </button>
        </div>
      </div>

      <!-- multi-select date picker -->
      <DatePicker v-model="pickerDates" selectionMode="multiple" :manualInput="false" inline
        :disabledDays="[5]" :disabledDates="disabledHolidayDates"
        dateFormat="yy-mm-dd" class="w-full" />
      <button @click="handleConfirmDates" :disabled="!pickerDates.length"
        class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-colors">
        تأكيد الإضافة{{ pickerDates.length ? ` (${pickerDates.length})` : '' }}
      </button>

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
    </div>

    <!-- تاريخ الإرسال -->
    <div>
      <label class="block text-[11px] font-bold text-slate-700 mb-1">
        تاريخ الإرسال
        <span v-if="store.absenceType === 'continuous' && store.endDate" class="text-[10px] font-normal text-slate-500 mr-2">
          — يجب أن يكون خلال 3 أيام من نهاية الانقطاع
        </span>
      </label>
      <DatePicker v-model="sendDateModel" dateFormat="yy-mm-dd" showIcon iconDisplay="input" fluid :invalid="sendDateInvalid" inputClass="text-xs font-medium" />
      <p v-if="store.absenceType === 'continuous' && store.endDate && !store.sendDateValid" class="text-[10px] text-red-500 font-semibold mt-1">
        ⚠️ تاريخ الإرسال خارج النافذة المسموحة (نهاية الانقطاع + يومان فقط)
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
    <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
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
