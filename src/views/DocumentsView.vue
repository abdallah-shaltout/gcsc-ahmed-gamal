<script setup lang="ts">
import { ref } from 'vue'
import { useAbsenceStore, documentLabels, type DocumentType } from '@/stores/absence'
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

const docList: { key: DocumentType; label: string; component: any; isLandscape?: boolean }[] = [
  { key: 'warning_continuous', label: documentLabels['warning_continuous'], component: Doc1Warning },
  { key: 'warning_intermittent', label: documentLabels['warning_intermittent'], component: Doc2Intermittent },
  { key: 'followup_absence', label: documentLabels['followup_absence'], component: Doc3Followup },
  { key: 'termination_continuous', label: documentLabels['termination_continuous'], component: Doc4TerminationContinuous },
  { key: 'termination_intermittent', label: documentLabels['termination_intermittent'], component: Doc5TerminationIntermittent },
  { key: 'followup_committee', label: documentLabels['followup_committee'], component: Doc6CommitteeFollowup },
  { key: 'minutes', label: documentLabels['minutes'], component: Doc7Minutes, isLandscape: true },
  { key: 'direct_warning_continuous', label: documentLabels['direct_warning_continuous'], component: Doc8DirectWarningContinuous },
  { key: 'direct_warning_intermittent', label: documentLabels['direct_warning_intermittent'], component: Doc9DirectWarningIntermittent },
]

const activeKey = ref<DocumentType>('warning_continuous')
const activeDoc = () => docList.find(d => d.key === activeKey.value)

function setDocAndNavigate(key: DocumentType) {
  store.selectedDoc = key
}

function printActive() {
  const doc = activeDoc()
  if (!doc) return
  const el = document.getElementById('docsPreview')
  if (!el) return
  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none;'
  document.body.appendChild(iframe)
  const orientation = doc.isLandscape ? 'landscape' : 'portrait'
  const margin = doc.isLandscape ? '10mm' : '15mm'
  const d = iframe.contentDocument!
  d.open()
  d.write(`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0;padding:0}html,body{font-family:'Cairo',sans-serif;direction:rtl;color:#0f172a}@page{size:A4 ${orientation};margin:${margin}}
.flex{display:flex}.flex-col{flex-direction:column}.flex-grow{flex:1 1 auto}.justify-between{justify-content:space-between}.items-center{align-items:center}.items-start{align-items:flex-start}
.text-center{text-align:center}.text-justify{text-align:justify}.text-left{text-align:left}.font-extrabold{font-weight:800}.font-bold{font-weight:700}.font-semibold{font-weight:600}
.text-sm{font-size:.875rem}.text-xs{font-size:.75rem}.text-base{font-size:1rem}.underline{text-decoration:underline}.decoration-double{text-decoration-style:double}.leading-relaxed{line-height:1.625}
.space-y-4>*+*{margin-top:1rem}.space-y-3\\.5>*+*{margin-top:.875rem}.space-y-3>*+*{margin-top:.75rem}.space-y-2>*+*{margin-top:.5rem}.space-y-1>*+*{margin-top:.25rem}.space-y-0\\.5>*+*{margin-top:.125rem}
.border-b-2{border-bottom:2px solid}.border-t{border-top:1px solid}.border-b{border-bottom:1px solid}.border{border:1px solid}.border-dashed{border-style:dashed}
.border-slate-900{border-color:#0f172a}.border-slate-700{border-color:#374151}.border-slate-400{border-color:#94a3b8}.border-slate-300{border-color:#cbd5e1}.border-slate-200{border-color:#e2e8f0}
.rounded{border-radius:.25rem}.rounded-lg{border-radius:.5rem}
.bg-slate-100{background:#f1f5f9}.bg-slate-800{background:#1e293b}.bg-red-50{background:#fef2f2}
.text-slate-950{color:#020617}.text-slate-900{color:#0f172a}.text-slate-800{color:#1e293b}.text-slate-700{color:#334155}.text-slate-600{color:#475569}.text-slate-500{color:#64748b}.text-slate-400{color:#94a3b8}.text-slate-300{color:#cbd5e1}.text-white{color:#fff}
.mb-5{margin-bottom:1.25rem}.mb-4{margin-bottom:1rem}.mb-3{margin-bottom:.75rem}.mb-2{margin-bottom:.5rem}.mb-1{margin-bottom:.25rem}.mt-auto{margin-top:auto}.mt-4{margin-top:1rem}.mt-3{margin-top:.75rem}.mt-2{margin-top:.5rem}
.pb-4{padding-bottom:1rem}.pb-3{padding-bottom:.75rem}.pb-2{padding-bottom:.5rem}.pt-4{padding-top:1rem}.pt-3{padding-top:.75rem}.pt-2{padding-top:.5rem}
.pr-3{padding-right:.75rem}.pr-4{padding-right:1rem}.p-2{padding:.5rem}.p-3{padding:.75rem}.p-4{padding:1rem}.p-3\\.5{padding:.875rem}.p-2\\.5{padding:.625rem}
.w-12{width:3rem}.h-12{height:3rem}.w-8{width:2rem}.h-8{height:2rem}.w-32{width:8rem}.min-w-8{min-width:2rem}.min-w-\\[40px\\]{min-width:40px}.min-h-\\[50px\\]{min-height:50px}
.inline{display:inline}.overflow-auto{overflow:visible}.align-top{vertical-align:top}.whitespace-pre-line{white-space:pre-line}
.grid{display:grid}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.gap-4{gap:1rem}.gap-3{gap:.75rem}.gap-2{gap:.5rem}.gap-1{gap:.25rem}
.w-\\[5\\%\\]{width:5%}.w-\\[18\\%\\]{width:18%}.w-\\[12\\%\\]{width:12%}.w-\\[40\\%\\]{width:40%}.w-\\[25\\%\\]{width:25%}
table{border-collapse:collapse;width:100%}td,th{border:1px solid #374151;padding:6px 10px;font-size:11px;vertical-align:top}th{background:#1e293b;color:white;font-weight:700;text-align:center}
svg{display:inline-block;vertical-align:middle}[contenteditable]{outline:none!important;background:transparent!important;box-shadow:none!important}
.text-\\[11px\\]{font-size:11px}.text-\\[10px\\]{font-size:10px}.text-\\[10\\.5px\\]{font-size:10.5px}.text-\\[11\\.5px\\]{font-size:11.5px}.text-\\[12px\\]{font-size:12px}.text-\\[12\\.5px\\]{font-size:12.5px}
</style></head><body style="margin:0;padding:0">${el.innerHTML}</body></html>`)
  d.close()
  iframe.contentWindow!.focus()
  iframe.contentWindow!.print()
  setTimeout(() => document.body.removeChild(iframe), 1500)
}
</script>

<template>
  <main class="flex-grow max-w-[1600px] mx-auto px-4 py-6 w-full">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      <!-- Doc list sidebar -->
      <div class="lg:col-span-3 space-y-3 no-print">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="bg-gradient-to-l from-emerald-900 to-emerald-800 p-4 text-white">
            <h3 class="text-sm font-bold">كل النماذج (9 نماذج)</h3>
          </div>
          <div class="p-3 space-y-2">
            <button
              v-for="doc in docList"
              :key="doc.key"
              @click="activeKey = doc.key"
              :class="[
                'w-full text-right p-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5',
                activeKey === doc.key
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-sm'
                  : 'text-slate-700 hover:bg-slate-50 border border-transparent'
              ]"
            >
              <span :class="activeKey === doc.key ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-500'" class="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-extrabold shrink-0">
                {{ doc.key.includes('minutes') ? '7' : doc.key.split('_')[0] === 'warning' && doc.key.includes('continuous') ? '1' : doc.key.split('_')[0] === 'warning' ? '2' : doc.key.split('_')[0] === 'followup' && !doc.key.includes('committee') ? '3' : doc.key === 'termination_continuous' ? '4' : doc.key === 'termination_intermittent' ? '5' : doc.key === 'followup_committee' ? '6' : doc.key === 'direct_warning_continuous' ? '8' : '9' }}
              </span>
              <span class="leading-tight">{{ doc.label.split(' — ')[1] ?? doc.label }}</span>
              <span v-if="doc.isLandscape" class="mr-auto text-[9px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-normal">افقي</span>
            </button>
          </div>
        </div>

        <button @click="printActive" class="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          طباعة النموذج الحالي
        </button>

        <RouterLink to="/" @click="setDocAndNavigate(activeKey)" class="flex items-center justify-center gap-2 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-md">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          تعيين وفتح بالشاشة الرئيسية
        </RouterLink>

        <RouterLink to="/" class="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-all font-medium justify-center">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          العودة بدون تغيير
        </RouterLink>
      </div>

      <!-- Preview panel -->
      <div class="lg:col-span-9 flex flex-col items-center">
        <p class="no-print text-xs font-bold text-slate-500 mb-3 self-start flex items-center gap-2">
          <span class="w-2 h-2 bg-emerald-400 rounded-full"></span>
          {{ activeDoc()?.label }}
        </p>
        <div
          id="docsPreview"
          :class="[
            'bg-white shadow-2xl border border-slate-200 rounded-2xl text-black leading-relaxed flex flex-col w-full',
            activeDoc()?.isLandscape ? 'p-8 text-[11px]' : 'max-w-[640px] p-12 text-[12.5px]'
          ]"
          :style="activeDoc()?.isLandscape ? 'min-height:680px' : 'min-height:877px'"
        >
          <component :is="activeDoc()?.component" />
        </div>
        <p class="no-print text-[10px] text-slate-400 mt-3 text-center">💡 انقر على أي نص لتعديله مباشرة</p>
      </div>
    </div>
  </main>
</template>
