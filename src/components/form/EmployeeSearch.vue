<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAbsenceStore, mockEmployees, type Employee } from '@/stores/absence'
import AutoComplete from 'primevue/autocomplete'
import Checkbox from 'primevue/checkbox'

const store = useAbsenceStore()
const useRegex = ref(false)
const suggestions = ref<Employee[]>(mockEmployees)

const selectedEmp = computed(() => mockEmployees.find(e => e.id === store.selectedEmployeeId))

// AutoComplete binds to the full Employee object; store only needs the id.
const model = computed<Employee | null>({
  get: () => selectedEmp.value ?? null,
  set: (emp) => { if (emp) store.setEmployee(emp.id) },
})

function search(event: { query: string }) {
  const q = event.query.trim()
  if (!q) {
    suggestions.value = mockEmployees
    return
  }
  if (useRegex.value) {
    try {
      const rx = new RegExp(q, 'i')
      suggestions.value = mockEmployees.filter(e => rx.test(e.name) || rx.test(e.code) || rx.test(e.title) || rx.test(e.department))
    } catch {
      suggestions.value = []
    }
    return
  }
  const lq = q.toLowerCase()
  suggestions.value = mockEmployees.filter(e =>
    e.name.toLowerCase().includes(lq) ||
    e.code.toLowerCase().includes(lq) ||
    e.title.toLowerCase().includes(lq) ||
    e.department.toLowerCase().includes(lq)
  )
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-1.5">
      <label class="block text-xs font-bold text-slate-700">البحث واختيار الموظف</label>
      <label class="flex items-center gap-1.5 cursor-pointer select-none">
        <Checkbox v-model="useRegex" binary />
        <span class="text-[10px] font-bold text-blue-600">بحث Regex</span>
      </label>
    </div>

    <AutoComplete
      v-model="model"
      :suggestions="suggestions"
      @complete="search"
      optionLabel="name"
      placeholder="ابحث باسم الموظف أو الكود..."
      fluid
      inputClass="text-xs font-medium"
    >
      <template #option="{ option }">
        <div class="flex justify-between items-center text-xs w-full">
          <div class="flex flex-col">
            <span class="font-bold text-slate-900">{{ option.name }}</span>
            <span class="text-[10px] text-slate-500 mt-0.5">{{ option.title }} - {{ option.department }}</span>
          </div>
          <span class="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{{ option.code }}</span>
        </div>
      </template>
    </AutoComplete>

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
