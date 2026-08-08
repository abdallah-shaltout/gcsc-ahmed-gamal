<script setup lang="ts">
import { printDocument } from '@/libs/print'

defineProps<{ id?: string }>()

function printDoc(id: string) {
  printDocument({ elementId: id, isLandscape: false, fontFamily: 'Arial' })
}
</script>

<template>
  <div>
    <!-- Print button slot area -->
    <slot name="actions" :print="() => id && printDoc(id)" />

    <!-- A4 preview -->
    <div
      :id="id"
      class="bg-white w-full max-w-[620px] mx-auto p-11 md:p-14 shadow-2xl border border-slate-300/80 rounded-2xl text-black text-[12.5px] leading-relaxed flex flex-col"
      style="min-height: 877px;"
    >
      <div class="flex flex-col flex-grow">
        <slot />
      </div>
    </div>
  </div>
</template>
