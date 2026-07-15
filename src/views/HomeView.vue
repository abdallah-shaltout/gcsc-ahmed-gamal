<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useAbsenceStore, documentLabels, type DocumentType } from '@/stores/absence'
import EmployeeSearch from '@/components/form/EmployeeSearch.vue'
import DateFields from '@/components/form/DateFields.vue'
import ValidationCard from '@/components/form/ValidationCard.vue'
import RadioButton from 'primevue/radiobutton'
import Select from 'primevue/select'
import Doc1Warning from '@/components/documents/Doc1Warning.vue'
import Doc2Intermittent from '@/components/documents/Doc2Intermittent.vue'
import Doc3Followup from '@/components/documents/Doc3Followup.vue'
import Doc4TerminationContinuous from '@/components/documents/Doc4TerminationContinuous.vue'
import Doc5TerminationIntermittent from '@/components/documents/Doc5TerminationIntermittent.vue'
import Doc6CommitteeFollowup from '@/components/documents/Doc6CommitteeFollowup.vue'
import Doc7Minutes from '@/components/documents/Doc7Minutes.vue'
import Doc8DirectWarningContinuous from '@/components/documents/Doc8DirectWarningContinuous.vue'
import Doc9DirectWarningIntermittent from '@/components/documents/Doc9DirectWarningIntermittent.vue'

const store = useAbsenceStore()
const toast = useToast()

function loadScenario(type: string) {
  const today = new Date()
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  const ago = (n: number) => { const d = new Date(); d.setDate(today.getDate() - n); return fmt(d) }
  const todayStr = fmt(today)
  if (type === 'valid_continuous') {
    store.absenceType = 'continuous'
    store.startDate = ago(8); store.endDate = ago(1)
    store.sendDate = todayStr
    store.legalPeriodExpired = false; store.currentStatus = 'committed'
    store.setEmployee('1')
  } else if (type === 'void_continuous') {
    store.absenceType = 'continuous'
    store.startDate = ago(12); store.endDate = ago(1)
    store.sendDate = todayStr
    store.legalPeriodExpired = false; store.currentStatus = 'committed'
    store.setEmployee('2')
  } else if (type === 'legal_expired') {
    store.absenceType = 'continuous'
    store.startDate = ago(25); store.endDate = ago(14)
    store.sendDate = ago(14)
    store.legalPeriodExpired = true; store.currentStatus = 'absent'
    store.currentAbsenceDate = todayStr
    store.setEmployee('3')
  } else if (type === 'valid_intermittent') {
    store.absenceType = 'intermittent'
    store.clearAbsenceDates()
    const sampleDates = [3,5,8,10,12,15,18,20,22,25,27,30,33,35,38,40,42].map(n => ago(n)).filter((d): d is string => !!d)
    sampleDates.forEach(d => store.addAbsenceDate(d))
    store.sendDate = todayStr
    store.legalPeriodExpired = false; store.currentStatus = 'committed'
    store.setEmployee('4')
  }
  store.resetDocOverride()
  toast.add({ severity: 'success', summary: 'تم تطبيق السيناريو بنجاح!', life: 3000 })
}

const docComponents: Record<DocumentType, any> = {
  warning_continuous: Doc1Warning,
  warning_intermittent: Doc2Intermittent,
  followup_absence: Doc3Followup,
  termination_continuous: Doc4TerminationContinuous,
  termination_intermittent: Doc5TerminationIntermittent,
  followup_committee: Doc6CommitteeFollowup,
  minutes: Doc7Minutes,
  direct_warning_continuous: Doc8DirectWarningContinuous,
  direct_warning_intermittent: Doc9DirectWarningIntermittent,
}

const isLandscape = computed(() => store.activeDoc === 'minutes')
const activeComponent = computed(() => docComponents[store.activeDoc])
const allDocs = Object.entries(documentLabels) as [DocumentType, string][]

const docSelectOptions = computed(() => [
  { label: `تلقائي (${documentLabels[store.autoSelectedDoc]})`, value: '' },
  {
    label: '── اختر يدوياً ──',
    items: allDocs.map(([key, label]) => ({ label, value: key })),
  },
])

function printDoc() {
  const el = document.getElementById('docPreview')
  if (!el) return
  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none;'
  document.body.appendChild(iframe)
  const doc = iframe.contentDocument!
  const orientation = isLandscape.value ? 'landscape' : 'portrait'
  const margin = isLandscape.value ? '10mm' : '15mm'
  doc.open()
  doc.write(`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{font-family:'Cairo',sans-serif;direction:rtl;color:#0f172a}
@page{size:A4 ${orientation};margin:${margin}}
.flex{display:flex}.flex-col{flex-direction:column}.flex-grow{flex:1 1 auto}
.justify-between{justify-content:space-between}.items-center{align-items:center}.items-start{align-items:flex-start}.items-end{align-items:flex-end}
.text-center{text-align:center}.text-justify{text-align:justify}.text-left{text-align:left}
.font-extrabold{font-weight:800}.font-bold{font-weight:700}.font-semibold{font-weight:600}
.text-sm{font-size:.875rem}.text-xs{font-size:.75rem}.text-base{font-size:1rem}
.underline{text-decoration:underline}.decoration-double{text-decoration-style:double}
.leading-relaxed{line-height:1.625}
.space-y-4>*+*{margin-top:1rem}.space-y-3\\.5>*+*{margin-top:.875rem}.space-y-3>*+*{margin-top:.75rem}
.space-y-2>*+*{margin-top:.5rem}.space-y-1>*+*{margin-top:.25rem}.space-y-0\\.5>*+*{margin-top:.125rem}
.border-b-2{border-bottom:2px solid}.border-t{border-top:1px solid}.border-b{border-bottom:1px solid}
.border{border:1px solid}.border-dashed{border-style:dashed}
.border-slate-900{border-color:#0f172a}.border-slate-700{border-color:#374151}
.border-slate-400{border-color:#94a3b8}.border-slate-300{border-color:#cbd5e1}.border-slate-200{border-color:#e2e8f0}
.border-red-400{border-color:#f87171}.border-red-200{border-color:#fecaca}
.rounded{border-radius:.25rem}.rounded-lg{border-radius:.5rem}
.bg-slate-100{background:#f1f5f9}.bg-slate-800{background:#1e293b}.bg-red-50{background:#fef2f2}
.text-slate-950{color:#020617}.text-slate-900{color:#0f172a}.text-slate-800{color:#1e293b}
.text-slate-700{color:#334155}.text-slate-600{color:#475569}.text-slate-500{color:#64748b}
.text-slate-400{color:#94a3b8}.text-slate-300{color:#cbd5e1}.text-red-950{color:#450a0a}.text-white{color:#fff}
.pb-4{padding-bottom:1rem}.pb-3{padding-bottom:.75rem}.pb-2{padding-bottom:.5rem}
.mb-5{margin-bottom:1.25rem}.mb-4{margin-bottom:1rem}.mb-3{margin-bottom:.75rem}.mb-2{margin-bottom:.5rem}.mb-1{margin-bottom:.25rem}
.mt-auto{margin-top:auto}.mt-4{margin-top:1rem}.mt-3{margin-top:.75rem}.mt-2{margin-top:.5rem}
.pt-5{padding-top:1.25rem}.pt-4{padding-top:1rem}.pt-3{padding-top:.75rem}.pt-2{padding-top:.5rem}
.pr-3{padding-right:.75rem}.pr-4{padding-right:1rem}.px-2{padding-left:.5rem;padding-right:.5rem}
.p-2{padding:.5rem}.p-3{padding:.75rem}.p-4{padding:1rem}.p-3\\.5{padding:.875rem}.p-2\\.5{padding:.625rem}
.p-2{padding:.5rem}
.w-12{width:3rem}.h-12{height:3rem}.w-8{width:2rem}.h-8{height:2rem}.w-32{width:8rem}
.min-w-8{min-width:2rem}.min-h-\\[50px\\]{min-height:50px}.min-w-\\[40px\\]{min-width:40px}
.inline{display:inline}.overflow-auto{overflow:visible}.align-top{vertical-align:top}
.whitespace-pre-line{white-space:pre-line}
.grid{display:grid}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.gap-4{gap:1rem}.gap-3{gap:.75rem}.gap-2{gap:.5rem}.gap-1{gap:.25rem}
.w-\\[5\\%\\]{width:5%}.w-\\[18\\%\\]{width:18%}.w-\\[12\\%\\]{width:12%}.w-\\[40\\%\\]{width:40%}.w-\\[25\\%\\]{width:25%}
table{border-collapse:collapse;width:100%}
td,th{border:1px solid #374151;padding:6px 10px;font-size:11px;vertical-align:top}
th{background:#1e293b;color:white;font-weight:700;text-align:center}
svg{display:inline-block;vertical-align:middle}
[contenteditable]{outline:none!important;background:transparent!important;box-shadow:none!important}
.text-\\[11px\\]{font-size:11px}.text-\\[10px\\]{font-size:10px}.text-\\[10\\.5px\\]{font-size:10.5px}
.text-\\[11\\.5px\\]{font-size:11.5px}.text-\\[12px\\]{font-size:12px}.text-\\[12\\.5px\\]{font-size:12.5px}
.text-\\[13px\\]{font-size:13px}
</style></head><body style="margin:0;padding:0">${el.innerHTML}</body></html>`)
  doc.close()
  iframe.contentWindow!.focus()
  iframe.contentWindow!.print()
  setTimeout(() => document.body.removeChild(iframe), 1500)
}
</script>

<template>
  <main class="flex-grow max-w-[1600px] w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">

    <!-- Quick scenarios -->
    <div class="mb-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm no-print">
      <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <svg class="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        محاكي الحالات السريعة
      </h3>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button @click="loadScenario('valid_continuous')" class="p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-bold transition-all text-right flex items-center gap-2.5">
          <span class="shrink-0 p-1.5 bg-emerald-100 rounded-lg text-emerald-700 text-base leading-none">✓</span>
          <div class="flex flex-col items-start"><span class="text-slate-800">انقطاع متواصل سليم</span><span class="text-[10px] font-normal text-slate-500">إنذار اليوم الـ8</span></div>
        </button>
        <button @click="loadScenario('void_continuous')" class="p-2.5 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-xl text-xs font-bold transition-all text-right flex items-center gap-2.5">
          <span class="shrink-0 p-1.5 bg-red-100 rounded-lg text-red-700 text-base leading-none">✗</span>
          <div class="flex flex-col items-start"><span class="text-slate-800">تنبيه باطل قانوناً</span><span class="text-[10px] font-normal text-slate-500">تأخر يبطله</span></div>
        </button>
        <button @click="loadScenario('legal_expired')" class="p-2.5 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-xs font-bold transition-all text-right flex items-center gap-2.5">
          <span class="shrink-0 p-1.5 bg-orange-100 rounded-lg text-orange-700 text-base leading-none">⏰</span>
          <div class="flex flex-col items-start"><span class="text-slate-800">انتهت مهلة العذر</span><span class="text-[10px] font-normal text-slate-500">مدة قانونية منتهية</span></div>
        </button>
        <button @click="loadScenario('valid_intermittent')" class="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-bold transition-all text-right flex items-center gap-2.5">
          <span class="shrink-0 p-1.5 bg-blue-100 rounded-lg text-blue-700 text-base leading-none font-mono">≈</span>
          <div class="flex flex-col items-start"><span class="text-slate-800">انقطاع متفرّق سليم</span><span class="text-[10px] font-normal text-slate-500">17 يوم منقطع</span></div>
        </button>
      </div>
    </div>

    <!-- Two-column layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      <!-- Form panel -->
      <div class="lg:col-span-5 space-y-5 no-print">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="bg-gradient-to-l from-slate-900 to-slate-800 p-4 text-white flex justify-between items-center">
            <h3 class="text-sm font-bold flex items-center gap-2">
              <span class="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse"></span>
              معطيات الانقطاع
            </h3>
            <span class="text-[10px] text-slate-400 font-mono">GCSDC — HR System</span>
          </div>
          <div class="p-5 space-y-5">
            <EmployeeSearch />
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-2">طبيعة الانقطاع</label>
              <div class="grid grid-cols-2 gap-3">
                <label :class="store.absenceType === 'continuous' ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-400/30' : 'border-slate-200 hover:bg-slate-50'" class="flex items-center gap-2.5 p-3 border rounded-xl cursor-pointer transition-all">
                  <RadioButton v-model="store.absenceType" value="continuous" class="shrink-0" />
                  <div class="flex flex-col">
                    <span class="text-xs font-bold text-slate-800">غياب متصل</span>
                    <span class="text-[10px] text-slate-500">حد قانوني 7 أيام</span>
                  </div>
                </label>
                <label :class="store.absenceType === 'intermittent' ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-400/30' : 'border-slate-200 hover:bg-slate-50'" class="flex items-center gap-2.5 p-3 border rounded-xl cursor-pointer transition-all">
                  <RadioButton v-model="store.absenceType" value="intermittent" class="shrink-0" />
                  <div class="flex flex-col">
                    <span class="text-xs font-bold text-slate-800">غياب منقطع</span>
                    <span class="text-[10px] text-slate-500">حد قانوني 15 يوماً</span>
                  </div>
                </label>
              </div>
            </div>
            <DateFields />
          </div>
        </div>

        <ValidationCard />

        <div class="grid grid-cols-3 gap-3">
          <RouterLink to="/committee" class="p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            عرض لجنة
          </RouterLink>
          <RouterLink to="/minutes" class="p-3 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            المحضر
          </RouterLink>
          <RouterLink to="/documents" class="p-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            كل النماذج
          </RouterLink>
        </div>

        <div class="bg-slate-900 text-slate-300 p-4 rounded-2xl border border-slate-800 shadow-lg">
          <h4 class="text-xs font-bold text-blue-400 mb-3 flex items-center gap-1.5">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            المرجع القانوني — المادة (121)
          </h4>
          <ul class="space-y-2.5 text-[11px] text-slate-400 leading-relaxed">
            <li class="flex items-start gap-1.5"><span class="text-blue-400 shrink-0">•</span><span><strong class="text-slate-300">متواصل:</strong> الحد الأدنى 7 أيام. يُرسل الإنذار خلال 3 أيام من نهاية الانقطاع. ما بعد ذلك = باطل.</span></li>
            <li class="flex items-start gap-1.5"><span class="text-blue-400 shrink-0">•</span><span><strong class="text-slate-300">متفرق:</strong> الحد الأدنى 15 يوماً. يُرسل الإنذار من اليوم 15 وحتى اليوم 19. ما بعد اليوم 19 = باطل.</span></li>
            <li class="flex items-start gap-1.5"><span class="text-blue-400 shrink-0">•</span><span><strong class="text-slate-300">مهلة العذر:</strong> 25 يوماً من تاريخ بداية الانقطاع.</span></li>
          </ul>
        </div>
      </div>

      <!-- Live document preview -->
      <div class="lg:col-span-7 flex flex-col items-center lg:sticky lg:top-4">

        <!-- Preview toolbar -->
        <div class="w-full flex flex-wrap justify-between items-end gap-3 mb-3 no-print">
          <div>
            <p class="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-0.5">
              <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              معاينة مباشرة
            </p>
            <p class="text-[10px] text-slate-400">
              تلقائي: <span class="font-bold text-blue-600">{{ documentLabels[store.autoSelectedDoc] }}</span>
              <span v-if="store.selectedDoc" class="text-orange-500 mr-2">← تم التعديل يدوياً</span>
            </p>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <Select
              :modelValue="store.selectedDoc ?? ''"
              @update:modelValue="(v: string) => { store.selectedDoc = v ? v as DocumentType : null }"
              :options="docSelectOptions"
              optionLabel="label"
              optionValue="value"
              optionGroupLabel="label"
              optionGroupChildren="items"
              class="text-xs"
            />

            <button
              v-if="store.selectedDoc"
              @click="store.resetDocOverride()"
              class="px-2.5 py-1.5 text-[11px] text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-all font-bold"
            >
              ↺ تلقائي
            </button>

            <button
              @click="printDoc"
              class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              طباعة
            </button>
          </div>
        </div>

        <!-- A4 preview box -->
        <div
          id="docPreview"
          :class="[
            'bg-white shadow-2xl border border-slate-300/80 rounded-2xl text-black leading-relaxed flex flex-col w-full',
            isLandscape ? 'max-w-[1050px] p-8 text-[11px]' : 'max-w-[640px] p-12 text-[12.5px]'
          ]"
          :style="isLandscape ? 'min-height:680px' : 'min-height:877px'"
        >
          <component :is="activeComponent" />
        </div>

        <p class="no-print text-[10px] text-slate-400 mt-3 text-center select-none">
          💡 انقر على أي نص في الورقة لتعديله مباشرة قبل الطباعة
        </p>
      </div>
    </div>
  </main>
</template>
