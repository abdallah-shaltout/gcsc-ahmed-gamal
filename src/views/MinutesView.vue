<script setup lang="ts">
import { useAbsenceStore } from '@/stores/absence'
import Doc7Minutes from '@/components/documents/Doc7Minutes.vue'

const store = useAbsenceStore()

function printDoc() {
  const el = document.getElementById('minutesPreview')
  if (!el) return
  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none;'
  document.body.appendChild(iframe)
  const doc = iframe.contentDocument!
  doc.open()
  doc.write(`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0}html,body{font-family:'Cairo',sans-serif;direction:rtl;color:#0f172a}@page{size:A4 landscape;margin:10mm}
.flex{display:flex}.flex-col{flex-direction:column}.flex-grow{flex:1 1 auto}.justify-between{justify-content:space-between}.items-start{align-items:flex-start}.items-center{align-items:center}
.text-center{text-align:center}.font-extrabold{font-weight:800}.font-bold{font-weight:700}.text-sm{font-size:.875rem}.text-right{text-align:right}
.border-b-2{border-bottom:2px solid}.border-t{border-top:1px solid}.border-b{border-bottom:1px solid}.border{border:1px solid}
.border-slate-900{border-color:#0f172a}.border-slate-700{border-color:#374151}.border-slate-300{border-color:#cbd5e1}.border-slate-200{border-color:#e2e8f0}.border-slate-400{border-color:#94a3b8}
.rounded-lg{border-radius:.5rem}.bg-slate-800{background:#1e293b}
.text-slate-950{color:#020617}.text-slate-900{color:#0f172a}.text-slate-700{color:#334155}.text-slate-600{color:#475569}.text-slate-500{color:#64748b}.text-slate-400{color:#94a3b8}.text-slate-300{color:#cbd5e1}.text-white{color:#fff}
.pb-4{padding-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mb-4{margin-bottom:1rem}.mb-3{margin-bottom:.75rem}.mb-2{margin-bottom:.5rem}.mb-1{margin-bottom:.25rem}
.mt-4{margin-top:1rem}.mt-3{margin-top:.75rem}.mt-2{margin-top:.5rem}
.pt-3{padding-top:.75rem}.pt-2{padding-top:.5rem}.p-2{padding:.5rem}.p-4{padding:1rem}
.w-12{width:3rem}.h-12{height:3rem}.min-w-\\[40px\\]{min-width:40px}
.space-y-1>*+*{margin-top:.25rem}.gap-2{gap:.5rem}.inline{display:inline}
.overflow-auto{overflow:visible}.align-top{vertical-align:top}.whitespace-pre-line{white-space:pre-line}
.grid{display:grid}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.gap-4{gap:1rem}
.w-\\[5\\%\\]{width:5%}.w-\\[18\\%\\]{width:18%}.w-\\[12\\%\\]{width:12%}.w-\\[40\\%\\]{width:40%}.w-\\[25\\%\\]{width:25%}
table{border-collapse:collapse;width:100%}
td,th{border:1px solid #374151;padding:6px 10px;font-size:11px;vertical-align:top}
th{background:#1e293b;color:white;font-weight:700;text-align:center}
svg{display:inline-block;vertical-align:middle}
[contenteditable]{outline:none!important;background:transparent!important;box-shadow:none!important}
.text-\\[10px\\]{font-size:10px}.text-\\[10\\.5px\\]{font-size:10.5px}.text-\\[11px\\]{font-size:11px}
</style></head><body style="margin:0;padding:0">${el.innerHTML}</body></html>`)
  doc.close()
  iframe.contentWindow!.focus()
  iframe.contentWindow!.print()
  setTimeout(() => document.body.removeChild(iframe), 1500)
}
</script>

<template>
  <main class="flex-grow max-w-[1500px] mx-auto px-4 py-6 w-full">
    <!-- Toolbar -->
    <div class="flex justify-between items-center mb-5 no-print">
      <div class="flex items-center gap-3">
        <RouterLink to="/" class="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-all font-medium">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          الرئيسية
        </RouterLink>
        <span class="text-slate-300">/</span>
        <span class="text-xs font-bold text-slate-700">محضر اجتماع اللجنة</span>
      </div>
      <div class="flex items-center gap-3">
        <div>
          <label class="text-xs font-bold text-slate-600 ml-2">رقم المحضر:</label>
          <input type="text" v-model="store.committeeRefNo" placeholder="رقم المحضر" class="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400/30" />
        </div>
        <div>
          <label class="text-xs font-bold text-slate-600 ml-2">تاريخ الاجتماع:</label>
          <input type="date" v-model="store.committeeDate" class="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400/30" />
        </div>
        <div>
          <label class="text-xs font-bold text-slate-600 ml-2">قرار اللجنة:</label>
          <select v-model="store.committeeDecision" class="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400/30">
            <option :value="null">— اختر —</option>
            <option value="terminate">إنهاء الخدمة</option>
            <option value="accept">قبول العذر</option>
          </select>
        </div>
        <button @click="printDoc" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          طباعة المحضر
        </button>
      </div>
    </div>

    <!-- Landscape preview -->
    <div id="minutesPreview" class="bg-white w-full max-w-[1100px] mx-auto p-10 shadow-2xl border border-slate-200 rounded-2xl text-black text-[11px] leading-relaxed flex flex-col" style="min-height:680px">
      <Doc7Minutes />
    </div>
    <p class="no-print text-[10px] text-slate-400 mt-3 text-center">💡 انقر على أي خلية في الجدول لتعديلها</p>
  </main>
</template>
