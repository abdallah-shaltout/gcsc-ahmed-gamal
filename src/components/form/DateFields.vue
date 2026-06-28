<script setup lang="ts">
import { computed } from 'vue'
import { useAbsenceStore } from '@/stores/absence'
import { useArabicDate } from '@/composables/useArabicDate'

const store = useAbsenceStore()
const { formatArabicDate } = useArabicDate()

const excuseDeadlineDisplay = computed(() => formatArabicDate(store.excuseDeadline))
</script>

<template>
  <div class="space-y-3.5">

    <!-- بداية الانقطاع + نهاية/عدد الأيام -->
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="block text-[11px] font-bold text-slate-700 mb-1">بداية الانقطاع</label>
        <input type="date" v-model="store.startDate"
          class="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium" />
      </div>

      <!-- نهاية الانقطاع — متصل فقط -->
      <div v-if="store.absenceType === 'continuous'">
        <label class="block text-[11px] font-bold text-slate-700 mb-1">نهاية الانقطاع</label>
        <input type="date" v-model="store.endDate"
          class="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium" />
      </div>

      <!-- عدد الأيام — منقطع فقط -->
      <div v-else>
        <label class="block text-[11px] font-bold text-slate-700 mb-1">عدد أيام الغياب</label>
        <input type="number" v-model.number="store.absenceDays" min="1" placeholder="عدد الأيام"
          class="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium" />
      </div>
    </div>

    <!-- تاريخ التحرير + الإرسال -->
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="block text-[11px] font-bold text-slate-700 mb-1">تاريخ التحرير</label>
        <input type="date" v-model="store.draftDate"
          class="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium" />
      </div>
      <div>
        <label class="block text-[11px] font-bold text-slate-700 mb-1">تاريخ الإرسال</label>
        <input type="date" v-model="store.sendDate"
          class="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium" />
      </div>
    </div>

    <!-- تاريخ اتمام مدة موجبة -->
    <div>
      <label class="block text-[11px] font-bold text-slate-700 mb-1">تاريخ اتمام مدة موجبة لإنهاء الخدمة</label>
      <input type="date" v-model="store.terminationDueDate"
        class="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium" />
    </div>

    <!-- مهلة تقديم العذر -->
    <div>
      <label class="block text-[11px] font-bold text-slate-700 mb-1">
        مهلة تقديم العذر (بالأيام)
        <span v-if="store.excuseDeadline" class="text-[10px] font-normal text-slate-500 mr-2">
          — ينتهي في: {{ excuseDeadlineDisplay }}
        </span>
      </label>
      <input type="number" v-model.number="store.excusePeriod" min="1"
        class="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium" />
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
