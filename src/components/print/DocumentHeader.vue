<script setup lang="ts">
defineProps<{
    subtitle?: string;
}>();
</script>

<template>
    <div
        class="flex justify-between items-center border-b-2 border-slate-900 print:pb-1"
    >
        <div class="text-right flex-1">
            <p class="font-extrabold text-sm print:text-xs text-slate-950">
                شركة الصرف الصحي للقاهرة الكبرى
            </p>
            <p class="text-[10.5px] print:text-[9px] text-slate-800 font-bold">
                قطاع تنمية الموارد البشرية والإدارية
            </p>
            <p
                v-if="subtitle"
                class="text-[9.5px] print:text-[8px] text-slate-600 font-semibold"
            >
                {{ subtitle }}
            </p>
            <p
                v-else
                class="text-[9.5px] print:text-[8px] text-slate-600 font-semibold"
            >
                الإدارة العامة لتنمية الموارد البشرية
            </p>
        </div>
        <div class="shrink-0 px-2 print:px-1">
            <img
                src="/papaer-logo.png"
                alt="G.C.W.C"
                class="h-16 print:h-5 w-auto print:max-w-5 object-contain"
            />
        </div>
        <div class="text-left flex-1" dir="ltr">
            <p class="font-extrabold text-sm print:text-xs text-slate-950">
                Greater Cairo Sanitary Drainage Co.
            </p>
            <p class="text-[10.5px] print:text-[9px] text-slate-800 font-bold">
                Human &amp; Administrative Resources Development Sector
            </p>
        </div>
    </div>
</template>
