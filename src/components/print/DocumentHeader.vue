<script setup lang="ts">
defineProps<{
  subtitle?: string
}>()
</script>

<template>
  <div class="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-5">
    <div class="text-right">
      <p class="font-extrabold text-sm mb-1 text-slate-950">شركة مياه الصرف الصحي للقاهرة الكبرى</p>
      <p class="text-[10.5px] text-slate-800 font-bold">الإدارة العامة للشئون الإدارية والموارد البشرية</p>
      <p v-if="subtitle" class="text-[9.5px] text-slate-600 font-semibold">{{ subtitle }}</p>
      <p v-else class="text-[9.5px] text-slate-600 font-semibold">قسم إنهاء الخدمة، التحقيقات والجزاءات</p>
    </div>
    <!-- شعار الشركة SVG -->
    <div class="flex flex-col items-center">
      <svg class="w-12 h-12 text-blue-950" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="5"/>
        <path d="M50 20 C35 45 35 65 50 80 C65 65 65 45 50 20 Z" fill="currentColor"/>
        <path d="M35 50 Q50 65 65 50" stroke="white" stroke-width="3" fill="none"/>
      </svg>
      <span class="text-[8px] font-black text-slate-800 mt-1 uppercase tracking-widest">G.C.W.C</span>
    </div>
  </div>
</template>
