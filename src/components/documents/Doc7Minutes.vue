<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAbsenceStore } from '@/stores/absence'
import { useArabicDate } from '@/composables/useArabicDate'
import DocumentHeader from '@/components/print/DocumentHeader.vue'
import EditablePara from '@/components/print/EditablePara.vue'

const store = useAbsenceStore()
const { formatArabicDate } = useArabicDate()
const emp = computed(() => store.selectedEmployee)

const absenceSummary = computed(() => {
  const e = emp.value
  if (!e) return ''
  const days = store.absenceDaysCount
  const draftD = formatArabicDate(store.draftDate)
  const sendD = formatArabicDate(store.sendDate)
  const deadline = formatArabicDate(store.excuseDeadline)

  if (store.absenceType === 'intermittent') {
    const from = formatArabicDate(store.day15Date)
    return [
      `— تم التعاقد معه بوظيفة ${e.title} اعتباراً من .......`,
      `— ورد إلينا كتاب السيده الاستاذه / مدير اداره شئون الخدمه بشأن انقطاع المذكور عن العمل متقطعا اعتباراً من ${from} حتى تاريخه بدون إذن رغم انذاره.`,
      `— تم إنذار المذكور قانوناً صحيحاً في ${draftD}.`,
      `— انتهت المهلة القانونية لتقديم العذر في ${deadline}.`,
      `— بلغ إجمالي أيام الانقطاع المذكورة أكثر من (${days}) يوماً.`,
      '— تنطبق عليه نص المادة (121) الفقرة السابعة من لائحة نظام العاملين بالشركة للانقطاع عن العمل.',
    ].join('\n')
  }

  const start = formatArabicDate(store.startDate)
  const end = formatArabicDate(store.endDate)
  return [
    `— تم التعاقد معه بوظيفة ${e.title} اعتباراً من .......`,
    `— ورد إلينا كتاب جهة العمل بشأن انقطاع المذكور من العمل اعتباراً من ${start}${end ? ' حتى ' + end : ''} بدون إذن رغم إنذاره.`,
    `— تم إنذار المذكور قانونياً بتاريخ التحرير: ${draftD} وتم إرساله في: ${sendD}`,
    `— انتهت المهلة القانونية لتقديم العذر في: ${deadline}`,
    `— بلغت إجمالي أيام الانقطاع المذكورة أكثر من (${days}) يوماً.`,
    '— تم التواصل مع المذكور وأفاد بأنه لن يعود مرة أخرى.',
    '— تنطبق عليه نص المادة (121) الفقرة السابعة من لائحة نظام العاملين بالشركة للانقطاع عن العمل.',
  ].join('\n')
})

const recommendationsText = ref('— يُكمَّل بعد صدور قرار اللجنة —')
const committeeDecisionText = computed(() => {
  if (store.committeeDecision === 'terminate') return 'إنهاء خدمة الموظف المذكور طبقاً للمادة (121) من لائحة نظام العاملين بالشركة لانقطاعه عن العمل.'
  if (store.committeeDecision === 'accept') return 'قبول العذر المقدم من الموظف المذكور وتسوية ملفه وفق الإجراءات اللائحية المعتمدة.'
  return '— يُكتب قرار اللجنة هنا —'
})

const members = ref(['', '', '', '', '', '', ''])
</script>

<template>
  <div class="flex flex-col flex-grow">
    <DocumentHeader />

    <!-- Main table -->
    <div class="flex-grow overflow-auto">
      <table class="w-full border-collapse text-[11px]" style="border: 1px solid #374151">
        <thead>
          <tr>
            <th class="border border-slate-700 bg-slate-800 text-white p-2 text-center w-[5%]">م</th>
            <th class="border border-slate-700 bg-slate-800 text-white p-2 text-center w-[18%]">بيانات الموظف</th>
            <th class="border border-slate-700 bg-slate-800 text-white p-2 text-center w-[12%]">جهة العمل</th>
            <th class="border border-slate-700 bg-slate-800 text-white p-2 text-center w-[40%]">العرض</th>
            <th class="border border-slate-700 bg-slate-800 text-white p-2 text-center w-[25%]">التوصيات</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-slate-700 p-2 text-center font-bold align-top">1</td>
            <td class="border border-slate-700 p-2 align-top">
              <div class="space-y-1" v-if="emp">
                <p class="font-bold text-slate-900">{{ emp.name }}</p>
                <p class="text-slate-600">الكود: {{ emp.code }}</p>
                <p class="text-slate-600">الوظيفة: {{ emp.title }}</p>
                <p class="text-slate-500 text-[10px]">نوع العقد: عقد مؤقت</p>
              </div>
              <p v-else class="text-slate-400">اختر موظفاً</p>
            </td>
            <td class="border border-slate-700 p-2 text-center text-slate-700 align-top">{{ emp?.department ?? '........' }}</td>
            <td class="border border-slate-700 p-2 align-top">
              <EditablePara :text="absenceSummary" class="leading-relaxed text-slate-800 whitespace-pre-line" />
            </td>
            <td class="border border-slate-700 p-2 align-top">
              <EditablePara v-model:text="recommendationsText" class="text-slate-700" />
            </td>
          </tr>
          <tr style="height: 60px"><td class="border border-slate-700 p-2 text-center text-slate-300" colspan="1">2</td><td class="border border-slate-700" colspan="4"></td></tr>
          <tr style="height: 60px"><td class="border border-slate-700 p-2 text-center text-slate-300" colspan="1">3</td><td class="border border-slate-700" colspan="4"></td></tr>
        </tbody>
      </table>
    </div>

    <!-- Committee decision -->
    <div class="mt-4 border border-slate-300 rounded-lg p-4">
      <p class="font-extrabold text-sm text-slate-900 mb-2 border-b border-slate-200 pb-2">قرار اللجنة</p>
      <EditablePara :text="committeeDecisionText" class="text-[11px] text-slate-800 min-h-[50px]" />
    </div>

    <!-- Committee members -->
    <div class="mt-4">
      <p class="font-extrabold text-sm text-slate-900 mb-3 border-b border-slate-200 pb-2">أعضاء اللجنة</p>
      <div class="grid grid-cols-4 gap-4 text-center text-[10px]">
        <div v-for="(_, i) in members" :key="i" class="space-y-1">
          <p class="font-bold text-slate-700">{{ i === 3 ? 'رئيس اللجنة' : `-${i + 1}` }}</p>
          <div class="border-b border-slate-300 h-8"></div>
          <p class="text-slate-500">التوقيع</p>
        </div>
      </div>
    </div>
  </div>
</template>
