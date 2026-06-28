<script setup lang="ts">
defineProps<{
  signerTitle?: string
  copies?: string[]
}>()
</script>

<template>
  <div class="mt-auto border-t border-slate-300 pt-5 flex justify-between items-end text-[10.5px] text-slate-700">
    <div class="space-y-1">
      <p class="font-bold text-slate-900">صورة مع التحية لجهة:</p>
      <template v-if="copies && copies.length">
        <p v-for="c in copies" :key="c" class="pr-2">- {{ c }}</p>
      </template>
      <template v-else>
        <p class="pr-2">- الشؤون القانونية المركزية بالشركة</p>
        <p class="pr-2">- ملف الخدمة والملفات الفرعية للموظف</p>
        <p class="pr-2">- رئيس قطاع الموارد البشرية للمتابعة</p>
      </template>
    </div>
    <div class="text-center pl-4">
      <p class="font-bold text-slate-950 mb-9">
        يعتمد للتنفيذ،،،<br>
        <span class="text-[11.5px] font-extrabold">{{ signerTitle ?? 'مدير عام الموارد البشرية' }}</span>
      </p>
      <p class="text-slate-400 font-mono">............................................</p>
    </div>
  </div>
</template>
