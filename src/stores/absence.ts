import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Employee {
  id: string
  code: string
  name: string
  title: string
  department: string
}

const today = new Date()
const fmt = (d: Date) => d.toISOString().slice(0, 10)
const daysAgo = (n: number) => { const d = new Date(); d.setDate(today.getDate() - n); return fmt(d) }

export const mockEmployees: Employee[] = [
  { id: '1', code: '30154178', name: 'سيد حسين الغمازي', title: 'عامل تشغيل وصيانة', department: 'ادارة الورش المركزية' },
  { id: '2', code: '30155978', name: 'محمد رجب محمود علي جمعه', title: 'عامل خدمة معاونه', department: 'الإدارة العامة للشئون الإدارية' },
  { id: '3', code: '30154101', name: 'محمد عاطف عبدالرحمن الزياني', title: 'عامل تشغيل وصيانة', department: 'ادارة الورش والخدمات الفنية' },
  { id: '4', code: '30153987', name: 'محمد عبدالرازق محمد', title: 'فني سلامة وصحه مهنيه', department: 'الإدارة العامة للسلامة والصحة' },
  { id: '5', code: '30150416', name: 'اسماعيل محمد عبدالخالق', title: 'فني جهاز القاهرة الجديدة', department: 'قطاع الدعم الفني والصحه' },
  { id: '6', code: '30151412', name: 'محمد إيهاب عبدالسلام عبدالحميد', title: 'فني معمل', department: 'الإدارة العامة للمعالجة والمزارع' },
  { id: '7', code: '30152224', name: 'أحمد إبراهيم اللبان', title: 'عامل تشغيل وصيانه', department: 'محطات فرعية - شبكات شمال' },
  { id: '8', code: 'E1008', name: 'شريف جلال الدين المرسي', title: 'محاسب مالي أول', department: 'قطاع الشئون المالية والإدارية' },
  { id: '9', code: 'E1009', name: 'هاني طلعت عبد الوهاب', title: 'غطاس طوارئ وشبكات أول', department: 'طوارئ شبكات الجيزة المركزية' },
  { id: '10', code: 'E1010', name: 'نجلاء سليمان فتح الله', title: 'باحث قانوني ثان', department: 'إدارة الشئون القانونية والتحقيقات' },
  { id: '11', code: 'E1011', name: 'يوسف شعبان مرزوق', title: 'أمين مخازن محطة الخصوص', department: 'مخازن ومستودعات قطاع القليوبية' },
  { id: '12', code: 'E1012', name: 'طارق عبد الحميد النشار', title: 'سائق سيارة نافوري ثقيل', department: 'إدارة الطوارئ والشبكات المجمعة' },
]

export type AbsenceType = 'continuous' | 'intermittent'
export type CurrentStatus = 'committed' | 'absent'

// Document types that can be auto-selected or manually overridden
export type DocumentType =
  | 'warning_continuous'       // 1 — إنذار متصل
  | 'warning_intermittent'     // 2 — إنذار منقطع
  | 'followup_absence'         // 3 — متابعة انقطاع
  | 'termination_continuous'   // 4 — قرار إنهاء متصل
  | 'termination_intermittent' // 5 — قرار إنهاء منقطع
  | 'followup_committee'       // 6 — متابعة بعد اللجنة
  | 'minutes'                  // 7 — محضر اللجنة
  | 'direct_warning_continuous'    // 8 — إنذار للموظف متصل
  | 'direct_warning_intermittent'  // 9 — إنذار للموظف منقطع

export const documentLabels: Record<DocumentType, string> = {
  warning_continuous: '1 — إنذار متصل',
  warning_intermittent: '2 — إنذار منقطع',
  followup_absence: '3 — متابعة انقطاع',
  termination_continuous: '4 — قرار إنهاء (متصل)',
  termination_intermittent: '5 — قرار إنهاء (منقطع)',
  followup_committee: '6 — متابعة بعد اللجنة',
  minutes: '7 — محضر اللجنة',
  direct_warning_continuous: '8 — إنذار للموظف (متصل)',
  direct_warning_intermittent: '9 — إنذار للموظف (منقطع)',
}

export const useAbsenceStore = defineStore('absence', () => {
  // ── Employee ──────────────────────────────────────────────
  const selectedEmployeeId = ref<string>('1')
  const selectedEmployee = computed(() =>
    mockEmployees.find(e => e.id === selectedEmployeeId.value) ?? null
  )

  // ── Absence type ─────────────────────────────────────────
  const absenceType = ref<AbsenceType>('continuous')

  // ── Dates ────────────────────────────────────────────────
  const startDate = ref(daysAgo(8))
  const endDate = ref(daysAgo(1))
  const sendDate = ref(fmt(today))
  // draftDate mirrors sendDate — no separate input field
  const draftDate = computed(() => sendDate.value)

  // ── Intermittent: individual absence dates ───────────────
  // absenceDates: the first 15 days (the legal threshold)
  // extraAbsenceDates: additional days beyond the 15, used to determine
  // whether the warning was sent within the valid window (day 16-19)
  const absenceDates = ref<string[]>([])
  const extraAbsenceDates = ref<string[]>([])

  // combined, sorted ascending — the full set of intermittent absence dates
  const allAbsenceDates = computed(() =>
    [...absenceDates.value, ...extraAbsenceDates.value].sort()
  )

  // day 15 = last date of the base 15-day threshold (absenceDates, already capped at 15)
  const day15Date = computed(() => {
    const dates = [...absenceDates.value].sort()
    return dates[dates.length - 1] ?? ''
  })

  // day 16/17/18/19 = the 1st..4th extra absence dates recorded after day 15,
  // in the order they were added (extraAbsenceDates is kept sorted ascending)
  const day16Date = computed(() => extraAbsenceDates.value[0] ?? '')
  const day17Date = computed(() => extraAbsenceDates.value[1] ?? '')
  const day18Date = computed(() => extraAbsenceDates.value[2] ?? '')
  const day19Date = computed(() => extraAbsenceDates.value[3] ?? '')

  // ── Legal fields ─────────────────────────────────────────
  const terminationDueDate = ref('')
  const excusePeriod = ref(15)
  const legalPeriodExpired = ref(false)

  // ── Current status ───────────────────────────────────────
  const currentStatus = ref<CurrentStatus>('committed')
  const currentAbsenceDate = ref(fmt(today))

  // ── Committee ────────────────────────────────────────────
  const committeeDecision = ref<'terminate' | 'accept' | null>(null)
  const committeeDate = ref(fmt(today))
  const committeeRefNo = ref('')
  const committeeNotes = ref('')

  // ── Document selection ───────────────────────────────────
  // autoSelectedDoc = what the system thinks is correct
  // selectedDoc = what the user can override
  const selectedDoc = ref<DocumentType | null>(null)

  const autoSelectedDoc = computed<DocumentType>(() => {
    const days = absenceDaysCount.value
    if (absenceType.value === 'continuous') {
      if (isVoid.value) return 'warning_continuous'
      if (legalPeriodExpired.value) return 'termination_continuous'
      return 'warning_continuous'
    } else {
      if (isVoid.value) return 'warning_intermittent'
      if (legalPeriodExpired.value) return 'termination_intermittent'
      return 'warning_intermittent'
    }
  })

  // The actually active doc (user override takes precedence)
  const activeDoc = computed<DocumentType>(() =>
    selectedDoc.value ?? autoSelectedDoc.value
  )

  // ── Calculations ─────────────────────────────────────────
  const absenceDaysCount = computed(() => {
    if (absenceType.value === 'continuous') {
      if (!startDate.value || !endDate.value) return 0
      const s = new Date(startDate.value)
      const e = new Date(endDate.value)
      const diff = Math.floor((e.getTime() - s.getTime()) / 86400000) + 1
      return diff > 0 ? diff : 0
    }
    return allAbsenceDates.value.length
  })

  // continuous: must have >= 7 days to be actionable; intermittent: >= 15
  const isBelowMinimum = computed(() => {
    const days = absenceDaysCount.value
    if (days === 0) return false
    if (absenceType.value === 'continuous') return days < 7
    return days < 15
  })

  // continuous: > 7 days means warning was sent too late (void)
  // intermittent: void is determined by sendDateValid (send date past day 19), not by day count
  const isVoid = computed(() => {
    if (absenceType.value === 'continuous') return absenceDaysCount.value > 7
    return false
  })

  // kept for backward-compat display — same as day15Date
  const fifteenthFromLastDate = computed(() => day15Date.value)

  // sendDate must be within endDate .. endDate+2 (3-day window) for continuous;
  // for intermittent, must be within day15Date .. day19Date (open-ended if day19
  // isn't recorded yet — i.e. fewer than 4 extra dates so far)
  const sendDateValid = computed(() => {
    if (!sendDate.value) return true
    if (absenceType.value === 'continuous') {
      if (!endDate.value) return true
      const end = new Date(endDate.value)
      const sent = new Date(sendDate.value)
      const diffDays = Math.floor((sent.getTime() - end.getTime()) / 86400000)
      return diffDays >= 0 && diffDays <= 2
    }
    if (!day15Date.value) return true
    const start = new Date(day15Date.value)
    const sent = new Date(sendDate.value)
    if (sent.getTime() < start.getTime()) return false
    if (!day19Date.value) return true
    const end = new Date(day19Date.value)
    return sent.getTime() <= end.getTime()
  })

  // excuse deadline = earliest absence date + 24 days (so day 1 and day 25 are both counted)
  const excuseDeadline = computed(() => {
    let base = ''
    if (absenceType.value === 'continuous') {
      base = startDate.value
    } else {
      base = allAbsenceDates.value[0] ?? ''
    }
    if (!base) return ''
    const d = new Date(base)
    d.setDate(d.getDate() + 24)
    return d.toISOString().split('T')[0]
  })

  type ValidationStatus = 'pending' | 'valid' | 'not_valid' | 'void_company' | 'send_date_error' | 'expired'
  const validationStatus = computed<ValidationStatus>(() => {
    const hasDates = absenceType.value === 'continuous'
      ? !!(selectedEmployeeId.value && startDate.value && endDate.value && sendDate.value)
      : !!(selectedEmployeeId.value && allAbsenceDates.value.length > 0 && sendDate.value)
    if (!hasDates) return 'pending'
    if (isBelowMinimum.value) return 'not_valid'
    if (isVoid.value) return 'void_company'
    if (!sendDateValid.value) return 'send_date_error'
    if (legalPeriodExpired.value) return 'expired'
    return 'valid'
  })

  // ── Actions ───────────────────────────────────────────────
  function setEmployee(id: string) {
    selectedEmployeeId.value = id
  }

  function resetDocOverride() {
    selectedDoc.value = null
  }

  const MAX_ABSENCE_DATES = 15

  function addAbsenceDate(date: string) {
    if (!date) return
    if (absenceDates.value.length >= MAX_ABSENCE_DATES) return
    if (absenceDates.value.includes(date) || extraAbsenceDates.value.includes(date)) return
    absenceDates.value = [...absenceDates.value, date].sort()
  }

  function removeAbsenceDate(date: string) {
    absenceDates.value = absenceDates.value.filter(d => d !== date)
  }

  function clearAbsenceDates() {
    absenceDates.value = []
  }

  function addExtraAbsenceDate(date: string) {
    if (!date) return
    if (absenceDates.value.includes(date) || extraAbsenceDates.value.includes(date)) return
    // extra dates must come strictly after day 15 (the last of the base 15-day threshold)
    if (day15Date.value && date <= day15Date.value) return
    extraAbsenceDates.value = [...extraAbsenceDates.value, date].sort()
  }

  function removeExtraAbsenceDate(date: string) {
    extraAbsenceDates.value = extraAbsenceDates.value.filter(d => d !== date)
  }

  function clearExtraAbsenceDates() {
    extraAbsenceDates.value = []
  }

  return {
    // employee
    selectedEmployeeId, selectedEmployee,
    // absence
    absenceType, startDate, endDate, sendDate, draftDate, absenceDates, extraAbsenceDates,
    MAX_ABSENCE_DATES,
    // legal
    terminationDueDate, excusePeriod, legalPeriodExpired,
    // status
    currentStatus, currentAbsenceDate,
    // committee
    committeeDecision, committeeDate, committeeRefNo, committeeNotes,
    // doc selection
    selectedDoc, autoSelectedDoc, activeDoc,
    // computed
    allAbsenceDates, fifteenthFromLastDate,
    day15Date, day16Date, day17Date, day18Date, day19Date,
    absenceDaysCount, isBelowMinimum, isVoid, sendDateValid, excuseDeadline, validationStatus,
    // actions
    setEmployee, resetDocOverride,
    addAbsenceDate, removeAbsenceDate, clearAbsenceDates,
    addExtraAbsenceDate, removeExtraAbsenceDate, clearExtraAbsenceDates,
  }
})
