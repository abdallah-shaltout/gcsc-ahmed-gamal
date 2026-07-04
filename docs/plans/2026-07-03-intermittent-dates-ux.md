# Intermittent Absence Dates — Multi-select + Holidays Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Speed up adding intermittent absence days from 2-steps-per-day to a single multi-select-then-confirm flow, disable Fridays as absence days, and add a localStorage-backed official-holidays list that also disables those days.

**Architecture:** A new Pinia store (`holidays.ts`) persists an ISO-date array to `localStorage`. `DateFields.vue`'s intermittent branch switches its `DatePicker` to `selection-mode="multiple"` bound to a local temp array, committed to the existing `store.absenceDates` via one confirm button; the same picker gets `disabledDays`/`disabledDates` props sourced from the holidays store. A new `HolidaysView.vue` + `/holidays` route lets users manage the list, linked from `AppHeader.vue`.

**Tech Stack:** Vue 3 (Composition API, `<script setup>`), Pinia, PrimeVue 5 (`DatePicker`, `Chip`, `Button`), Vue Router, TypeScript. No test framework is configured in this repo — verification is `vue-tsc --build` (type-check) plus manual browser checks via the dev server.

---

### Task 1: Holidays Pinia store

**Files:**
- Create: `src/stores/holidays.ts`

**Step 1: Write the store**

```typescript
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'gcsdc-holidays'

function loadHolidays(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((d) => typeof d === 'string') : []
  } catch {
    return []
  }
}

export const useHolidaysStore = defineStore('holidays', () => {
  const holidays = ref<string[]>(loadHolidays())

  watch(holidays, (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  }, { deep: true })

  function addHoliday(date: string) {
    if (date && !holidays.value.includes(date)) {
      holidays.value = [...holidays.value, date].sort()
    }
  }

  function removeHoliday(date: string) {
    holidays.value = holidays.value.filter((d) => d !== date)
  }

  return { holidays, addHoliday, removeHoliday }
})
```

**Step 2: Type-check**

Run: `bun run type-check` (or `npm run type-check`)
Expected: no new errors.

**Step 3: Commit**

```bash
git add src/stores/holidays.ts
git commit -m "feat: add holidays store persisted to localStorage"
```

---

### Task 2: Holidays management view + route + nav link

**Files:**
- Create: `src/views/HolidaysView.vue`
- Modify: `src/router/index.ts`
- Modify: `src/components/layout/AppHeader.vue`

**Step 1: Write the view**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useHolidaysStore } from '@/stores/holidays'
import { useArabicDate } from '@/composables/useArabicDate'
import DatePicker from 'primevue/datepicker'
import Chip from 'primevue/chip'

const store = useHolidaysStore()
const { formatArabicDate } = useArabicDate()

const pickerDate = ref<Date | null>(null)

function toIso(d: Date | null): string {
  return d ? d.toISOString().slice(0, 10) : ''
}

function handleAdd() {
  if (!pickerDate.value) return
  store.addHoliday(toIso(pickerDate.value))
  pickerDate.value = null
}
</script>

<template>
  <main class="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <h1 class="text-lg font-extrabold text-slate-800 mb-1">العطلات الرسمية</h1>
    <p class="text-xs text-slate-500 mb-5">
      الأيام المضافة هنا يتم تعطيلها تلقائيًا عند اختيار أيام الغياب المتقطع، بالإضافة إلى يوم الجمعة.
    </p>

    <div class="flex gap-2 mb-4">
      <DatePicker v-model="pickerDate" dateFormat="yy-mm-dd" showIcon iconDisplay="input" fluid inputClass="text-xs font-medium" class="flex-1" />
      <button @click="handleAdd" :disabled="!pickerDate"
        class="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-colors shrink-0">
        + إضافة
      </button>
    </div>

    <div v-if="store.holidays.length > 0"
      class="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
      <Chip v-for="d in store.holidays" :key="d"
        :label="formatArabicDate(d)"
        removable
        @remove="store.removeHoliday(d)"
        class="text-[10px] font-bold" />
    </div>
    <p v-else class="text-[10px] text-slate-400 text-center py-4 border border-dashed border-slate-200 rounded-xl">
      لم يتم إضافة أي عطلات رسمية بعد
    </p>
  </main>
</template>
```

**Step 2: Register the route**

In `src/router/index.ts`, add after the `documents` route:

```typescript
    { path: '/holidays', name: 'holidays', component: () => import('../views/HolidaysView.vue') },
```

**Step 3: Add nav link**

In `src/components/layout/AppHeader.vue`, add a `RouterLink` inside `<nav>` after the "المحضر" link (before the `v3.0` badge span):

```vue
        <RouterLink to="/holidays" class="px-3 py-1.5 rounded-lg text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all">
          العطلات الرسمية
        </RouterLink>
```

**Step 4: Type-check**

Run: `bun run type-check`
Expected: no new errors.

**Step 5: Manual verification**

Run: `bun run dev`, open the app, click "العطلات الرسمية" in the header, add a date, confirm it appears as a chip, refresh the page, confirm it persists. Remove it, confirm it's gone after refresh.

**Step 6: Commit**

```bash
git add src/views/HolidaysView.vue src/router/index.ts src/components/layout/AppHeader.vue
git commit -m "feat: add holidays management view and nav link"
```

---

### Task 3: Multi-select picker with confirm button in DateFields.vue

**Files:**
- Modify: `src/components/form/DateFields.vue`

**Step 1: Add holidays store import and disabled-dates computed**

After the existing imports/store setup (near line 10-11):

```typescript
import { useHolidaysStore } from '@/stores/holidays'
```

Add after `const store = useAbsenceStore()`:

```typescript
const holidaysStore = useHolidaysStore()
const disabledHolidayDates = computed(() => holidaysStore.holidays.map((d) => new Date(d)))
```

**Step 2: Replace the single-date picker state with a multi-select temp array**

Replace the existing intermittent picker logic:

```typescript
// intermittent date picker
const pickerDate = ref<Date | null>(null)
function handleAddDate() {
  if (!pickerDate.value) return
  store.addAbsenceDate(toIso(pickerDate.value))
  pickerDate.value = null
}
```

with:

```typescript
// intermittent date picker — multi-select, committed on confirm
const pickerDates = ref<Date[]>([])
function handleConfirmDates() {
  if (!pickerDates.value.length) return
  for (const d of pickerDates.value) {
    store.addAbsenceDate(toIso(d))
  }
  pickerDates.value = []
}
```

**Step 3: Update the template's date-picker row**

Replace:

```vue
      <!-- date picker row -->
      <div class="flex gap-2">
        <DatePicker v-model="pickerDate" dateFormat="yy-mm-dd" showIcon iconDisplay="input" fluid inputClass="text-xs font-medium" class="flex-1" />
        <button @click="handleAddDate" :disabled="!pickerDate"
          class="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-colors shrink-0">
          + إضافة
        </button>
      </div>
```

with:

```vue
      <!-- multi-select date picker -->
      <DatePicker v-model="pickerDates" selectionMode="multiple" :manualInput="false" inline
        :disabledDays="[5]" :disabledDates="disabledHolidayDates"
        dateFormat="yy-mm-dd" class="w-full" />
      <button @click="handleConfirmDates" :disabled="!pickerDates.length"
        class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-colors">
        تأكيد الإضافة{{ pickerDates.length ? ` (${pickerDates.length})` : '' }}
      </button>
```

**Step 4: Type-check**

Run: `bun run type-check`
Expected: no new errors. If `selectionMode`/`disabledDays`/`disabledDates` prop names or casing differ from installed PrimeVue types, fix per the type error (PrimeVue 5 uses camelCase props in Vue templates; confirm against `node_modules/primevue/datepicker/index.d.ts` if needed).

**Step 5: Manual verification**

Run: `bun run dev`, switch absence type to "منقطع", open the inline calendar, confirm Fridays are visibly disabled/unclickable, add a holiday via `/holidays` for a date in the visible month and confirm it's disabled too. Select several non-disabled days, click "تأكيد الإضافة", confirm all appear as chips at once. Confirm removing a chip and "حذف الكل" still work.

**Step 6: Commit**

```bash
git add src/components/form/DateFields.vue
git commit -m "feat: multi-select intermittent absence days, disable Fridays and holidays"
```

---

### Task 4: Final check

**Step 1:** Run `bun run type-check` and `bun run build` to confirm the whole app still builds.

**Step 2:** Manual smoke test of the full absence flow (continuous type unaffected; intermittent type using new picker) in the browser.
