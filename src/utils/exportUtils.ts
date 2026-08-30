import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ResumeData } from '../types';

/**
 * High-precision canvas snapshot slicing into standard A4 pages (210mm x 297mm).
 * - Page 1 captures the top section with original layout and padding.
 * - Multi-page splits clean slices, adding the page 1 top margin to page 2+ so content never touches the top border.
 */
export const sliceResumeCanvasToPages = async (
  elementId: string = 'resume-canvas'
): Promise<string[]> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('未找到简历渲染节点');
  }

  // 1. Capture the element at high resolution
  const canvas = await html2canvas(element, {
    scale: 2.8, // Ultra-sharp print quality
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff',
    scrollX: 0,
    scrollY: 0,
    onclone: (clonedDoc) => {
      const clonedEl = clonedDoc.getElementById(elementId);
      if (clonedEl) {
        clonedEl.style.transform = 'none';
        clonedEl.style.boxShadow = 'none';
        clonedEl.style.margin = '0';
        clonedEl.style.width = '210mm';
      }
      const noPrints = clonedDoc.querySelectorAll('.no-print');
      noPrints.forEach((el) => ((el as HTMLElement).style.display = 'none'));
    },
  });

  const fullWidth = canvas.width;
  const fullHeight = canvas.height;

  // Standard A4 aspect ratio height in canvas pixels: (width * 297) / 210
  const pageA4Height = Math.round((fullWidth * 297) / 210);

  // Top margin for subsequent pages (approx 20mm in canvas pixels, matching standard page 1 top padding)
  const topMarginPx = Math.round((fullWidth * 20) / 210);
  const bottomMarginPx = Math.round((fullWidth * 12) / 210);

  const pageDataUrls: string[] = [];

  // Single page case (fits in 1 A4 page with small tolerance)
  if (fullHeight <= pageA4Height + 20) {
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = fullWidth;
    pageCanvas.height = pageA4Height;
    const ctx = pageCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, fullWidth, pageA4Height);
      ctx.drawImage(
        canvas,
        0,
        0,
        fullWidth,
        Math.min(fullHeight, pageA4Height),
        0,
        0,
        fullWidth,
        Math.min(fullHeight, pageA4Height)
      );
      pageDataUrls.push(pageCanvas.toDataURL('image/jpeg', 0.98));
    }
    return pageDataUrls;
  }

  // Multi-page case
  // Page 1: from y=0 to y=pageA4Height
  const page1Canvas = document.createElement('canvas');
  page1Canvas.width = fullWidth;
  page1Canvas.height = pageA4Height;
  const ctx1 = page1Canvas.getContext('2d');
  if (ctx1) {
    ctx1.fillStyle = '#ffffff';
    ctx1.fillRect(0, 0, fullWidth, pageA4Height);
    ctx1.drawImage(canvas, 0, 0, fullWidth, pageA4Height, 0, 0, fullWidth, pageA4Height);
    pageDataUrls.push(page1Canvas.toDataURL('image/jpeg', 0.98));
  }

  // Subsequent pages (Page 2, Page 3, ...)
  // Effective content slice height per subsequent page
  const usableHeightPerSubsequentPage = pageA4Height - topMarginPx - bottomMarginPx;
  let currentSourceY = pageA4Height;

  while (currentSourceY < fullHeight - 10) {
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = fullWidth;
    pageCanvas.height = pageA4Height;
    const ctx = pageCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, fullWidth, pageA4Height);

      const sliceHeight = Math.min(usableHeightPerSubsequentPage, fullHeight - currentSourceY);

      // Draw with topMarginPx offset from top of page
      ctx.drawImage(
        canvas,
        0,
        currentSourceY,
        fullWidth,
        sliceHeight,
        0,
        topMarginPx,
        fullWidth,
        sliceHeight
      );

      pageDataUrls.push(pageCanvas.toDataURL('image/jpeg', 0.98));
    }

    currentSourceY += usableHeightPerSubsequentPage;
  }

  return pageDataUrls;
};

/**
 * Direct print by capturing exact preview snapshot and printing via clean A4 iframe
 */
export const printResumeCanvas = async (
  elementId: string = 'resume-canvas',
  docTitle: string = '个人简历'
): Promise<void> => {
  try {
    const pages = await sliceResumeCanvasToPages(elementId);
    if (!pages || pages.length === 0) {
      window.print();
      return;
    }

    // Create or get print iframe
    let printIframe = document.getElementById('resume-print-iframe') as HTMLIFrameElement;
    if (!printIframe) {
      printIframe = document.createElement('iframe');
      printIframe.id = 'resume-print-iframe';
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '0';
      printIframe.style.height = '0';
      printIframe.style.border = 'none';
      printIframe.style.zIndex = '-9999';
      document.body.appendChild(printIframe);
    }

    const iframeDoc = printIframe.contentDocument || printIframe.contentWindow?.document;
    if (!iframeDoc) {
      window.print();
      return;
    }

    const pagesHtml = pages
      .map(
        (dataUrl, index) => `
        <div class="page-container" style="page-break-after: ${index === pages.length - 1 ? 'avoid' : 'always'}; break-after: ${index === pages.length - 1 ? 'avoid' : 'page'};">
          <img class="page-img" src="${dataUrl}" alt="Page ${index + 1}" />
        </div>
      `
      )
      .join('');

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${docTitle}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 0mm !important;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            width: 210mm;
            margin: 0;
            padding: 0;
            background: #ffffff;
          }
          .page-container {
            width: 210mm;
            height: 297mm;
            max-height: 297mm;
            overflow: hidden;
            margin: 0;
            padding: 0;
            background: #ffffff;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .page-img {
            width: 210mm;
            height: 297mm;
            display: block;
            object-fit: fill;
          }
        </style>
      </head>
      <body>
        ${pagesHtml}
      </body>
      </html>
    `);
    iframeDoc.close();

    // Wait for all images in iframe to load
    await new Promise<void>((resolve) => {
      const images = iframeDoc.querySelectorAll('img');
      let loadedCount = 0;
      if (images.length === 0) {
        resolve();
        return;
      }
      const checkAllLoaded = () => {
        loadedCount++;
        if (loadedCount >= images.length) {
          setTimeout(resolve, 150);
        }
      };
      images.forEach((img) => {
        if (img.complete) {
          checkAllLoaded();
        } else {
          img.onload = checkAllLoaded;
          img.onerror = checkAllLoaded;
        }
      });
    });

    // Invoke print
    setTimeout(() => {
      try {
        printIframe.contentWindow?.focus();
        printIframe.contentWindow?.print();
      } catch (e) {
        console.error('Iframe print error, falling back to window.print()', e);
        window.print();
      }
    }, 200);
  } catch (error) {
    console.error('Snapshot print failed, falling back to window.print()', error);
    window.print();
  }
};

/**
 * Export high-fidelity PDF using standard A4 sliced snapshot pages
 */
export const exportToPdf = async (
  elementId: string = 'resume-canvas',
  filename: string = '我的个人简历.pdf'
) => {
  try {
    const pages = await sliceResumeCanvasToPages(elementId);
    if (!pages || pages.length === 0) {
      alert('生成 PDF 失败，未获取到页面');
      return;
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    pages.forEach((pageDataUrl, index) => {
      if (index > 0) {
        pdf.addPage('a4', 'portrait');
      }
      pdf.addImage(pageDataUrl, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    });

    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
  } catch (error) {
    console.error('PDF export error:', error);
    alert('导出 PDF 失败，请检查浏览器设置或使用打印功能另存为 PDF');
  }
};

export const exportToJson = (data: ResumeData, filename: string = '简历数据备份.json') => {
  try {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('JSON export error:', error);
    alert('导出 JSON 失败');
  }
};

export const exportToImage = async (elementId: string, filename: string = '我的简历.png') => {
  const element = document.getElementById(elementId);
  if (!element) return;
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error(err);
  }
};

