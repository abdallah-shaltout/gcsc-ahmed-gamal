<script setup lang="ts">
import { useAbsenceStore } from '@/stores/absence'
import { printDocument } from '@/libs/print'
import Doc7Minutes from '@/components/documents/Doc7Minutes.vue'

const store = useAbsenceStore()

function printDoc() {
  printDocument({ elementId: 'minutesPreview', isLandscape: true })
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
