<script setup lang="ts">
import CompanyFooter from './CompanyFooter.vue'

defineProps<{
  signerTitle?: string
  copies?: string[]
}>()
</script>

<template>
  <div class="mt-auto">
    <div class=" pt-5 flex justify-between items-end text-[10.5px] text-slate-700">
    
      <div class="text-center pl-4 w-fit ms-auto">
               <p class="font-bold text-slate-950 mt-1">
          التوقيع<br>
          الاستاذ/ حازم فاروق عبدالمنصف<br>
          <span class="text-[11.5px] font-extrabold">مدير عام الموارد البشرية</span>
        </p>
      </div>
    </div>
    <CompanyFooter />
  </div>
</template>
