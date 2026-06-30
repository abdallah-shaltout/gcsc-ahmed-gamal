<script setup lang="ts">
import { computed } from 'vue'
import { useAbsenceStore } from '@/stores/absence'
import { useArabicDate } from '@/composables/useArabicDate'

const store = useAbsenceStore()
const { formatArabicDate } = useArabicDate()

const excuseDeadlineDisplay = computed(() => formatArabicDate(store.excuseDeadline))

const sendDateBorderClass = computed(() => {
  if (!store.endDate || !store.sendDate || store.absenceType !== 'continuous') return 'border-slate-300'
  return store.sendDateValid ? 'border-slate-300' : 'border-red-400'
})
</script>

<template>
  <div class="space-y-3.5">

    <!-- متصل: بداية + نهاية -->
    <div v-if="store.absenceType === 'continuous'" class="grid grid-cols-2 gap-3">
      <div>
        <label class="block text-[11px] font-bold text-slate-700 mb-1">بداية الانقطاع</label>
        <input type="date" v-model="store.startDate"
          class="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium" />
      </div>
      <div>
        <label class="block text-[11px] font-bold text-slate-700 mb-1">نهاية الانقطاع</label>
        <input type="date" v-model="store.endDate"
          class="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium" />
      </div>
    </div>

    <!-- منقطع: عدد الأيام فقط -->
    <div v-else>
      <label class="block text-[11px] font-bold text-slate-700 mb-1">عدد أيام الغياب</label>
      <input type="number" v-model.number="store.absenceDays" min="1" placeholder="عدد الأيام"
        class="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium" />
    </div>

    <!-- تاريخ الإرسال -->
    <div>
      <label class="block text-[11px] font-bold text-slate-700 mb-1">
        تاريخ الإرسال
        <span v-if="store.absenceType === 'continuous' && store.endDate" class="text-[10px] font-normal text-slate-500 mr-2">
          — يجب أن يكون خلال 3 أيام من نهاية الانقطاع
        </span>
      </label>
      <input type="date" v-model="store.sendDate"
        :class="[sendDateBorderClass, 'w-full p-2.5 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium border']" />
      <p v-if="store.absenceType === 'continuous' && store.endDate && !store.sendDateValid" class="text-[10px] text-red-500 font-semibold mt-1">
        ⚠️ تاريخ الإرسال خارج النافذة المسموحة (نهاية الانقطاع + يومان فقط)
      </p>
    </div>

    <!-- تاريخ اتمام مدة موجبة -->
    <div>
      <label class="block text-[11px] font-bold text-slate-700 mb-1">تاريخ اتمام مدة موجبة لإنهاء الخدمة</label>
      <input type="date" v-model="store.terminationDueDate"
        class="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium" />
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
          <input type="radio" v-model="store.currentStatus" value="committed" class="w-4 h-4 text-emerald-600" />
          <span class="text-xs font-bold text-slate-800">ملتزم</span>
        </label>
        <label
          :class="store.currentStatus === 'absent'
            ? 'border-red-500 bg-red-50/50'
            : 'border-slate-200 hover:bg-slate-50'"
          class="flex items-center gap-2.5 p-3 border rounded-xl cursor-pointer transition-all"
        >
          <input type="radio" v-model="store.currentStatus" value="absent" class="w-4 h-4 text-red-600" />
          <span class="text-xs font-bold text-slate-800">منقطع</span>
        </label>
      </div>
      <div v-if="store.currentStatus === 'absent'" class="mt-3">
        <label class="block text-[11px] font-bold text-slate-700 mb-1">تاريخ الانقطاع الحالي</label>
        <input type="date" v-model="store.currentAbsenceDate"
          class="w-full p-2.5 border border-red-300 rounded-xl bg-red-50/30 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-xs font-medium" />
      </div>
    </div>

    <!-- تم انتهاء المدة القانونية -->
    <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
      <label class="flex items-start gap-2.5 cursor-pointer">
        <input type="checkbox" v-model="store.legalPeriodExpired" class="mt-1 w-4 h-4 text-slate-700 rounded border-slate-300" />
        <div class="flex flex-col">
          <span class="text-xs font-bold text-slate-800">تم انتهاء المدة القانونية لتقديم العذر</span>
          <span class="text-[10px] text-slate-500 mt-0.5">يُعدّل محتوى المذكرة للإشارة إلى انتهاء مهلة تقديم العذر.</span>
        </div>
      </label>
    </div>

  </div>
</template>
