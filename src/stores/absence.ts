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
const fmt = (d: Date) => d.toISOString().split('T')[0]
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
  const draftDate = ref(fmt(today))
  const sendDate = ref(fmt(today))

  // ── Intermittent: manual days ────────────────────────────
  const absenceDays = ref<number>(0)

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
    return absenceDays.value > 0 ? absenceDays.value : 0
  })

  const isVoid = computed(() => {
    const days = absenceDaysCount.value
    if (absenceType.value === 'continuous') return days >= 10
    return days >= 20
  })

  const excuseDeadline = computed(() => {
    if (!sendDate.value || !excusePeriod.value) return ''
    const d = new Date(sendDate.value)
    d.setDate(d.getDate() + excusePeriod.value)
    return d.toISOString().split('T')[0]
  })

  type ValidationStatus = 'pending' | 'valid' | 'void_company' | 'expired'
  const validationStatus = computed<ValidationStatus>(() => {
    const hasDates = absenceType.value === 'continuous'
      ? !!(selectedEmployeeId.value && startDate.value && endDate.value && sendDate.value)
      : !!(selectedEmployeeId.value && startDate.value && absenceDays.value > 0 && sendDate.value)
    if (!hasDates) return 'pending'
    if (isVoid.value) return 'void_company'
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

  return {
    // employee
    selectedEmployeeId, selectedEmployee,
    // absence
    absenceType, startDate, endDate, draftDate, sendDate, absenceDays,
    // legal
    terminationDueDate, excusePeriod, legalPeriodExpired,
    // status
    currentStatus, currentAbsenceDate,
    // committee
    committeeDecision, committeeDate, committeeRefNo, committeeNotes,
    // doc selection
    selectedDoc, autoSelectedDoc, activeDoc,
    // computed
    absenceDaysCount, isVoid, excuseDeadline, validationStatus,
    // actions
    setEmployee, resetDocOverride,
  }
})
