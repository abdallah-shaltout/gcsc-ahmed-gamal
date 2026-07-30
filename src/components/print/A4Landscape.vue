<script setup lang="ts">
defineProps<{ id?: string }>()

function printLandscape(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none;'
  document.body.appendChild(iframe)
  const doc = iframe.contentDocument!
  doc.open()
  doc.write(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{font-family:Arial,sans-serif;background:white;color:black;direction:rtl}
  @page{size:A4 landscape;margin:10mm}
  table{border-collapse:collapse;width:100%}
  td,th{border:1px solid #374151;padding:6px 10px;font-size:11px;vertical-align:top}
  th{background:#1e293b;color:white;font-weight:700;text-align:center}
  .flex{display:flex}.justify-between{justify-content:space-between}
  .items-start{align-items:flex-start}.font-extrabold{font-weight:800}
  .font-bold{font-weight:700}.text-sm{font-size:.875rem}.text-center{text-align:center}
  .border-b-2{border-bottom:2px solid}.border-slate-900{border-color:#0f172a}
  .pb-4{padding-bottom:1rem}.mb-5{margin-bottom:1.25rem}
  .text-slate-950{color:#020617}.text-slate-800{color:#1e293b}
  .text-slate-700{color:#334155}.text-slate-600{color:#475569}
  .tracking-widest{letter-spacing:.1em}.uppercase{text-transform:uppercase}
  .h-14{height:3.5rem}.w-auto{width:auto}
  svg{display:inline-block;vertical-align:middle}
  img{height:2.2rem;width:2.2rem;display:inline-block;object-fit:contain}
  .space-y-1>*+*{margin-top:.25rem}.font-black{font-weight:900}
</style>
</head>
<body>${el.innerHTML}</body>
</html>`)
  doc.close()
  iframe.contentWindow!.focus()
  iframe.contentWindow!.print()
  setTimeout(() => document.body.removeChild(iframe), 1000)
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
