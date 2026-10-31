import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface StudentPerformanceData {
  studentName: string;
  grade: string;
  academicYear: string;
  overallAverage: number;
  courses: {
    name: string;
    score: number;
    grade: string;
    testScore: number;
    midScore: number;
    finalScore: number;
    assignmentScore: number;
  }[];
  strengths: string[];
  areasToImprove: string[];
}

export const generatePerformanceReportPDF = async (data: StudentPerformanceData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 20;

  // Header
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(31, 41, 55);
  pdf.text('EduFamily', margin, yPosition);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  pdf.text('Performance Report', pageWidth - margin - 35, yPosition);

  yPosition += 15;

  // Divider
  pdf.setDrawColor(229, 231, 235);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Student Info
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(31, 41, 55);
  pdf.text(data.studentName, margin, yPosition);
  yPosition += 8;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  pdf.text(`${data.grade} • ${data.academicYear}`, margin, yPosition);
  yPosition += 15;

  // Overall Average Box
  pdf.setFillColor(245, 247, 250);
  pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 25, 3, 3, 'F');
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  pdf.text('Overall Average', margin + 10, yPosition + 10);
  
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  const avgColor = data.overallAverage >= 85 ? [34, 197, 94] : 
                   data.overallAverage >= 70 ? [234, 179, 8] : [239, 68, 68];
  pdf.setTextColor(avgColor[0], avgColor[1], avgColor[2]);
  pdf.text(`${data.overallAverage.toFixed(1)}%`, margin + 10, yPosition + 20);
  
  yPosition += 35;

  // Course Performance Table
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(31, 41, 55);
  pdf.text('Course Performance', margin, yPosition);
  yPosition += 8;

  // Table Header
  const colWidths = [45, 20, 25, 25, 25, 30];
  const headers = ['Course', 'Score', 'Test', 'Mid', 'Final', 'Assignment'];
  
  pdf.setFillColor(249, 250, 251);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(107, 114, 128);
  
  let xPos = margin + 3;
  headers.forEach((header, i) => {
    pdf.text(header, xPos, yPosition + 5);
    xPos += colWidths[i];
  });
  yPosition += 10;

  // Table Rows
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(55, 65, 81);
  
  data.courses.forEach((course) => {
    xPos = margin + 3;
    pdf.text(course.name, xPos, yPosition + 5);
    xPos += colWidths[0];
    
    // Color-code the score
    const scoreColor = course.score >= 85 ? [34, 197, 94] : 
                       course.score >= 70 ? [234, 179, 8] : [239, 68, 68];
    pdf.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${course.score}%`, xPos, yPosition + 5);
    xPos += colWidths[1];
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(55, 65, 81);
    pdf.text(`${course.testScore}`, xPos, yPosition + 5);
    xPos += colWidths[2];
    pdf.text(`${course.midScore}`, xPos, yPosition + 5);
    xPos += colWidths[3];
    pdf.text(`${course.finalScore}`, xPos, yPosition + 5);
    xPos += colWidths[4];
    pdf.text(`${course.assignmentScore}`, xPos, yPosition + 5);
    
    yPosition += 8;
    
    // Add divider between rows
    pdf.setDrawColor(243, 244, 246);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 2;
  });

  yPosition += 10;

  // Strengths and Areas to Improve
  if (data.strengths.length > 0 || data.areasToImprove.length > 0) {
    const boxWidth = (pageWidth - 2 * margin - 10) / 2;
    
    // Strengths
    pdf.setFillColor(236, 253, 245);
    pdf.roundedRect(margin, yPosition, boxWidth, 40, 3, 3, 'F');
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 197, 94);
    pdf.text('Strengths', margin + 5, yPosition + 8);
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(55, 65, 81);
    data.strengths.slice(0, 4).forEach((strength, i) => {
      pdf.text(`• ${strength}`, margin + 5, yPosition + 16 + i * 6);
    });

    // Areas to Improve
    pdf.setFillColor(254, 249, 195);
    pdf.roundedRect(margin + boxWidth + 10, yPosition, boxWidth, 40, 3, 3, 'F');
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(161, 98, 7);
    pdf.text('Areas to Improve', margin + boxWidth + 15, yPosition + 8);
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(55, 65, 81);
    data.areasToImprove.slice(0, 4).forEach((area, i) => {
      pdf.text(`• ${area}`, margin + boxWidth + 15, yPosition + 16 + i * 6);
    });

    yPosition += 50;
  }

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(156, 163, 175);
  pdf.text(
    `Generated on ${new Date().toLocaleDateString()} by EduFamily`,
    margin,
    pdf.internal.pageSize.getHeight() - 10
  );
  pdf.text(
    'This is an automatically generated report.',
    pageWidth - margin - 60,
    pdf.internal.pageSize.getHeight() - 10
  );

  // Save the PDF
  pdf.save(`${data.studentName.replace(/\s+/g, '_')}_Performance_Report.pdf`);
};

export const exportChartAsPDF = async (elementId: string, title: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    return;
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EduFamily', margin, 20);
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text(title, margin, 30);

  // Chart Image
  const imgWidth = pageWidth - 2 * margin;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  pdf.addImage(imgData, 'PNG', margin, 40, imgWidth, imgHeight);

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(156, 163, 175);
  pdf.text(
    `Generated on ${new Date().toLocaleDateString()} by EduFamily`,
    margin,
    pdf.internal.pageSize.getHeight() - 10
  );

  pdf.save(`${title.replace(/\s+/g, '_')}.pdf`);
};

export const generateFullAnalyticsReportPDF = async (
  studentName: string,
  academicYear: string,
  summaryStats: { label: string; value: string; change: string }[],
  chartsContainerId: string
): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = 20;

  // Header
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(31, 41, 55);
  pdf.text('EduFamily', margin, yPosition);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  pdf.text('Analytics Report', pageWidth - margin - 30, yPosition);

  yPosition += 15;

  // Divider
  pdf.setDrawColor(229, 231, 235);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Report Info
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(31, 41, 55);
  pdf.text(`Performance Analytics - ${studentName}`, margin, yPosition);
  yPosition += 8;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(107, 114, 128);
  pdf.text(`Academic Year: ${academicYear}`, margin, yPosition);
  yPosition += 15;

  // Summary Stats
  const statWidth = (pageWidth - 2 * margin - 15) / 4;
  summaryStats.forEach((stat, i) => {
    const xPos = margin + i * (statWidth + 5);
    
    pdf.setFillColor(249, 250, 251);
    pdf.roundedRect(xPos, yPosition, statWidth, 25, 2, 2, 'F');
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(107, 114, 128);
    pdf.text(stat.label, xPos + 5, yPosition + 8);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(31, 41, 55);
    pdf.text(stat.value, xPos + 5, yPosition + 18);
  });

  yPosition += 35;

  // Capture and add charts
  const chartsContainer = document.getElementById(chartsContainerId);
  if (chartsContainer) {
    const charts = chartsContainer.querySelectorAll('.chart-container');
    
    for (let i = 0; i < charts.length; i++) {
      const chart = charts[i] as HTMLElement;
      
      // Check if we need a new page
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = 20;
      }

      const canvas = await html2canvas(chart, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = (pageWidth - 2 * margin) / 2 - 5;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const xPos = margin + (i % 2) * (imgWidth + 10);
      const adjustedYPos = i % 2 === 0 ? yPosition : yPosition;

      pdf.addImage(imgData, 'PNG', xPos, adjustedYPos, imgWidth, Math.min(imgHeight, 80));

      if (i % 2 === 1) {
        yPosition += Math.min(imgHeight, 80) + 10;
      }
    }
  }

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(156, 163, 175);
  pdf.text(
    `Generated on ${new Date().toLocaleDateString()} by EduFamily`,
    margin,
    pageHeight - 10
  );

  pdf.save(`Analytics_Report_${studentName.replace(/\s+/g, '_')}_${academicYear}.pdf`);
};
