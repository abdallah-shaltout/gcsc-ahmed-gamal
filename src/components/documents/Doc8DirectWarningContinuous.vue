<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAbsenceStore } from '@/stores/absence'
import { useArabicDate } from '@/composables/useArabicDate'
import EditablePara from '@/components/print/EditablePara.vue'

const store = useAbsenceStore()
const { formatArabicDate } = useArabicDate()
const emp = computed(() => store.selectedEmployee)

const unitHeader = ref('الإدارة العامة — محطة ........')
const subUnit = ref('إدارة — محطة ........')
const formNo = ref('........')
const absencePeriods = ref(`من: ${new Date().toLocaleDateString('ar-EG')} إلى: ........\nمن: ........ إلى: ........`)
const legalText = ref('مما يستوجب (إعمال نص المادة 85 من اللائحة التنفيذية لقانون شركات قطاع الأعمال العام رقم 203 لسنة 1991 ونص المادة 121 الفقرة الداخلة (2) من لائحة نظام العاملين بالشركة).')
const actionText = computed(() =>
  `لذا: نرجو الالتزام والحضور لأعمال العمل وتقديم عذر موثق خلال ${store.excusePeriod} يوماً وإلا ستضطر أسفيين لإنهاء خدمتك للانقطاع عن العمل.`
)
</script>

<template>
  <div class="flex flex-col flex-grow">
    <!-- Local unit header -->
    <div class="text-center border-b-2 border-slate-900 pb-3 mb-4">
      <EditablePara v-model:text="unitHeader" class="font-extrabold text-sm" />
      <EditablePara v-model:text="subUnit" class="text-[10px] text-slate-600" />
    </div>

    <div class="space-y-4 flex-grow">
      <div class="flex justify-between text-xs font-semibold">
        <span>نموذج (إقرار غير متصل) رقم: <EditablePara tag="span" v-model:text="formNo" class="inline border-b border-slate-400 min-w-[30px]" /></span>
        <span>تاريخ الإصدار: <span class="font-bold">{{ formatArabicDate(store.draftDate) }}</span></span>
      </div>

      <h4 class="text-center font-extrabold text-base underline decoration-double my-3">الـمـذكـار بالإيـمـاء</h4>

      <div class="border border-slate-400 rounded p-3 mb-3 text-center">
        <p class="font-bold">السيد / <span class="bg-slate-100 px-2">{{ emp?.name ?? '— اسم الموظف —' }}</span></p>
        <p class="text-[11px] text-slate-600">{{ emp?.title ?? '— الوظيفة —' }}</p>
      </div>

      <div class="pr-3 space-y-3 text-justify text-[11.5px]">
        <p>نحيطك علماً بأنك انقطعت من العمل بدون أذن أيام متتالية كالآتي:</p>
        <div class="border border-dashed border-slate-300 rounded p-3">
          <EditablePara v-model:text="absencePeriods" class="whitespace-pre-line" />
        </div>
        <EditablePara v-model:text="legalText" class="leading-relaxed" />
        <EditablePara :text="actionText" class="leading-relaxed" />
      </div>
    </div>

    <div class="mt-auto border-t border-slate-300 pt-4 flex justify-between text-[10px]">
      <div><p class="font-bold">المدير العام</p><div class="border-b border-slate-300 h-8 w-32 mt-2"></div></div>
      <div><p class="font-bold">رئيس وحدة العاملين</p><div class="border-b border-slate-300 h-8 w-32 mt-2"></div></div>
      <div><p class="font-bold">مسئول الإجازات</p><div class="border-b border-slate-300 h-8 w-32 mt-2"></div></div>
    </div>
  </div>
</template>
