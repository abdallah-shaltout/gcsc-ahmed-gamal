import html2canvas from 'html2canvas-pro';

export interface PrintDocumentOptions {
    elementId: string;
    isLandscape?: boolean;
    title?: string;
    fontFamily?: "Cairo" | "Arial";
}

export async function printDocument(options: PrintDocumentOptions): Promise<void> {
    const { elementId, isLandscape = false, title = "Print" } = options;
    const el = document.getElementById(elementId);
    if (!el) return;

    const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
    });

    const dataUrl = canvas.toDataURL('image/png');
    const orientation = isLandscape ? 'landscape' : 'portrait';

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
@page { size: A4 ${orientation}; margin: 0; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 100%; height: 100%; }
img { display: block; width: 100%; height: auto; }
</style>
</head>
<body>
<img id="printImg" src="${dataUrl}" alt="${title}">
<script>
  var img = document.getElementById('printImg');
  function doPrint() { window.focus(); window.print(); window.close(); }
  if (img.complete) doPrint(); else img.onload = doPrint;
<\/script>
</body>
</html>`);
    printWindow.document.close();
}
