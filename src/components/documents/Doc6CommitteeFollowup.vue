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

const greetingTarget = ref('السيد المهندس / مدير عام الإدارة العامة للشمال')
const titleText = ref('إحاطة بقرار اللجنة')

const bodyText = computed(() => {
  const e = emp.value
  if (!e) return ''
  return `إيماءاً: إلى كتابكم بشأن انقطاع السيد / <strong>${e.name}</strong> — كود رقم (${e.code}) عن العمل أكثر من عشرين يوماً متفرقة بدون إذن رغم إنذاره.`
})

const committeeInfo = computed(() => {
  const d = store.committeeDate ? formatArabicDate(store.committeeDate) : '....../....../.......'
  const ref = store.committeeRefNo || '........'
  return `نحيط: سيادتكم علماً بأنه تم عرض أمر المذكور بالمحضر رقم (${ref}) بتاريخ ${d} والتي قررت:`
})

const decision = computed(() => {
  if (store.committeeDecision === 'accept') {
    return '1 - قبول العذر المقدم منه أمام اللجنة.\n2 - متابعة الموقف ورفع تقرير بنتيجة التسوية.'
  } else if (store.committeeDecision === 'terminate') {
    return '1 - إنهاء خدمة الموظف المذكور طبقاً للمادة (121) من لائحة نظام العاملين.\n2 - تطبيق قاعدة الأجر مقابل العمل.'
  }
  return '1 - .....................................\n2 - .....................................'
})

const actionText = ref('لذا: يرجى الإحاطة بما جاء بعاليه والتفضل بمتابعة أيام انقطاع المذكور بإدالتها للإدارة العامة للشئون القانونية لاتخاذ اللازم بشأنه.')
</script>

<template>
  <div class="flex flex-col flex-grow">
    <DocumentHeader />
    <div class="flex justify-between text-xs font-semibold mb-3">
      <p>رقم الصادر: <span class="font-bold">{{ refNo }}</span></p>
      <div class="text-left space-y-0.5">
        <p>تاريخ التحرير: <span class="font-bold">{{ formatArabicDate(store.draftDate) }}</span></p>
        <p>تاريخ الإرسال: <span class="font-bold">{{ formatArabicDate(store.sendDate) }}</span></p>
      </div>
    </div>
    <EditablePara v-model:text="titleText" tag="h4" class="text-center font-extrabold text-base underline decoration-double my-3" />
    <div class="space-y-4 text-justify leading-relaxed flex-grow">
      <EditablePara v-model:text="greetingTarget" class="font-bold" />
      <p class="pr-3 font-semibold">تحية طيبة وبعد،،،</p>
      <div class="pr-3 space-y-3">
        <EditablePara :text="bodyText" class="text-[12.5px]" />
        <EditablePara :text="committeeInfo" class="text-[12.5px]" />
        <EditablePara :text="decision" class="text-[12px] pr-4 whitespace-pre-line" />
        <EditablePara v-model:text="actionText" class="text-[12.5px]" />
      </div>
    </div>
    <p class="text-center font-bold mt-4">وتفضلوا بقبول فائق الاحترام،،،</p>
    <DocumentFooter />
  </div>
</template>
