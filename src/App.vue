<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <Toast position="bottom-right" />
    <AppHeader />
    <RouterView />
    <AppFooter />
  </div>
</template>
