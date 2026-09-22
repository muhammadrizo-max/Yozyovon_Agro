import { jsPDF } from 'jspdf';
import { MFYData } from '../types';

/**
 * Uzbekcha maxsus harflarni jsPDF da xatosiz va chiroyli chiqishi uchun normalizatsiya qilish
 */
function cleanText(text: string | number): string {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/[ʻʼ`]/g, "'")
    .replace(/[«»]/g, '"');
}

export interface GovReportData {
  totalLimon: number;
  totalChorva: number;
  totalMaydon: number;
  totalFarmers: number;
  pendingSubsidiesCount: number;
  topMfyList: MFYData[];
  monthlyData: Array<{ oy: string; limonHosil: number; chorvaBosh: number }>;
}

/**
 * Yozyovon tumani davlat monitoringi va statistikasi rasmiy PDF hisobotini generatsiya qilish
 */
export function exportGovStatisticsPdf(data: GovReportData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = 16;

  // 1. Rasmiy Gerb & Bosh sarlavha bloki
  doc.setFillColor(15, 23, 42); // Navy Dark
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(cleanText("O'ZBEKISTON RESPUBLIKASI QISHLOQ XO'JALIGI VAZIRLIGI"), pageWidth / 2, 10, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(cleanText("Farg'ona viloyati Yozyovon tumani hokimligi agro-monitoring departamenti"), pageWidth / 2, 16, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(cleanText("RASMIY MONITORING VA STATISTIKA BOSHQARMASI HUJJATI"), pageWidth / 2, 22, { align: 'center' });

  currentY = 36;

  // 2. Hujjat rekvizitlari
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(cleanText("YOZYOVON TUMANI AGRO-MONITORING RASMIY HISOBOTI"), margin, currentY);

  currentY += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  doc.text(cleanText(`Hujjat №: YZY-STAT-2026/09-${Math.floor(1000 + Math.random() * 9000)}`), margin, currentY);
  doc.text(cleanText(`Sana: ${dateStr}`), pageWidth - margin, currentY, { align: 'right' });

  currentY += 4;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 6;

  // 3. Asosiy Ko'rsatkichlar (KPI Kartalari)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(cleanText("1. TUMAN ASOSIY KO'RSATKICHLARI (33 TA MFY JAMI)"), margin, currentY);
  currentY += 4;

  const cardWidth = (pageWidth - (margin * 2) - 9) / 4;
  const cardHeight = 18;

  const metrics = [
    { title: "Limonzorlar", val: `${data.totalLimon.toLocaleString()} tup`, col: [245, 158, 11] },
    { title: "Chorva Bosh", val: `${data.totalChorva.toLocaleString()} bosh`, col: [37, 99, 235] },
    { title: "Ekin Maydoni", val: `${data.totalMaydon.toLocaleString()} ga`, col: [16, 185, 129] },
    { title: "Fermerlar", val: `${data.totalFarmers.toLocaleString()} ta`, col: [147, 51, 234] }
  ];

  metrics.forEach((m, idx) => {
    const x = margin + (idx * (cardWidth + 3));
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, currentY, cardWidth, cardHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, currentY, cardWidth, cardHeight, 2, 2, 'D');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(cleanText(m.title), x + 3, currentY + 6);

    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(cleanText(m.val), x + 3, currentY + 13);
  });

  currentY += cardHeight + 8;

  // 4. Ko'p oylik hosil va chorva o'sish dinamikasi jadvali
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(cleanText("2. KO'P OYLIK LIMON HOSILI VA CHORVA O'SISH DINAMIKASI"), margin, currentY);
  currentY += 4;

  // Jadval sarlavhasi
  const dynColWidth = (pageWidth - margin * 2) / 6;
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, currentY, pageWidth - margin * 2, 6.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');

  const dynHeaders = ["Oy", "Limon Hosili (t)", "Chorva (ming bosh)", "Oy", "Limon Hosili (t)", "Chorva (ming bosh)"];
  dynHeaders.forEach((h, i) => {
    doc.text(cleanText(h), margin + (i * dynColWidth) + (dynColWidth / 2), currentY + 4.5, { align: 'center' });
  });

  currentY += 6.5;

  // 12 oylik ma'lumotlarni 2 ta ustun blokida chiqarish (6 qator)
  const firstHalf = data.monthlyData.slice(0, 6);
  const secondHalf = data.monthlyData.slice(6, 12);

  for (let r = 0; r < 6; r++) {
    const item1 = firstHalf[r];
    const item2 = secondHalf[r];
    const rowBg = r % 2 === 0 ? 255 : 248;
    doc.setFillColor(rowBg, rowBg, rowBg);
    doc.rect(margin, currentY, pageWidth - margin * 2, 5.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY + 5.5, pageWidth - margin, currentY + 5.5);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);

    if (item1) {
      doc.text(cleanText(item1.oy), margin + (0 * dynColWidth) + (dynColWidth / 2), currentY + 4, { align: 'center' });
      doc.text(cleanText(`${item1.limonHosil} t`), margin + (1 * dynColWidth) + (dynColWidth / 2), currentY + 4, { align: 'center' });
      doc.text(cleanText(`${item1.chorvaBosh} ming`), margin + (2 * dynColWidth) + (dynColWidth / 2), currentY + 4, { align: 'center' });
    }

    if (item2) {
      doc.text(cleanText(item2.oy), margin + (3 * dynColWidth) + (dynColWidth / 2), currentY + 4, { align: 'center' });
      doc.text(cleanText(`${item2.limonHosil} t`), margin + (4 * dynColWidth) + (dynColWidth / 2), currentY + 4, { align: 'center' });
      doc.text(cleanText(`${item2.chorvaBosh} ming`), margin + (5 * dynColWidth) + (dynColWidth / 2), currentY + 4, { align: 'center' });
    }

    currentY += 5.5;
  }

  currentY += 8;

  // 5. Yetakchi MFYlar reytingi (Top 10)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(cleanText("3. LIMON VA CHORVA BO'YICHA YETAKCHI MFYLAR REYTINGI"), margin, currentY);
  currentY += 4;

  const topCols = [
    { header: "№", width: 10, align: 'center' },
    { header: "MFY Nomi", width: 52, align: 'left' },
    { header: "Sektor", width: 26, align: 'center' },
    { header: "Maydon (ga)", width: 28, align: 'right' },
    { header: "Limon (tup)", width: 34, align: 'right' },
    { header: "Chorva (bosh)", width: 32, align: 'right' }
  ];

  doc.setFillColor(30, 41, 59);
  doc.rect(margin, currentY, pageWidth - margin * 2, 6.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');

  let curX = margin;
  topCols.forEach(col => {
    const textX = col.align === 'center' ? curX + col.width / 2 : col.align === 'right' ? curX + col.width - 2 : curX + 2;
    doc.text(cleanText(col.header), textX, currentY + 4.5, { align: col.align as any });
    curX += col.width;
  });

  currentY += 6.5;

  data.topMfyList.slice(0, 10).forEach((mfy, idx) => {
    const rowBg = idx % 2 === 0 ? 255 : 248;
    doc.setFillColor(rowBg, rowBg, rowBg);
    doc.rect(margin, currentY, pageWidth - margin * 2, 5.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY + 5.5, pageWidth - margin, currentY + 5.5);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);

    let cellX = margin;
    const rowValues = [
      String(idx + 1),
      cleanText(mfy.name.replace(' MFY', '')),
      cleanText(`${mfy.sektor || (mfy.id % 4 + 1)}-sektor`),
      cleanText(mfy.dehqonchilikGa.toLocaleString()),
      cleanText(mfy.limonDaraxtlari.toLocaleString()),
      cleanText(mfy.chorvaBoshlari.toLocaleString())
    ];

    rowValues.forEach((val, i) => {
      const col = topCols[i];
      const textX = col.align === 'center' ? cellX + col.width / 2 : col.align === 'right' ? cellX + col.width - 2 : cellX + 2;
      doc.text(val, textX, currentY + 4, { align: col.align as any });
      cellX += col.width;
    });

    currentY += 5.5;
  });

  currentY += 10;

  // 6. Mas'ul shaxslar imzo va tasdiq bloki
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(cleanText("HISOBOTNI TASDIQLOVCHI MAS'UL SHAXSLAR:"), margin, currentY);
  currentY += 6;

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  doc.text(cleanText("Yozyovon Tuman Hokimining qishloq xo'jaligi bo'yicha o'rinbosari:"), margin, currentY);
  doc.text(cleanText("___________________ (Imzo va Muhr o'rni)"), margin + 100, currentY);
  currentY += 6;

  doc.text(cleanText("Agro-Monitoring Tahlil Bo'limi Boshlig'i:"), margin, currentY);
  doc.text(cleanText("___________________ (Imzo)"), margin + 100, currentY);

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(cleanText("Yozyovon Agro-Monitoring Axborot Tizimi orqali avtomatik shakllantirilgan rasmiy elektron nusxa."), pageWidth / 2, pageHeight - 8, { align: 'center' });

  // Saqlash / Yuklash
  doc.save(`Yozyovon_Agro_Monitoring_Hisoboti_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}.pdf`);
}

/**
 * Alohida MFY bo'yicha rasmiy monitoring pasportini PDF formatida yuklab olish
 */
export function exportMfyPassportPdf(mfy: MFYData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = 16;

  // Sarlavha
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(cleanText("O'ZBEKISTON RESPUBLIKASI YOZYOVON TUMANI HOKIMLIGI"), pageWidth / 2, 10, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(cleanText("Mahalla Fuqarolar Yig'ini Qishloq Xo'jaligi Rasmiy Pasporti"), pageWidth / 2, 16, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(cleanText(`HUDUD: ${mfy.name.toUpperCase()} • SEKTOR: ${mfy.sektor || (mfy.id % 4 + 1)}-SEKTOR`), pageWidth / 2, 22, { align: 'center' });

  currentY = 36;

  // Rekvizitlar
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(cleanText(`${mfy.name} - AGRO MONITORING HUJJATI`), margin, currentY);

  currentY += 6;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(cleanText(`Hujjat kodi: MFY-PASSPORT-${mfy.id}-${new Date().getFullYear()}`), margin, currentY);
  doc.text(cleanText(`Koordinatalar: ${mfy.center[0].toFixed(4)} N, ${mfy.center[1].toFixed(4)} E`), pageWidth - margin, currentY, { align: 'right' });

  currentY += 4;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 6;

  // Asosiy ko'rsatkichlar
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(cleanText("1. MAHALLA AGRO IQTISODIY SALOHIYATI"), margin, currentY);
  currentY += 4;

  const cardW = (pageWidth - margin * 2 - 9) / 4;
  const metrics = [
    { title: "Dehqonchilik maydoni", val: `${mfy.dehqonchilikGa.toLocaleString()} ga` },
    { title: "Limon daraxtlari", val: `${mfy.limonDaraxtlari.toLocaleString()} tup` },
    { title: "Chorva boshlari", val: `${mfy.chorvaBoshlari.toLocaleString()} bosh` },
    { title: "Fermer xo'jaliklari", val: `${mfy.farmersCount} ta` }
  ];

  metrics.forEach((m, idx) => {
    const x = margin + idx * (cardW + 3);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, currentY, cardW, 18, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, currentY, cardW, 18, 2, 2, 'D');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(cleanText(m.title), x + 3, currentY + 6);

    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(cleanText(m.val), x + 3, currentY + 13);
  });

  currentY += 26;

  // Asosiy ekinlar
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(cleanText(`Ixtisoslashgan asosiy ekinlar: `), margin, currentY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(cleanText(mfy.asosiyEkinlar.join(', ')), margin + 55, currentY);
  currentY += 8;

  // 12 oylik hosildorlik jadvali
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(cleanText("2. YILLIK 12 OYLIK HOSIL MONITORINGI JADVALI"), margin, currentY);
  currentY += 4;

  const dynCols = [
    { header: "Oy", width: 28, align: 'center' },
    { header: "Limon Hosili (tonna)", width: 38, align: 'right' },
    { header: "Bug'doy (tonna)", width: 38, align: 'right' },
    { header: "Anor (tonna)", width: 38, align: 'right' },
    { header: "Sut (tonna)", width: 40, align: 'right' }
  ];

  doc.setFillColor(30, 41, 59);
  doc.rect(margin, currentY, pageWidth - margin * 2, 6.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');

  let curX = margin;
  dynCols.forEach(col => {
    const textX = col.align === 'center' ? curX + col.width / 2 : curX + col.width - 3;
    doc.text(cleanText(col.header), textX, currentY + 4.5, { align: col.align as any });
    curX += col.width;
  });

  currentY += 6.5;

  mfy.dynamics12Months.forEach((d, idx) => {
    const rowBg = idx % 2 === 0 ? 255 : 248;
    doc.setFillColor(rowBg, rowBg, rowBg);
    doc.rect(margin, currentY, pageWidth - margin * 2, 5.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY + 5.5, pageWidth - margin, currentY + 5.5);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);

    let cellX = margin;
    const vals = [
      cleanText(d.month),
      cleanText(`${d.limonTonna} t`),
      cleanText(`${d.bugdoyTonna} t`),
      cleanText(`${d.anorTonna} t`),
      cleanText(`${d.sutTonna} t`)
    ];

    vals.forEach((v, i) => {
      const col = dynCols[i];
      const textX = col.align === 'center' ? cellX + col.width / 2 : cellX + col.width - 3;
      doc.text(v, textX, currentY + 4, { align: col.align as any });
      cellX += col.width;
    });

    currentY += 5.5;
  });

  currentY += 14;

  // Imzolar
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(cleanText("MAS'ULLAR TASDIG'I:"), margin, currentY);
  currentY += 6;

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(cleanText(`${mfy.name} raisi va hokim yordamchisi: ____________________ (Imzo va Muhr)`), margin, currentY);
  currentY += 6;
  doc.text(cleanText(`Tuman agroinspeksiyasi vakili: ____________________ (Imzo)`), margin, currentY);

  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(cleanText("Yozyovon Agro Axborot Tizimi • Rasmiy MFY Pasporti"), pageWidth / 2, pageHeight - 8, { align: 'center' });

  doc.save(`${cleanText(mfy.name)}_Rasmiy_Pasporti.pdf`);
}
