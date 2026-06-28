<script setup lang="ts">
import { computed } from 'vue'
import { useAbsenceStore } from '@/stores/absence'
import { useArabicDate } from '@/composables/useArabicDate'

const store = useAbsenceStore()
const { formatArabicDate } = useArabicDate()

const cardConfig = computed(() => {
  switch (store.validationStatus) {
    case 'void_company':
      return {
        cls: 'bg-red-50 text-red-700 border-red-200',
        icon: 'bg-red-600 animate-bounce',
        msg: `❌ هذا الخطاب باطل قانوناً! تجاوز التوقيت المسموح لإخطار الانقطاع ${store.absenceType === 'continuous' ? 'المتواصل (يرسل في اليوم 8 أو 9)' : 'المتفرق (يرسل من اليوم 16 حتى 19)'}.`,
      }
    case 'expired':
      return {
        cls: 'bg-orange-50 text-orange-700 border-orange-200',
        icon: 'bg-orange-500 animate-pulse',
        msg: `⚠️ تم انتهاء المدة القانونية لتقديم العذر (${store.excusePeriod} يوم). سيتم تعديل محتوى المذكرة.`,
      }
    case 'valid':
      return {
        cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: 'bg-emerald-600 animate-ping',
        msg: '✅ مكاتبة مستوفية للشروط وسارية قانونياً. جاهزة للتوقيع والاعتماد.',
      }
    default:
      return null
  }
})
</script>

<template>
  <div v-if="cardConfig" :class="cardConfig.cls" class="p-5 rounded-2xl border transition-all duration-300 shadow-sm">
    <h4 class="font-bold mb-2 text-sm flex items-center gap-2">
      <span :class="cardConfig.icon" class="inline-block w-2.5 h-2.5 rounded-full"></span>
      موقف الدائرة القانونية:
    </h4>
    <p class="text-xs leading-relaxed font-semibold">{{ cardConfig.msg }}</p>
    <div class="mt-3 pt-3 border-t border-black/10 flex justify-between items-center text-xs">
      <span class="font-bold">فترة الغياب المحسوبة:</span>
      <span class="font-extrabold bg-white/70 px-2.5 py-1 rounded-lg border border-black/5">
        {{ store.absenceDaysCount }} يوم
        <span v-if="store.excuseDeadline" class="text-[10px] font-normal mr-1">
          — مهلة العذر تنتهي: {{ formatArabicDate(store.excuseDeadline) }}
        </span>
      </span>
    </div>
  </div>
</template>
