<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <header class="no-print bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white shadow-md border-b border-blue-800/30">
    <div class="max-w-[1550px] mx-auto px-4 py-3.5 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/')">
        <div class="p-2 bg-blue-800/40 rounded-xl border border-blue-500/20 shadow-inner">
          <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-lg font-extrabold tracking-tight">شركة مياه الصرف الصحي للقاهرة الكبرى</h1>
          <p class="text-[11px] text-blue-200/80 font-medium">المنظومة الرقمية الذكية لإصدار الإنذارات ومتابعة الانقطاعات</p>
        </div>
      </div>

      <nav class="flex items-center gap-2">
        <RouterLink to="/" class="px-3 py-1.5 rounded-lg text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all">
          النموذج
        </RouterLink>
        <RouterLink to="/documents" class="px-3 py-1.5 rounded-lg text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all">
          النماذج
        </RouterLink>
        <RouterLink to="/committee" class="px-3 py-1.5 rounded-lg text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all">
          اللجنة
        </RouterLink>
        <RouterLink to="/minutes" class="px-3 py-1.5 rounded-lg text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all">
          المحضر
        </RouterLink>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 mr-2">
          <span class="w-2 h-2 bg-emerald-400 rounded-full ml-1.5 animate-pulse"></span>
          v3.0
        </span>
      </nav>
    </div>
  </header>
</template>
