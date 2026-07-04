<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAbsenceStore } from '@/stores/absence'
import { useArabicDate } from '@/composables/useArabicDate'
import DocumentHeader from '@/components/print/DocumentHeader.vue'
import DocumentFooter from '@/components/print/DocumentFooter.vue'
import EditablePara from '@/components/print/EditablePara.vue'

const store = useAbsenceStore()
const { formatArabicDate } = useArabicDate()
const emp = computed(() => store.selectedEmployee)
const refNo = computed(() => emp.value ? `CWS/${emp.value.code}/2026` : 'CWS/......../2026')

const titleText = ref('إنذار لتجاوز الحد الأقصى للانقطاع المتفرق')
const greetingTarget = ref('السيده الأستاذه / مدير إداره شئون الخدمه')

const bodyText = computed(() => {
  const e = emp.value
  if (!e) return ''
  return `إيماع: إلى كتابكم الوارد لنا بشأن انقطاع السيد / <strong>${e.name}</strong> — كود رقم (${e.code}) — عامل خدمه معاونه — عقد مؤقت — الإداره العامه طرفكم عن العمل <strong>${store.absenceDaysCount} أيام</strong> متتالية بدون إذن رغم إنذاره.`
})

const actionText = computed(() => {
  if (store.legalPeriodExpired) {
    return `لذا: وحيث انتهت المدة القانونية لتقديم العذر المحددة بـ ${store.excusePeriod} يوماً دون تقديم عذر مقبول، فإن الأمر يستوجب اتخاذ الإجراءات اللائحية.`
  }
  return 'لذا: يرجى التكرم بموافاتنا بموقف المذكور من العمل حتى تاريخه وذلك حتى يتسنى لنا العمل اللازم.'
})
</script>

<template>
  <div class="flex flex-col flex-grow">
    <DocumentHeader />
    <div class="flex justify-between items-center text-xs font-semibold mb-3">
      <p>رقم الصادر: <span class="font-bold">{{ refNo }}</span></p>
      <div class="text-left space-y-0.5">
        <p>تاريخ التحرير: <span class="font-bold">{{ formatArabicDate(store.draftDate) }}</span></p>
        <p>تاريخ الإرسال: <span class="font-bold">{{ formatArabicDate(store.sendDate) }}</span></p>
      </div>
    </div>
    <EditablePara v-model:text="titleText" tag="h4" class="text-center font-extrabold text-base underline decoration-double text-slate-950 my-3" />
    <div class="space-y-4 text-justify leading-relaxed flex-grow">
      <EditablePara v-model:text="greetingTarget" class="font-bold" />
      <p class="pr-3 font-semibold">تحيه طيبه وبعد ...</p>
      <div class="pr-3 space-y-3">
        <EditablePara :text="bodyText" class="text-[12.5px]" />
        <EditablePara :text="actionText" class="text-[12.5px]" />
      </div>
    </div>
    <p class="text-center font-bold mt-4">وتفضلوا بقبول فائق الإحترام،،،</p>
    <DocumentFooter signer-title="مدير إدارة وثائق الخدمة" />
  </div>
</template>
