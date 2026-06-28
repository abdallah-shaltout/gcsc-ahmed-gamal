<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  text: string
  tag?: string
  class?: string
}>()

const emit = defineEmits<{
  'update:text': [value: string]
}>()

const el = ref<HTMLElement | null>(null)

onMounted(() => {
  if (el.value) el.value.innerHTML = props.text
})

watch(() => props.text, (val) => {
  if (el.value && el.value.innerHTML !== val) {
    el.value.innerHTML = val
  }
})

function onInput() {
  if (el.value) emit('update:text', el.value.innerHTML)
}
</script>

<template>
  <component
    :is="tag ?? 'p'"
    ref="el"
    contenteditable="true"
    @input="onInput"
    :class="[
      'outline-none focus:bg-blue-50/40 focus:ring-1 focus:ring-blue-300 rounded transition-all cursor-text',
      props.class
    ]"
    spellcheck="false"
  />
</template>
