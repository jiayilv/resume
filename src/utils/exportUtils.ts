import { toCanvas } from 'html-to-image';
import jsPDF from 'jspdf';
import { ResumeData } from '../types';

export interface SlicedResumePage {
  pageNumber: number;
  dataUrl: string;
  widthMm: number;
  heightMm: number;
}

/**
 * High-precision snapshot engine with html-to-image:
 * 1. Takes an exact high-resolution snapshot (2.5x pixel ratio) of the A4 preview canvas.
 * 2. If single page, fits into 1 standard A4 page (210mm x 297mm).
 * 3. If multi-page:
 *    - Page 1 takes the top segment up to 297mm.
 *    - Page 2+ splits remaining content and adds the top margin matching Page 1.
 */
export const sliceResumeCanvasToPages = async (
  elementId: string = 'resume-canvas'
): Promise<SlicedResumePage[]> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('未找到简历渲染节点 (resume-canvas)');
  }

  // Generate high-resolution canvas snapshot using html-to-image
  const canvas = await toCanvas(element, {
    pixelRatio: 2.6, // High DPI for crystal clear text & avatars
    backgroundColor: '#ffffff',
    cacheBust: true,
    filter: (node) => {
      if (node instanceof HTMLElement && node.classList.contains('no-print')) {
        return false;
      }
      return true;
    },
  });

  const fullWidth = canvas.width;
  const fullHeight = canvas.height;

  // Standard A4 aspect ratio height in canvas pixels: (width * 297) / 210
  const pageA4Height = Math.round((fullWidth * 297) / 210);

  // Top margin for subsequent pages (approx 22mm in canvas pixels, matching standard page 1 top padding)
  const topMarginPx = Math.round((fullWidth * 22) / 210);
  const bottomMarginPx = Math.round((fullWidth * 16) / 210);

  const pages: SlicedResumePage[] = [];

  // 1. Single Page Case (fits within 1 A4 page + slight tolerance)
  if (fullHeight <= pageA4Height + 15) {
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = fullWidth;
    pageCanvas.height = pageA4Height;
    const ctx = pageCanvas.getContext('2d');
    if (!ctx) throw new Error('无法创建 Canvas 2D 上下文');

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

    pages.push({
      pageNumber: 1,
      dataUrl: pageCanvas.toDataURL('image/jpeg', 0.98),
      widthMm: 210,
      heightMm: 297,
    });
    return pages;
  }

  // 2. Multi-Page Case
  // --- Page 1 ---
  const page1Canvas = document.createElement('canvas');
  page1Canvas.width = fullWidth;
  page1Canvas.height = pageA4Height;
  const ctx1 = page1Canvas.getContext('2d');
  if (!ctx1) throw new Error('无法创建 Canvas 2D 上下文');

  ctx1.fillStyle = '#ffffff';
  ctx1.fillRect(0, 0, fullWidth, pageA4Height);
  ctx1.drawImage(canvas, 0, 0, fullWidth, pageA4Height, 0, 0, fullWidth, pageA4Height);

  pages.push({
    pageNumber: 1,
    dataUrl: page1Canvas.toDataURL('image/jpeg', 0.98),
    widthMm: 210,
    heightMm: 297,
  });

  // --- Page 2 and subsequent pages ---
  // Effective content slice height per subsequent page (leaving room for top & bottom margins)
  const usableHeightPerSubsequentPage = pageA4Height - topMarginPx - bottomMarginPx;
  let currentSourceY = pageA4Height;
  let pageNum = 2;

  while (currentSourceY < fullHeight - 10) {
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = fullWidth;
    pageCanvas.height = pageA4Height;
    const ctx = pageCanvas.getContext('2d');
    if (!ctx) break;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, fullWidth, pageA4Height);

    const sliceHeight = Math.min(usableHeightPerSubsequentPage, fullHeight - currentSourceY);

    // Draw slice with topMarginPx offset from top of page
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

    pages.push({
      pageNumber: pageNum,
      dataUrl: pageCanvas.toDataURL('image/jpeg', 0.98),
      widthMm: 210,
      heightMm: 297,
    });

    currentSourceY += usableHeightPerSubsequentPage;
    pageNum++;
  }

  return pages;
};

/**
 * Generate full standalone HTML for sliced pages printing
 */
export const generatePrintHtml = (pages: SlicedResumePage[], docTitle: string = '个人简历'): string => {
  const pagesHtml = pages
    .map(
      (page, index) => `
      <div class="page-container" style="page-break-after: ${index === pages.length - 1 ? 'avoid' : 'always'}; break-after: ${index === pages.length - 1 ? 'avoid' : 'page'};">
        <img class="page-img" src="${page.dataUrl}" alt="Page ${page.pageNumber}" />
      </div>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
          color-adjust: exact !important;
        }
        html, body {
          width: 210mm;
          margin: 0 auto;
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
          image-rendering: -webkit-optimize-contrast;
        }
        @media screen {
          body {
            background: #e2e8f0;
            padding: 20px 0;
          }
          .page-container {
            margin: 0 auto 20px auto;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          }
        }
      </style>
    </head>
    <body>
      ${pagesHtml}
      <script>
        window.addEventListener('load', () => {
          setTimeout(() => {
            window.focus();
            window.print();
          }, 300);
        });
      </script>
    </body>
    </html>
  `;
};

/**
 * Direct print by capturing exact preview snapshot and printing via clean A4 iframe / popup
 */
export const printResumeCanvas = async (
  elementId: string = 'resume-canvas',
  docTitle: string = '个人简历'
): Promise<void> => {
  const pages = await sliceResumeCanvasToPages(elementId);
  if (!pages || pages.length === 0) {
    throw new Error('未生成打印页面');
  }

  const printHtml = generatePrintHtml(pages, docTitle);

  // Strategy 1: Hidden clean iframe inside current document
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
  if (iframeDoc) {
    iframeDoc.open();
    iframeDoc.write(printHtml);
    iframeDoc.close();

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
          setTimeout(resolve, 200);
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

    setTimeout(() => {
      try {
        printIframe.contentWindow?.focus();
        printIframe.contentWindow?.print();
      } catch (err) {
        console.warn('Iframe print blocked, opening new window fallback', err);
        openPrintWindow(pages, docTitle);
      }
    }, 250);
  } else {
    openPrintWindow(pages, docTitle);
  }
};

/**
 * Open standalone clean print tab/window
 */
export const openPrintWindow = (pages: SlicedResumePage[], docTitle: string = '个人简历') => {
  const printHtml = generatePrintHtml(pages, docTitle);
  const blob = new Blob([printHtml], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  const printWindow = window.open(blobUrl, '_blank');
  if (!printWindow) {
    // If popups blocked, redirect or notify
    const a = document.createElement('a');
    a.href = blobUrl;
    a.target = '_blank';
    a.click();
  }
};

/**
 * Export high-fidelity PDF using standard A4 sliced snapshot pages
 */
export const exportToPdf = async (
  elementId: string = 'resume-canvas',
  filename: string = '我的个人简历.pdf'
) => {
  const pages = await sliceResumeCanvasToPages(elementId);
  if (!pages || pages.length === 0) {
    throw new Error('未获取到页面');
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  pages.forEach((page, index) => {
    if (index > 0) {
      pdf.addPage('a4', 'portrait');
    }
    pdf.addImage(page.dataUrl, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  });

  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
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
    const canvas = await toCanvas(element, {
      pixelRatio: 2.5,
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


