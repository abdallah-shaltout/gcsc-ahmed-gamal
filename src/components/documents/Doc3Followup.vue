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
const greetingTarget = ref('السيد المهندس / مدير عام الإدارة العامة للورش والخدمات الفنية')
const titleText = ref('متابعة انقطاع موظف')

const bodyText = computed(() => {
  const e = emp.value
  if (!e) return ''
  const days = store.absenceDaysCount
  return `إيماءاً: إلى كتابكم الوارد لنا بشأن انقطاع السيد / <strong>${e.name}</strong> — كود رقم (${e.code}) — <strong>${e.title}</strong> — الإدارة العامة طرفكم عن العمل <strong>${days} يوماً</strong> متتالية اعتباراً من <strong>${formatArabicDate(store.startDate)}</strong> بدون إذن رغم إنذاره.`
})

const legalRef = ref('وحيث إن الفقرة السابعة من المادة (121) من لائحة نظام العاملين بالشركة قد نصت على أنه (يعتبر العامل مقدماً استقالته إذا انقطع عن العمل بغير إذن أكثر من عشرين يوماً متفرقة في السنة)، وتعتبر خدمته منتهية في هذه الحالة من اليوم التالي لاكتمال هذه المدة ويتعين كتابة سبب انتهاء الخدمة في ملف الخدمة الخاص بالعامل.')
const actionText = ref('لـذا: برجاء الإحاطة بما جاء بعاليه والتفضل بالتنسيق بمتابعة أيام الانقطاع المتصلة والمتقطعة للمذكور وفي حالة استكمال أيام الانقطاع للمدة القانونية الموجبة لإنهاء الخدمة تدال أيامه للإدارة العامة للشئون القانونية لاتخاذ اللازم.')
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
        <EditablePara v-model:text="legalRef" class="text-[12.5px]" />
        <EditablePara v-model:text="actionText" class="text-[12.5px]" />
      </div>
    </div>
    <p class="text-center font-bold mt-4">وتفضلوا بقبول فائق الاحترام،،،</p>
    <DocumentFooter />
  </div>
</template>
