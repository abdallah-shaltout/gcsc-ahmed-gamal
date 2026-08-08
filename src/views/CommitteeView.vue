<script setup lang="ts">
import { ref } from 'vue'
import { useAbsenceStore } from '@/stores/absence'
import { useArabicDate } from '@/composables/useArabicDate'
import { printDocument } from '@/libs/print'
import Doc6CommitteeFollowup from '@/components/documents/Doc6CommitteeFollowup.vue'

const store = useAbsenceStore()
const { formatArabicDate } = useArabicDate()

function printDoc() {
  printDocument({ elementId: 'committeePreview', isLandscape: false })
}
</script>

<template>
  <main class="flex-grow max-w-[1300px] mx-auto px-4 py-6 w-full">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      <!-- Committee form -->
      <div class="lg:col-span-4 space-y-5 no-print">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="bg-gradient-to-l from-blue-900 to-blue-800 p-4 text-white">
            <h3 class="text-sm font-bold flex items-center gap-2">
              <span class="w-2.5 h-2.5 bg-blue-300 rounded-full animate-pulse"></span>
              بيانات اللجنة
            </h3>
          </div>
          <div class="p-5 space-y-4">
            <!-- Committee decision -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-2">قرار اللجنة</label>
              <div class="space-y-2">
                <label :class="store.committeeDecision === 'terminate' ? 'border-red-500 bg-red-50/60' : 'border-slate-200'" class="flex items-center gap-2.5 p-3 border rounded-xl cursor-pointer transition-all">
                  <input type="radio" v-model="store.committeeDecision" value="terminate" class="w-4 h-4 text-red-600" />
                  <span class="text-xs font-bold text-slate-800">إنهاء الخدمة</span>
                </label>
                <label :class="store.committeeDecision === 'accept' ? 'border-emerald-500 bg-emerald-50/60' : 'border-slate-200'" class="flex items-center gap-2.5 p-3 border rounded-xl cursor-pointer transition-all">
                  <input type="radio" v-model="store.committeeDecision" value="accept" class="w-4 h-4 text-emerald-600" />
                  <span class="text-xs font-bold text-slate-800">قبول العذر</span>
                </label>
              </div>
            </div>

            <!-- Committee date -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">تاريخ اجتماع اللجنة</label>
              <input type="date" v-model="store.committeeDate" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30" />
            </div>

            <!-- Committee ref no -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">رقم المحضر</label>
              <input type="text" v-model="store.committeeRefNo" placeholder="أدخل رقم المحضر..." class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30" />
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">ملاحظات</label>
              <textarea v-model="store.committeeNotes" rows="3" placeholder="أي ملاحظات إضافية..." class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/30"></textarea>
            </div>

            <!-- Print button -->
            <button @click="printDoc" class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              طباعة كتاب اللجنة
            </button>
          </div>
        </div>

        <RouterLink to="/" class="flex items-center gap-2 text-xs text-slate-500 hover:text-blue-600 transition-all font-medium">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          العودة إلى الشاشة الرئيسية
        </RouterLink>
      </div>

      <!-- Preview -->
      <div class="lg:col-span-8 flex flex-col items-center lg:sticky lg:top-4">
        <p class="no-print text-xs font-bold text-slate-500 mb-3 self-start flex items-center gap-1.5">
          <span class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
          معاينة كتاب متابعة اللجنة
        </p>
        <div id="committeePreview" class="bg-white w-full max-w-[620px] p-12 shadow-2xl border border-slate-200 rounded-2xl text-black text-[12.5px] leading-relaxed flex flex-col" style="min-height:877px">
          <Doc6CommitteeFollowup />
        </div>
      </div>
    </div>
  </main>
</template>
