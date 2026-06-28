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

// Editable text blocks — initialized from computed, user can override
const titleText = ref('إنذار أول بانقطاع متواصل عن العمل')
const greetingTarget = ref('السيد المهندس / مدير إدارة شئون الخدمة')

const bodyText = computed(() => {
  const e = emp.value
  const start = formatArabicDate(store.startDate)
  const end = formatArabicDate(store.endDate)
  const days = store.absenceDaysCount
  if (!e) return ''
  return `إيماءً: إلى كتابكم الصادر بشأن انقطاع السيد / <strong>${e.name}</strong> — كود رقم (${e.code}) — <strong>${e.title}</strong> — الإدارة العامة طرفكم عن العمل <strong>${days} يوماً</strong> متتالية اعتباراً من <strong>${start}</strong> حتى <strong>${end}</strong> بدون إذن رغم إنذاره.`
})

const legalText = ref('نرجو: التفضل بالإحاطة بأن المادة (121) الفقرة السابعة من لائحة نظام العاملين بالشركة قد نصت على أنه (يعتبر العامل مقدماً استقالته إذا انقطع عن العمل بغير إذن أكثر من عشرة أيام متتالية ما لم يقدم بعذر يقبله العضو المنتدب أو من يفوضه... إلخ).')

const actionText = computed(() => {
  if (store.legalPeriodExpired) {
    return `لذا: وحيث إنه قد انتهت المدة القانونية المقررة لتقديم العذر والمحددة بـ ${store.excusePeriod} يوماً من تاريخ الإرسال دون أن يتقدم الموظف المذكور بأي عذر مقبول قانوناً، فإن الأمر يستوجب اتخاذ الإجراءات اللائحية المقررة في هذا الشأن.`
  }
  return 'لذا: يرجى التكرم بالانتظار حتى اكتمال الخمسة عشر يوماً التالية من اليوم التالي لاكتمال أيام الانقطاع وموافاتنا بموقفه من العمل حتى تاريخه حتى يتسنى لنا اتخاذ اللازم.'
})

const currentStatusNote = computed(() => {
  if (store.currentStatus === 'absent' && store.currentAbsenceDate) {
    return `علماً بأن الموظف المذكور لا يزال منقطعاً عن العمل حتى تاريخ ${formatArabicDate(store.currentAbsenceDate)}.`
  }
  return ''
})
</script>

<template>
  <div class="flex flex-col flex-grow">
    <DocumentHeader />

    <!-- Meta row -->
    <div class="flex justify-between items-center text-xs font-semibold mb-3">
      <p>رقم الصادر الإداري: <span class="font-bold text-slate-900">{{ refNo }}</span></p>
      <div class="text-left space-y-0.5">
        <p>تاريخ التحرير: <span class="font-bold">{{ formatArabicDate(store.draftDate) }}</span></p>
        <p>تاريخ الإرسال: <span class="font-bold">{{ formatArabicDate(store.sendDate) }}</span></p>
      </div>
    </div>

    <!-- Void banner -->
    <div v-if="store.isVoid" class="mb-3 p-3.5 bg-red-50 text-red-950 rounded-lg border border-dashed border-red-400 font-bold text-center text-[11px]">
      ⚠️ [بطلان إداري]: تجاوز المدة الزمنية المتاحة للإنذار ({{ store.absenceDaysCount }} يوماً). يلزم تجميد المعاملة.
    </div>

    <!-- Title — editable -->
    <EditablePara
      v-model:text="titleText"
      tag="h4"
      class="text-center font-extrabold text-base underline decoration-double text-slate-950 my-3 tracking-wide"
    />

    <div class="space-y-4 text-justify leading-relaxed flex-grow">
      <!-- Greeting target — editable -->
      <EditablePara v-model:text="greetingTarget" class="font-bold" />
      <p class="pr-3 font-semibold">تحية طيبة وبعد،،،</p>

      <div class="pr-3 space-y-3.5">
        <!-- Body — auto from store, editable -->
        <EditablePara :text="bodyText" class="text-[12.5px]" />
        <EditablePara v-model:text="legalText" class="text-[12.5px]" />
        <!-- Action — auto from store, editable -->
        <EditablePara :text="actionText" class="text-[12.5px]" />
        <!-- Current status note -->
        <EditablePara v-if="currentStatusNote" :text="currentStatusNote" class="text-[12px] bg-red-50 p-2.5 border border-red-200 text-red-950 rounded font-semibold" />
      </div>
    </div>

    <p class="text-center font-bold mt-4">وتفضلوا بقبول فائق الاحترام،،،</p>

    <DocumentFooter />
  </div>
</template>
