export interface PrintDocumentOptions {
    elementId: string;
    isLandscape?: boolean;
    title?: string;
    fontFamily?: "Cairo" | "Arial";
}

const PRINT_STYLES = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{direction:rtl;color:#0f172a}
.flex{display:flex}.flex-col{flex-direction:column}.flex-grow{flex:1 1 auto}
.justify-between{justify-content:space-between}.items-center{align-items:center}.items-start{align-items:flex-start}.items-end{align-items:flex-end}
.text-center{text-align:center}.text-justify{text-align:justify}.text-left{text-align:left}.text-right{text-align:right}
.font-extrabold{font-weight:800}.font-bold{font-weight:700}.font-semibold{font-weight:600}.font-black{font-weight:900}.font-mono{font-family:monospace}
.text-sm{font-size:.875rem}.text-xs{font-size:.75rem}.text-base{font-size:1rem}
.underline{text-decoration:underline}.decoration-double{text-decoration-style:double}
.leading-relaxed{line-height:1.625}
.space-y-4>*+*{margin-top:1rem}.space-y-3\\.5>*+*{margin-top:.875rem}.space-y-3>*+*{margin-top:.75rem}
.space-y-2>*+*{margin-top:.5rem}.space-y-1>*+*{margin-top:.25rem}.space-y-0\\.5>*+*{margin-top:.125rem}
.border-b-2{border-bottom:2px solid}.border-t{border-top:1px solid}.border-b{border-bottom:1px solid}
.border{border:1px solid}.border-dashed{border-style:dashed}
.border-slate-900{border-color:#0f172a}.border-slate-700{border-color:#374151}
.border-slate-400{border-color:#94a3b8}.border-slate-300{border-color:#cbd5e1}.border-slate-200{border-color:#e2e8f0}
.border-red-400{border-color:#f87171}.border-red-200{border-color:#fecaca}
.rounded{border-radius:.25rem}.rounded-lg{border-radius:.5rem}
.bg-slate-100{background:#f1f5f9}.bg-slate-800{background:#1e293b}.bg-red-50{background:#fef2f2}.bg-amber-50{background:#fffbeb}.bg-orange-50{background:#fff7ed}.bg-red-100{background:#fee2e2}
.text-slate-950{color:#020617}.text-slate-900{color:#0f172a}.text-slate-800{color:#1e293b}
.text-slate-700{color:#334155}.text-slate-600{color:#475569}.text-slate-500{color:#64748b}
.text-slate-400{color:#94a3b8}.text-slate-300{color:#cbd5e1}.text-red-950{color:#450a0a}.text-white{color:#fff}
.text-amber-950{color:#451a03}.text-orange-950{color:#431407}
.pb-4{padding-bottom:1rem}.pb-3{padding-bottom:.75rem}.pb-2{padding-bottom:.5rem}
.mb-5{margin-bottom:1.25rem}.mb-9{margin-bottom:2.25rem}.mb-4{margin-bottom:1rem}.mb-3{margin-bottom:.75rem}.mb-2{margin-bottom:.5rem}.mb-1{margin-bottom:.25rem}
.mt-auto{margin-top:auto}.mt-4{margin-top:1rem}.mt-3{margin-top:.75rem}.mt-2{margin-top:.5rem}
.pt-5{padding-top:1.25rem}.pt-4{padding-top:1rem}.pt-3{padding-top:.75rem}.pt-2{padding-top:.5rem}
.pr-2{padding-right:.5rem}.pr-3{padding-right:.75rem}.pr-4{padding-right:1rem}.pl-4{padding-left:1rem}.px-2{padding-left:.5rem;padding-right:.5rem}
.px-1\\.5{padding:.125rem .375rem}
.p-2{padding:.5rem}.p-3{padding:.75rem}.p-4{padding:1rem}.p-3\\.5{padding:.875rem}.p-2\\.5{padding:.625rem}
.w-12{width:3rem}.h-12{height:3rem}.w-8{width:2rem}.h-8{height:2rem}.w-32{width:8rem}.h-14{height:3.5rem}.w-auto{width:auto}
.min-w-8{min-width:2rem}.min-h-\\[50px\\]{min-height:50px}.min-w-\\[40px\\]{min-width:40px}
.inline{display:inline}.overflow-auto{overflow:visible}.align-top{vertical-align:top}
.whitespace-pre-line{white-space:pre-line}
.tracking-wide{letter-spacing:.025em}.tracking-widest{letter-spacing:.1em}.uppercase{text-transform:uppercase}
.grid{display:grid}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.gap-4{gap:1rem}.gap-3{gap:.75rem}.gap-2{gap:.5rem}.gap-1{gap:.25rem}
.w-\\[5\\%\\]{width:5%}.w-\\[18\\%\\]{width:18%}.w-\\[12\\%\\]{width:12%}.w-\\[40\\%\\]{width:40%}.w-\\[25\\%\\]{width:25%}
table{border-collapse:collapse;width:100%}
td,th{border:1px solid #374151;padding:6px 10px;font-size:11px;vertical-align:top}
th{background:#1e293b;color:white;font-weight:700;text-align:center}
svg{display:inline-block;vertical-align:middle}
img{height:2.2rem;width:2.2rem;display:inline-block;object-fit:contain}
[contenteditable]{outline:none!important;background:transparent!important;box-shadow:none!important}
.text-\\[9px\\]{font-size:9px}.text-\\[10px\\]{font-size:10px}.text-\\[10\\.5px\\]{font-size:10.5px}
.text-\\[11px\\]{font-size:11px}.text-\\[11\\.5px\\]{font-size:11.5px}.text-\\[12px\\]{font-size:12px}.text-\\[12\\.5px\\]{font-size:12.5px}
.text-\\[13px\\]{font-size:13px}
`;

/**
 * Prints a document element (Arabic/RTL, A4) via a hidden iframe with Cairo font and Tailwind-equivalent CSS inlined.
 */
export function printDocument(options: PrintDocumentOptions): void {
    const { elementId, isLandscape = false, title = "Print", fontFamily = "Cairo" } = options;
    const el = document.getElementById(elementId);
    if (!el) return;

    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none;";
    document.body.appendChild(iframe);

    const orientation = isLandscape ? "landscape" : "portrait";
    const margin = isLandscape ? "10mm" : "15mm";
    const fontLink = fontFamily === "Cairo"
        ? `<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">`
        : "";
    const fontRule = `html,body{font-family:${fontFamily === "Cairo" ? "'Cairo',sans-serif" : "Arial,sans-serif"}}`;

    const doc = iframe.contentDocument!;
    doc.open();
    doc.write(`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>${title}</title>
${fontLink}
<style>@page{size:A4 ${orientation};margin:${margin}}${fontRule}${PRINT_STYLES}</style></head><body style="margin:0;padding:0">${el.innerHTML}</body></html>`);
    doc.close();

    iframe.contentWindow!.focus();
    iframe.contentWindow!.print();
    setTimeout(() => document.body.removeChild(iframe), 1500);
}
