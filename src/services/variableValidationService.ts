/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuditRecord, ValidationIssue, Severity, IssueType } from '@/src/types/audit';
import { isValidCpf, isValidCnpj, isValidPlate, isValidDate } from '@/src/utils/validators';
import { isOutlier } from '@/src/utils/statistics';

export const validateRecords = (records: AuditRecord[]): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  
  // Collect values for outlier detection
  const valoresCarreteiro = records.map(r => r.valorCarreteiro).filter((v): v is number => v !== null && v !== undefined);
  const fretesEmpresa = records.map(r => r.freteEmpresa).filter((f): f is number => f !== null && f !== undefined);
  const fretesMotorista = records.map(r => r.freteMotorista).filter((f): f is number => f !== null && f !== undefined);
  const margens = records.map(r => r.margem).filter((m): m is number => m !== null && m !== undefined);
  
  // Track duplicates
  const cteMap = new Map<string, number>();

  records.forEach((record, index) => {
    const recordId = record.id;
    const cte = record.cte;
    const source = record.source;

    const addIssue = (
      field: keyof AuditRecord | string,
      currentValue: unknown,
      severity: Severity,
      issueType: IssueType,
      message: string,
      expectedValue?: unknown
    ) => {
      issues.push({
        id: crypto.randomUUID(),
        recordId,
        cte,
        field,
        currentValue,
        expectedValue,
        source,
        severity,
        issueType,
        message,
        reviewed: false,
      });
    };

    // 1. Required Fields
    const requiredFields: (keyof AuditRecord)[] = ['cte', 'dataEmissao', 'valorCarreteiro', 'freteEmpresa', 'freteMotorista', 'margem'];
    requiredFields.forEach(field => {
      const value = record[field];
      if (value === undefined || value === null || value === '') {
        addIssue(field, value, 'error', 'missing_required_field', `Campo obrigatório '${field}' ausente.`);
      }
    });

    // 2. CTE Validation
    if (cte) {
      cteMap.set(cte, (cteMap.get(cte) || 0) + 1);
      if (cteMap.get(cte)! > 1) {
        addIssue('cte', cte, 'warning', 'duplicate', `CTE duplicado: ${cte}`);
      }
      if (cte.length < 5) {
        addIssue('cte', cte, 'warning', 'invalid_format', `CTE suspeito (muito curto): ${cte}`);
      }
    }

    // 3. Date Validation
    if (record.dataEmissao) {
      if (!isValidDate(record.dataEmissao)) {
        addIssue('dataEmissao', record.dataEmissao, 'error', 'invalid_date', 'Data de emissão inválida.');
      }
    }

    // 4. Values Validation
    const checkValue = (field: keyof AuditRecord, value: number | null | undefined, valuesArray: number[], name: string) => {
      if (value !== null && value !== undefined) {
        if (value < 0 && field !== 'margem') { // Margem pode ser negativa
          addIssue(field, value, 'error', 'negative_value', `Valor de ${name} negativo.`);
        } else if (isOutlier(value, valuesArray)) {
          addIssue(field, value, 'warning', 'outlier_freight', `Valor de ${name} muito fora da média.`);
        }
      }
    };

    checkValue('valorCarreteiro', record.valorCarreteiro, valoresCarreteiro, 'Valor Carreteiro');
    checkValue('freteEmpresa', record.freteEmpresa, fretesEmpresa, 'Frete Empresa');
    checkValue('freteMotorista', record.freteMotorista, fretesMotorista, 'Frete Motorista');
    checkValue('margem', record.margem, margens, 'Margem');

  });

  return issues;
};
