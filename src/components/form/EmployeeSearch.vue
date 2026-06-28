<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAbsenceStore, mockEmployees, type Employee } from '@/stores/absence'

const store = useAbsenceStore()
const query = ref('')
const useRegex = ref(false)
const open = ref(false)

const filtered = computed(() => {
  const q = query.value.trim()
  if (!q) return mockEmployees
  if (useRegex.value) {
    try {
      const rx = new RegExp(q, 'i')
      return mockEmployees.filter(e => rx.test(e.name) || rx.test(e.code) || rx.test(e.title) || rx.test(e.department))
    } catch { return [] }
  }
  const lq = q.toLowerCase()
  return mockEmployees.filter(e =>
    e.name.toLowerCase().includes(lq) ||
    e.code.toLowerCase().includes(lq) ||
    e.title.toLowerCase().includes(lq) ||
    e.department.toLowerCase().includes(lq)
  )
})

const selectedEmp = computed(() => mockEmployees.find(e => e.id === store.selectedEmployeeId))

function select(emp: Employee) {
  store.setEmployee(emp.id)
  query.value = `[${emp.code}] - ${emp.name}`
  open.value = false
}

function onFocus() {
  open.value = true
  if (selectedEmp.value) query.value = ''
}

function onBlur() {
  setTimeout(() => {
    open.value = false
    if (selectedEmp.value) {
      query.value = `[${selectedEmp.value.code}] - ${selectedEmp.value.name}`
    }
  }, 150)
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-1.5">
      <label class="block text-xs font-bold text-slate-700">البحث واختيار الموظف</label>
      <label class="flex items-center gap-1 cursor-pointer select-none">
        <input type="checkbox" v-model="useRegex" class="w-3.5 h-3.5 text-blue-600 rounded border-slate-300">
        <span class="text-[10px] font-bold text-blue-600">بحث Regex</span>
      </label>
    </div>

    <div class="relative">
      <span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      </span>
      <input
        type="text"
        v-model="query"
        @focus="onFocus"
        @blur="onBlur"
        placeholder="ابحث باسم الموظف أو الكود..."
        class="w-full pr-9 pl-3 py-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
      />

      <!-- Dropdown -->
      <div v-if="open" class="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-50 divide-y divide-slate-100">
        <div v-if="filtered.length === 0" class="p-3 text-xs text-slate-400 text-center font-bold">
          لا يوجد نتائج
        </div>
        <div
          v-for="emp in filtered"
          :key="emp.id"
          @mousedown="select(emp)"
          class="p-3 hover:bg-slate-50 cursor-pointer transition-colors flex justify-between items-center text-xs"
        >
          <div class="flex flex-col">
            <span class="font-bold text-slate-900">{{ emp.name }}</span>
            <span class="text-[10px] text-slate-500 mt-0.5">{{ emp.title }} - {{ emp.department }}</span>
          </div>
          <span class="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{{ emp.code }}</span>
        </div>
      </div>
    </div>

    <!-- Selected employee card -->
    <div v-if="selectedEmp" class="mt-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-xs font-bold text-slate-900">{{ selectedEmp.name }}</p>
          <p class="text-[10px] text-slate-600 mt-0.5">{{ selectedEmp.title }}</p>
          <p class="text-[10px] text-slate-500 mt-0.5">{{ selectedEmp.department }}</p>
        </div>
        <span class="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg">{{ selectedEmp.code }}</span>
      </div>
    </div>
  </div>
</template>
