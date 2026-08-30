import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ResumeData } from '../types';

export const exportToPdf = async (elementId: string, filename: string = '我的个人简历.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('未找到简历内容节点');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // 2x high-resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width mm
    const pageHeight = 297; // A4 height mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
  } catch (error) {
    console.error('PDF导出失败:', error);
    // Fallback to window.print()
    window.print();
  }
};

export const exportToJson = (data: ResumeData, filename: string = 'resume-backup.json') => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
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
