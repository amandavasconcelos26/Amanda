/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuditRecord, ColumnMapping } from '@/src/types/audit';

export const mapRawToAuditRecord = (
  raw: Record<string, unknown>, 
  mapping: ColumnMapping, 
  source: 'A' | 'B'
): AuditRecord => {
  const record: AuditRecord = {
    id: crypto.randomUUID(),
    source,
    raw,
  };

  Object.entries(mapping).forEach(([fileColumn, auditField]) => {
    const value = raw[fileColumn];
    
    if (['valorCarreteiro', 'freteEmpresa', 'freteMotorista', 'freteTabela', 'margem'].includes(auditField)) {
      const numValue = typeof value === 'string' 
        ? parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')) 
        : Number(value);
      (record as any)[auditField] = isNaN(numValue) ? null : numValue;
    } else {
      (record as any)[auditField] = value as string;
    }
  });

  return record;
};

export const suggestMapping = (headers: string[]): ColumnMapping => {
  const mapping: ColumnMapping = {};
  
  const keywords: Record<keyof AuditRecord, string[]> = {
    id: ['id', 'uuid', 'identificador'],
    cte: ['cte', 'conhecimento', 'chave', 'cte/nfs'],
    dataEmissao: ['emissao', 'data_emissao', 'data'],
    valorCarreteiro: ['carreteiro', 'vl carreteiro', 'valor carreteiro', 'vl. carreteiro'],
    freteEmpresa: ['frete empresa', 'empresa', 'valor frete', 'frete empr.', 'frete empr'],
    freteMotorista: ['frete motorista', 'motorista', 'frete mot.', 'frete mot'],
    freteTabela: ['frete tab', 'tabela', 'frete tab.'],
    margem: ['margem', 'líquido', 'liquido', 'result.'],
    source: [],
    raw: []
  };

  headers.forEach(header => {
    const lowerHeader = header.toLowerCase();
    
    for (const [field, words] of Object.entries(keywords)) {
      if (words.some(word => lowerHeader.includes(word))) {
        mapping[header] = field as keyof AuditRecord;
        break;
      }
    }
  });

  return mapping;
};
