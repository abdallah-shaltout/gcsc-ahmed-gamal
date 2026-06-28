<script setup lang="ts">
defineProps<{ id?: string }>()

function printDoc(id: string) {
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
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{font-family:'Cairo',sans-serif;background:white;color:black;direction:rtl}
  @page{size:A4 portrait;margin:15mm}
  .flex{display:flex}.flex-col{flex-direction:column}.flex-grow{flex:1 1 auto}
  .justify-between{justify-content:space-between}.items-start{align-items:flex-start}
  .items-end{align-items:flex-end}.items-center{align-items:center}
  .text-center{text-align:center}.text-justify{text-align:justify}.text-right{text-align:right}
  .font-extrabold{font-weight:800}.font-bold{font-weight:700}.font-semibold{font-weight:600}
  .font-black{font-weight:900}.font-mono{font-family:monospace}
  .text-sm{font-size:.875rem}.text-xs{font-size:.75rem}.text-base{font-size:1rem}
  .underline{text-decoration:underline}.decoration-double{text-decoration-style:double}
  .leading-relaxed{line-height:1.625}.space-y-4>*+*{margin-top:1rem}
  .space-y-3>*+*{margin-top:.75rem}.space-y-1>*+*{margin-top:.25rem}
  .border-b-2{border-bottom:2px solid}.border-t{border-top:1px solid}
  .border-slate-900{border-color:#0f172a}.border-slate-300{border-color:#cbd5e1}
  .border-dashed{border-style:dashed}.rounded{border-radius:.25rem}.rounded-lg{border-radius:.5rem}
  .bg-slate-100{background:#f1f5f9}.bg-red-50{background:#fef2f2}.bg-amber-50{background:#fffbeb}
  .bg-orange-50{background:#fff7ed}.bg-red-100{background:#fee2e2}
  .text-slate-950{color:#020617}.text-slate-900{color:#0f172a}.text-slate-800{color:#1e293b}
  .text-slate-700{color:#334155}.text-slate-600{color:#475569}.text-slate-400{color:#94a3b8}
  .text-red-950{color:#450a0a}.text-amber-950{color:#451a03}.text-orange-950{color:#431407}
  .pb-4{padding-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mb-9{margin-bottom:2.25rem}
  .mb-1{margin-bottom:.25rem}.mt-auto{margin-top:auto}.pt-5{padding-top:1.25rem}
  .pr-2{padding-right:.5rem}.pr-3{padding-right:.75rem}.pl-4{padding-left:1rem}
  .px-1\\.5{padding:.125rem .375rem}.p-3{padding:.75rem}.p-3\\.5{padding:.875rem}
  .p-2\\.5{padding:.625rem}.w-12{width:3rem}.h-12{height:3rem}
  svg{display:inline-block;vertical-align:middle}
  .tracking-wide{letter-spacing:.025em}.tracking-widest{letter-spacing:.1em}
  .uppercase{text-transform:uppercase}
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
