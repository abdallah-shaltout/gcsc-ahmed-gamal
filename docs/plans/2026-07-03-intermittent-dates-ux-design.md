# Intermittent Absence Dates — Faster Multi-select + Holidays

## Problem

Adding intermittent absence days currently takes 2 steps per day (open picker, click "+ إضافة"). For absences of ~30 days this is too slow. Also need to:
- Disable Fridays as selectable absence days.
- Disable official holidays as selectable absence days.
- Manage the holidays list (add/remove), persisted in localStorage.

## Design

### 1. Multi-select calendar (`DateFields.vue`)

Replace the single-date `DatePicker` + "+ إضافة" button in the intermittent branch with:
- A `DatePicker` in `selection-mode="multiple"` `:manualInput="false"` inline mode, bound to a local temp `ref<Date[]>([])`.
- A single "تأكيد الإضافة" button that merges the temp selection into `store.absenceDates` (dedup + sort), then clears the temp selection.
- Existing chips list (with per-day remove and "حذف الكل") stays unchanged below.

### 2. Disable Fridays + holidays

Only on the intermittent multi-select picker (not continuous start/end pickers):
- `:disabledDays="[5]"` (Friday) — PrimeVue DatePicker built-in prop.
- `:disabledDates="holidaysStore.holidayDates"` — array of `Date` objects derived from the holidays store.

### 3. Holidays store + management screen

- New Pinia store `src/stores/holidays.ts`: `holidays: string[]` (ISO dates), persisted to `localStorage` (key `gcsdc-holidays`), with `addHoliday`, `removeHoliday` actions. Loads from localStorage on init, writes on every mutation (watcher).
- New view `src/views/HolidaysView.vue` at route `/holidays`: simple list + inline `DatePicker` to add a new holiday date, remove button per entry (reuses the same Chip-list pattern as absence dates for consistency).
- Link added to `AppHeader.vue` nav to reach `/holidays`.

## Non-goals
- No holiday disabling on continuous start/end/send date pickers (per user decision).
- No auth/permissions on the holidays screen — any user of the app can edit it.
