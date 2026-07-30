<script setup lang="ts">
defineProps<{
  subtitle?: string
}>()
</script>

<template>
  <div class="flex justify-between items-center border-b-2 border-slate-900 pb-4 mb-5">
    <div class="text-right flex-1">
      <p class="font-extrabold text-sm mb-1 text-slate-950">شركة الصرف الصحي للقاهرة الكبرى</p>
      <p class="text-[10.5px] text-slate-800 font-bold">قطاع تنمية الموارد البشرية والإدارية</p>
      <p v-if="subtitle" class="text-[9.5px] text-slate-600 font-semibold">{{ subtitle }}</p>
      <p v-else class="text-[9.5px] text-slate-600 font-semibold">الإدارة العامة لتنمية الموارد البشرية</p>
    </div>
    <div class="shrink-0 px-4">
      <img src="/papaer-logo.png" alt="G.C.W.C" class="h-9 w-auto max-w-9 object-contain" />
    </div>
    <div class="text-left flex-1">
      <p class="font-extrabold text-sm mb-1 text-slate-950">Greater Cairo Sanitary Drainage Co.</p>
      <p class="text-[10.5px] text-slate-800 font-bold">Human &amp; Administrative Resources Development Sector</p>
    </div>
  </div>
</template>
