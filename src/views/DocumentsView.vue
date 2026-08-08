<script setup lang="ts">
import { ref } from 'vue'
import { printDocument } from '@/libs/print'
import { useAbsenceStore, documentLabels, type DocumentType } from '@/stores/absence'
import Doc3Followup from '@/components/documents/Doc3Followup.vue'
import Doc4TerminationContinuous from '@/components/documents/Doc4TerminationContinuous.vue'
import Doc5TerminationIntermittent from '@/components/documents/Doc5TerminationIntermittent.vue'
import Doc6CommitteeFollowup from '@/components/documents/Doc6CommitteeFollowup.vue'
import Doc7Minutes from '@/components/documents/Doc7Minutes.vue'

const store = useAbsenceStore()

const docList: { key: DocumentType; label: string; component: any; isLandscape?: boolean }[] = [
  { key: 'followup_absence', label: documentLabels['followup_absence'], component: Doc3Followup },
  { key: 'termination_continuous', label: documentLabels['termination_continuous'], component: Doc4TerminationContinuous },
  { key: 'termination_intermittent', label: documentLabels['termination_intermittent'], component: Doc5TerminationIntermittent },
  { key: 'followup_committee', label: documentLabels['followup_committee'], component: Doc6CommitteeFollowup },
  { key: 'minutes', label: documentLabels['minutes'], component: Doc7Minutes, isLandscape: true },
]

const activeKey = ref<DocumentType>('followup_absence')
const activeDoc = () => docList.find(d => d.key === activeKey.value)

function setDocAndNavigate(key: DocumentType) {
  store.selectedDoc = key
}

function printActive() {
  const doc = activeDoc()
  if (!doc) return
  printDocument({ elementId: 'docsPreview', isLandscape: doc.isLandscape })
}
</script>

<template>
  <main class="flex-grow max-w-[1600px] mx-auto px-4 py-6 w-full">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      <!-- Doc list sidebar -->
      <div class="lg:col-span-3 space-y-3 no-print">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="bg-gradient-to-l from-emerald-900 to-emerald-800 p-4 text-white">
            <h3 class="text-sm font-bold">كل النماذج (5 نماذج)</h3>
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
                {{ doc.key === 'minutes' ? '7' : doc.key === 'followup_absence' ? '3' : doc.key === 'termination_continuous' ? '4' : doc.key === 'termination_intermittent' ? '5' : '6' }}
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
