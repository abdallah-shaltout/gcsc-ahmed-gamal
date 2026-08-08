<script setup lang="ts">
import { computed, ref } from "vue";
import { useAbsenceStore } from "@/stores/absence";
import { useArabicDate } from "@/composables/useArabicDate";
import { useHindiNumbers } from "@/composables/useHindiNumbers";
import DocumentHeader from "@/components/print/DocumentHeader.vue";
import EditablePara from "@/components/print/EditablePara.vue";
import CompanyFooter from "@/components/print/CompanyFooter.vue";

const store = useAbsenceStore();
const { formatArabicDate } = useArabicDate();
const { convertToHindi } = useHindiNumbers();
const emp = computed(() => {
    const employee = store.selectedEmployee;
    console.log("[Doc7Minutes] selectedEmployee:", employee);
    return employee;
});

const absenceSummary = computed(() => {
    const e = emp.value;
    console.log("[Doc7Minutes] absenceSummary computed", {
        employee: e?.name,
        absenceType: store.absenceType,
        daysCount: store.absenceDaysCount,
        draftDate: store.draftDate,
    });
    if (!e) {
        console.warn("[Doc7Minutes] No employee selected");
        return "";
    }
    const days = store.absenceDaysCount;
    const draftD = formatArabicDate(store.draftDate);
    const sendD = formatArabicDate(store.sendDate);
    const deadline = formatArabicDate(store.excuseDeadline);

    if (store.absenceType === "intermittent") {
        const from = formatArabicDate(store.day15Date);
        return [
            `— تم التعاقد معه بوظيفة ${e.title} اعتباراً من .......`,
            `— ورد إلينا كتاب السيده الاستاذه / مدير اداره شئون الخدمه بشأن انقطاع المذكور عن العمل متقطعا اعتباراً من ${from} حتى تاريخه بدون إذن رغم انذاره.`,
            `— تم إنذار المذكور قانوناً صحيحاً في ${draftD}.`,
            `— انتهت المهلة القانونية لتقديم العذر في ${deadline}.`,
            `— بلغ إجمالي أيام الانقطاع المذكورة أكثر من (${days}) يوماً.`,
            "— تنطبق عليه نص المادة (121) الفقرة السابعة من لائحة نظام العاملين بالشركة للانقطاع عن العمل.",
        ].join("\n");
    }

    const start = formatArabicDate(store.startDate);
    const end = formatArabicDate(store.endDate);
    return [
        `— تم التعاقد معه بوظيفة ${e.title} اعتباراً من .......`,
        `— ورد إلينا كتاب جهة العمل بشأن انقطاع المذكور من العمل اعتباراً من ${start}${end ? " حتى " + end : ""} بدون إذن رغم إنذاره.`,
        `— تم إنذار المذكور قانونياً بتاريخ التحرير: ${draftD} وتم إرساله في: ${sendD}`,
        `— انتهت المهلة القانونية لتقديم العذر في: ${deadline}`,
        `— بلغت إجمالي أيام الانقطاع المذكورة أكثر من (${days}) يوماً.`,
        "— تم التواصل مع المذكور وأفاد بأنه لن يعود مرة أخرى.",
        "— تنطبق عليه نص المادة (121) الفقرة السابعة من لائحة نظام العاملين بالشركة للانقطاع عن العمل.",
    ].join("\n");
});

const recommendationsText = ref("— يُكمَّل بعد صدور قرار اللجنة —");
const committeeDecisionText = computed(() => {
    if (store.committeeDecision === "terminate")
        return "إنهاء خدمة الموظف المذكور طبقاً للمادة (121) من لائحة نظام العاملين بالشركة لانقطاعه عن العمل.";
    if (store.committeeDecision === "accept")
        return "قبول العذر المقدم من الموظف المذكور وتسوية ملفه وفق الإجراءات اللائحية المعتمدة.";
    return "— يُكتب قرار اللجنة هنا —";
});
</script>

<style scoped>
@media print {
    * {
        page-break-inside: avoid;
    }
    .grid {
        page-break-inside: avoid;
    }
    body,
    html {
        margin: 0;
        padding: 0;
    }
}
</style>

<template>
    <div
        class="flex flex-col"
        @mounted="console.log('[Doc7Minutes] Template mounted')"
    >
        <DocumentHeader />

        <!-- Title -->
        <div class="text-center font-bold text-base py-0.5 print:text-sm">
            محضر اجتماع رقم ( ) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ( )
        </div>

        <!-- Main Table Grid -->
        <div
            class="grid grid-cols-12 border border-gray-400 mb-0 overflow-hidden"
        >
            <!-- Headers -->
            <div
                class="col-span-1 bg-gray-200 border border-gray-400 p-1 flex items-center justify-center font-bold text-xs text-slate-900"
            >
                م
            </div>
            <div
                class="col-span-3 bg-gray-200 border border-gray-400 p-1 flex items-center justify-center font-bold text-xs text-slate-900"
            >
                بيانات الموظف
            </div>
            <div
                class="col-span-1 bg-gray-200 border border-gray-400 p-1 flex items-center justify-center font-bold text-xs text-slate-900"
            >
                جهة العمل
            </div>
            <div
                class="col-span-5 bg-gray-200 border border-gray-400 p-1 flex items-center justify-center font-bold text-xs text-slate-900"
            >
                العرض
            </div>
            <div
                class="col-span-2 bg-gray-200 border border-gray-400 p-1 flex items-center justify-center font-bold text-xs text-slate-900"
            >
                التوصيات
            </div>

            <!-- Row 1 -->
            <div
                class="col-span-1 border border-gray-400 p-1 flex items-center justify-center font-bold text-sm"
            >
                {{ convertToHindi(1) }}
            </div>
            <div
                class="col-span-3 border border-gray-400 p-0.5 print:p-1 text-[10px] print:text-[9px] space-y-0"
                v-if="emp"
            >
                <p class="font-bold text-black">{{ emp.name }}</p>
                <p class="text-black">{{ emp.code }}</p>
                <p class="text-black">{{ emp.title }}</p>
            </div>
            <div
                class="col-span-3 border border-gray-400 p-0.5 text-[10px] print:text-[9px]"
                v-else
            >
                <p class="text-black">اختر موظفاً</p>
            </div>

            <div
                class="col-span-1 border border-gray-400 p-1 text-center text-[10px] print:text-[9px] flex items-center justify-center"
                style="writing-mode: vertical-rl"
            >
                {{ emp?.department ?? "........" }}
            </div>

            <div
                class="col-span-5 border border-gray-400 p-1 text-[10px] print:text-[9px] text-right"
            >
                <EditablePara
                    :text="absenceSummary"
                    class="leading-tight whitespace-pre-line"
                />
            </div>

            <div
                class="col-span-2 border border-gray-400 p-1 text-[10px] print:text-[9px] text-center flex items-center justify-center"
            >
                <EditablePara
                    v-model:text="recommendationsText"
                    class="text-center"
                />
            </div>

            <!-- Row 2 (empty) -->
            <!-- <div class="col-span-1 border border-gray-400 p-1 flex items-center justify-center text-black text-sm">{{ convertToHindi(2) }}</div> -->
            <!-- <div class="col-span-11 border border-gray-400 p-4"></div> -->

            <!-- Row 3 (empty) -->
            <!-- <div class="col-span-1 border border-gray-400 p-1 flex items-center justify-center text-black text-sm">{{ convertToHindi(3) }}</div> -->
            <!-- <div class="col-span-11 border border-gray-400 p-4"></div> -->
        </div>

        <!-- Committee Decision Grid -->
        <div class="grid grid-cols-12 border border-gray-400 border-t-0">
            <!-- Decision Header -->
            <div
                class="col-span-3 bg-gray-200 border border-gray-400 p-0.5 flex items-center justify-center font-bold text-xs h-12"
            >
                قرار اللجنة
            </div>
            <!-- Decision Content -->
            <div
                class="col-span-9 border border-gray-400 p-0.5 print:p-0.5 min-h-6 print:min-h-4 text-[10px] print:text-[8px] text-right h-12"
            >
                <EditablePara
                    :text="committeeDecisionText"
                    class="leading-relaxed"
                />
            </div>

            <!-- Committee Members Header -->
            <div
                class="col-span-3 bg-gray-200 border border-gray-400 p-0.5 flex items-center justify-center font-bold text-xs"
            >
                اعضاء اللجنة
            </div>

            <!-- Committee Members Numbers (1-7) -->
            <div
                class="col-span-7 border border-gray-400 p-0.5 print:p-1 grid grid-cols-4 gap-y-2 print:gap-y-1 text-xs font-bold text-center h-14"
            >
                <div>{{ convertToHindi(1) }}-</div>
                <div>{{ convertToHindi(2) }}-</div>
                <div>{{ convertToHindi(3) }}-</div>
                <div>{{ convertToHindi(4) }}-</div>
                <div>{{ convertToHindi(5) }}-</div>
                <div>{{ convertToHindi(6) }}-</div>
                <div>{{ convertToHindi(7) }}-</div>
            </div>

            <!-- Committee Head Header -->
            <div
                class="col-span-2 bg-gray-200 border border-gray-400 p-0.5 flex items-center justify-center font-bold text-xs"
            >
                رئيس اللجنة
            </div>
        </div>
        <CompanyFooter />
    </div>
</template>
