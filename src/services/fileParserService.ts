/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Set worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export interface ParseResult {
  headers: string[];
  data: Record<string, unknown>[];
}

export const parsePDF = async (file: File): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        
        const data: Record<string, unknown>[] = [];
        let headers: string[] = [
          'CTe/NFS', 'Emissão', 'Remetente / Origem', 'Destinatário / Destino',
          'Tipo Frete', 'Peso / Kg', 'Valor frete', 'ICMS/ISS', '(%)',
          'Frete tab.', 'PIS', 'COFINS', 'IR', 'CSSL', 'Vl Carreteiro', 'Líquido'
        ];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          const items = textContent.items as any[];
          
          // Group by Y coordinate (with some tolerance)
          const linesMap = new Map<number, any[]>();
          items.forEach(item => {
            if (!item.transform) return;
            const y = Math.round(item.transform[5] / 5) * 5; // Grouping tolerance
            if (!linesMap.has(y)) {
              linesMap.set(y, []);
            }
            linesMap.get(y)!.push(item);
          });

          // Sort Y coordinates descending (PDF coordinates are bottom-up)
          const sortedY = Array.from(linesMap.keys()).sort((a, b) => b - a);
          
          let currentRecord: any = null;

          sortedY.forEach(y => {
            const lineItems = linesMap.get(y)!;
            // Sort by X coordinate
            lineItems.sort((a, b) => a.transform[4] - b.transform[4]);
            
            // Join items with enough spacing
            let lineText = '';
            let lastX = -1;
            lineItems.forEach(item => {
              if (lastX !== -1 && item.transform[4] - lastX > 10) {
                lineText += ' | '; // Add separator
              } else if (lastX !== -1) {
                lineText += ' ';
              }
              lineText += item.str;
              lastX = item.transform[4] + item.width;
            });
            
            // Basic heuristic to find data rows (starts with a number like 000197 or 197)
            const parts = lineText.split(' | ').map(p => p.trim()).filter(Boolean);
            
            if (parts.length > 0 && /^\d+$/.test(parts[0])) {
              // This looks like the start of a record row
              if (currentRecord) {
                data.push(currentRecord);
              }
              
              currentRecord = {
                'CTe/NFS': parts[0],
                'Emissão': parts[1] || '',
                'Remetente / Origem': parts[2] || '',
                'Valor frete': parts.find(p => p.includes(',')) || '', // Rough guess for numeric values
              };
              
              // Try to map the rest of the numeric values based on position
              const numericParts = parts.filter(p => /^-?\d{1,3}(\.\d{3})*,\d{2}/.test(p) || /^-?\d+,\d+/.test(p));
              
              // ATUA format heuristic: Lots of numeric parts, and usually has "CT" or "NFS"
              if (lineText.includes(' CT ') || lineText.includes(' NFS ')) {
                // ATUA format: Peso, Frete Empr., Frete Mot., Tarifa Empr., Tarifa Mot., Dif. Fr., Adto. Mot., Vl. Outros Desc., ICMS ISSQN, Ped., Empr.Corretor, Vl. Base, Vl. Comissão, Fed. Imp., Outros Custos, Result.
                if (numericParts.length >= 3) {
                  // Usually the first numeric part is Peso, second is Frete Empr., third is Frete Mot.
                  currentRecord['Peso / Kg'] = numericParts[0];
                  currentRecord['Frete Empr.'] = numericParts[1];
                  currentRecord['Frete Mot.'] = numericParts[2];
                  
                  // Try to find the result/margem (usually the last numeric part before the city)
                  if (numericParts.length >= 10) {
                     currentRecord['Líquido'] = numericParts[numericParts.length - 1];
                  }
                }
              } else if (numericParts.length >= 8) {
                // GW format
                currentRecord['Valor frete'] = numericParts[0];
                currentRecord['ICMS/ISS'] = numericParts[1];
                currentRecord['Frete tab.'] = numericParts[2];
                currentRecord['PIS'] = numericParts[3];
                currentRecord['COFINS'] = numericParts[4];
                currentRecord['IR'] = numericParts[5];
                currentRecord['CSSL'] = numericParts[6];
                currentRecord['Vl Carreteiro'] = numericParts[7];
              }
              
            } else if (currentRecord && parts.length > 0) {
              // This might be the second line of a record (e.g., GOIATUBA-GO SANTOS-SP)
              if (parts.length >= 2 && !parts[0].includes('TOTAL') && !parts[0].includes('BTG PACTUAL')) {
                currentRecord['Remetente / Origem'] += ' ' + parts[0];
                currentRecord['Destinatário / Destino'] = parts[1];
              } else if (parts[0].includes('BTG PACTUAL')) {
                 currentRecord['Destinatário / Destino'] = parts[0];
                 const numericParts = parts.filter(p => /^-?\d{1,3}(\.\d{3})*,\d{2}/.test(p) || /^-?\d+,\d+/.test(p) || p.includes('%'));
                 if(numericParts.length >= 3) {
                    currentRecord['Peso / Kg'] = numericParts[0];
                    currentRecord['Líquido'] = numericParts[1];
                    currentRecord['(%)'] = numericParts[2];
                 }
              }
            }
          });
          
          if (currentRecord) {
            data.push(currentRecord);
          }
        }
        
        resolve({ headers, data });
      } catch (error) {
        console.error('Error parsing PDF:', error);
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const parseCSV = (file: File): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawHeaders = (results.meta.fields || []) as string[];
        const headers = Array.from(new Set(rawHeaders.filter(Boolean)));
        resolve({
          headers,
          data: results.data as Record<string, unknown>[],
        });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const parseExcel = (file: File): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          resolve({ headers: [], data: [] });
          return;
        }

        const rawHeaders = jsonData[0] as string[];
        const headers = Array.from(new Set(rawHeaders.filter(Boolean)));
        const rows = jsonData.slice(1) as unknown[][];
        
        const formattedData = rows.map(row => {
          const obj: Record<string, unknown> = {};
          rawHeaders.forEach((header, index) => {
            if (header) {
              obj[header] = row[index];
            }
          });
          return obj;
        });

        resolve({ headers, data: formattedData });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const parseFile = async (file: File): Promise<ParseResult> => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension === 'csv') {
    return parseCSV(file);
  } else if (extension === 'xlsx' || extension === 'xls') {
    return parseExcel(file);
  } else if (extension === 'pdf') {
    return parsePDF(file);
  } else {
    throw new Error('Formato de arquivo não suportado. Use CSV, Excel ou PDF.');
  }
};
