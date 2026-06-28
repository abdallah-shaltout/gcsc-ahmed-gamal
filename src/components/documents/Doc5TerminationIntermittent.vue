<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAbsenceStore } from '@/stores/absence'
import { useArabicDate } from '@/composables/useArabicDate'
import DocumentHeader from '@/components/print/DocumentHeader.vue'
import EditablePara from '@/components/print/EditablePara.vue'

const store = useAbsenceStore()
const { formatArabicDate } = useArabicDate()
const emp = computed(() => store.selectedEmployee)

const decreeNo = ref('........')
const legalBasis = ref('بعد الاطلاع على القانون رقم 203 لسنة 1991... ولوائحه التنفيذية، وعلى لائحة نظام العاملين بالشركة، وعلى قانون 148 لسنة 2019...')

const article1 = computed(() => {
  const e = emp.value
  const date = store.terminationDueDate ? formatArabicDate(store.terminationDueDate) : '....../....../.......'
  if (!e) return 'مادة أولى: اعتباراً من ....... تنتهي خدمة الموظف...'
  return `مادة أولى: اعتباراً من ${date} تنتهي خدمة السيد / ${e.name} — كود رقم (${e.code}) — ${e.title} — ${e.department} — عقد مؤقت، طبقاً لنص المادة (121) من لائحة نظام العاملين بالشركة وذلك لانقطاعه المتفرق عن العمل.`
})

const article2 = ref('مادة ثانية: تطبق قاعدة الاجر مقابل العمل على المذكور.')
const article3 = ref('مادة ثالثة: على الجهات المعنية تنفيذ ذلك.')
const signerName = ref('المهندس: .....................................')
const copyRecipient = ref('الأستاذ: .....................................\nمدير عام تنمية الموارد البشرية')
</script>

<template>
  <div class="flex flex-col flex-grow">
    <DocumentHeader />
    <div class="flex justify-between text-xs mb-3">
      <span>قرار رقم (<EditablePara tag="span" v-model:text="decreeNo" class="inline min-w-8" />)</span>
      <span>الصادر بتاريخ: <span class="font-bold">{{ formatArabicDate(store.draftDate) }}</span></span>
    </div>
    <div class="space-y-4 flex-grow text-justify leading-relaxed">
      <EditablePara v-model:text="legalBasis" class="text-[11px]" />
      <div class="border-t border-slate-300 pt-3">
        <p class="font-extrabold text-center text-base mb-3">ق ـ ـ ـ ر ـ ـ ـ ر</p>
        <div class="space-y-2 text-[11.5px]">
          <EditablePara :text="article1" class="leading-relaxed" />
          <EditablePara v-model:text="article2" />
          <EditablePara v-model:text="article3" />
        </div>
      </div>
    </div>
    <div class="mt-auto border-t border-slate-300 pt-4 text-[10.5px]">
      <EditablePara v-model:text="signerName" class="font-bold" />
      <p class="font-bold">رئيس مجلس إدارة والعضو المنتدب</p>
      <div class="border-t pt-3 mt-3">
        <p class="font-bold mb-1">صورة مرسلة للسيد /</p>
        <p>برجاء الإحاطة بما جاء بعاليه وتنفيذ ذلك</p>
        <EditablePara v-model:text="copyRecipient" class="mt-2 font-bold whitespace-pre-line" />
      </div>
    </div>
  </div>
</template>
