<script setup lang="ts">
import { printDocument } from '@/libs/print'

defineProps<{ id?: string }>()

function printLandscape(id: string) {
  printDocument({ elementId: id, isLandscape: true, fontFamily: 'Arial' })
}
</script>

<template>
  <div>
    <slot name="actions" :print="() => id && printLandscape(id)" />

    <div
      :id="id"
      class="bg-white w-full max-w-[1050px] mx-auto p-10 shadow-2xl border border-slate-300/80 rounded-2xl text-black text-[11px] leading-relaxed flex flex-col"
      style="min-height: 680px;"
    >
      <slot />
    </div>
  </div>
</template>
