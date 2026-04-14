/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValidationIssue, ComparisonIssue, AuditSummary } from '@/src/types/audit';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate, formatCurrency } from '@/src/utils/format';

export const exportToCSV = (data: any[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (data: any[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportSummaryPDF = (
  summary: AuditSummary, 
  validationIssues: ValidationIssue[], 
  comparisonIssues: ComparisonIssue[]
) => {
  const doc = new jsPDF();
  const now = new Date().toLocaleString('pt-BR');

  // Header
  doc.setFontSize(20);
  doc.text('Relatório de Auditoria de Fretes', 14, 22);
  doc.setFontSize(10);
  doc.text(`Gerado em: ${now}`, 14, 30);

  // Summary Section
  doc.setFontSize(14);
  doc.text('Resumo Executivo', 14, 45);
  
  const summaryData = [
    ['Total de Registros', summary.totalRecords.toString()],
    ['Variáveis Validadas', summary.totalValidatedVariables.toString()],
    ['Total de Inconsistências', summary.totalIssues.toString()],
    ['Alertas (Warning)', summary.totalWarnings.toString()],
    ['Erros Críticos (Error)', summary.totalErrors.toString()],
    ['Percentual de Conformidade', `${summary.compliancePercentage.toFixed(2)}%`],
  ];

  autoTable(doc, {
    startY: 50,
    head: [['Indicador', 'Valor']],
    body: summaryData,
    theme: 'striped',
  });

  // Validation Issues Section
  if (validationIssues.length > 0) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Inconsistências de Variáveis', 14, 22);
    
    const validationData = validationIssues.slice(0, 50).map(issue => [
      issue.cte || '-',
      issue.field,
      String(issue.currentValue || '-'),
      issue.severity,
      issue.message
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['CTE', 'Campo', 'Valor', 'Severidade', 'Mensagem']],
      body: validationData,
      styles: { fontSize: 8 },
    });
    
    if (validationIssues.length > 50) {
      doc.setFontSize(8);
      doc.text(`* Mostrando as primeiras 50 de ${validationIssues.length} inconsistências.`, 14, (doc as any).lastAutoTable.finalY + 10);
    }
  }

  // Comparison Issues Section
  if (comparisonIssues.length > 0) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Divergências entre Relatórios', 14, 22);
    
    const comparisonData = comparisonIssues.slice(0, 50).map(issue => [
      issue.cte,
      issue.field,
      String(issue.valueA || '-'),
      String(issue.valueB || '-'),
      issue.message
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['CTE', 'Campo', 'Valor A', 'Valor B', 'Mensagem']],
      body: comparisonData,
      styles: { fontSize: 8 },
    });

    if (comparisonIssues.length > 50) {
      doc.setFontSize(8);
      doc.text(`* Mostrando as primeiras 50 de ${comparisonIssues.length} divergências.`, 14, (doc as any).lastAutoTable.finalY + 10);
    }
  }

  doc.save('auditoria-fretes-resumo.pdf');
};
