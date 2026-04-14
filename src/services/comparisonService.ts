/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuditRecord, ComparisonIssue, Severity, IssueType } from '@/src/types/audit';

export const compareReports = (reportA: AuditRecord[], reportB: AuditRecord[]): ComparisonIssue[] => {
  const issues: ComparisonIssue[] = [];
  
  const mapA = new Map<string, AuditRecord>();
  const mapB = new Map<string, AuditRecord>();

  reportA.forEach(r => { if (r.cte) mapA.set(r.cte, r); });
  reportB.forEach(r => { if (r.cte) mapB.set(r.cte, r); });

  const allCtes = new Set([...mapA.keys(), ...mapB.keys()]);

  allCtes.forEach(cte => {
    const recordA = mapA.get(cte);
    const recordB = mapB.get(cte);

    const addIssue = (
      field: keyof AuditRecord | string,
      valueA: unknown,
      valueB: unknown,
      severity: Severity,
      issueType: IssueType,
      message: string
    ) => {
      issues.push({
        id: crypto.randomUUID(),
        cte,
        field,
        valueA,
        valueB,
        severity,
        issueType,
        message,
      });
    };

    if (!recordA) {
      addIssue('cte', null, cte, 'warning', 'missing_in_report_a', 'Registro presente apenas no ATUA.');
      return;
    }

    if (!recordB) {
      addIssue('cte', cte, null, 'warning', 'missing_in_report_b', 'Registro presente apenas no GW Sistemas.');
      return;
    }

    // Compare fields
    // 1. Frete Motorista (A) vs Valor Carreteiro (B)
    const motA = recordA.freteMotorista ?? recordA.valorCarreteiro;
    const motB = recordB.valorCarreteiro ?? recordB.freteMotorista;
    if (motA !== undefined && motA !== null && motB !== undefined && motB !== null) {
      if (Math.abs(motA - motB) > 0.01) {
        addIssue('freteMotorista', motA, motB, 'error', 'difference_between_reports', `Divergência Motorista/Carreteiro: ${motA} vs ${motB}`);
      }
    }

    // 2. Frete Tabela (B) vs Frete Empresa (A)
    const empA = recordA.freteEmpresa ?? recordA.freteTabela;
    const empB = recordB.freteTabela ?? recordB.freteEmpresa;
    if (empA !== undefined && empA !== null && empB !== undefined && empB !== null) {
      if (Math.abs(empA - empB) > 0.01) {
        addIssue('freteEmpresa', empA, empB, 'error', 'difference_between_reports', `Divergência Empresa/Tabela: ${empA} vs ${empB}`);
      }
    }

    // 3. Margem
    if (recordA.margem !== undefined && recordA.margem !== null && recordB.margem !== undefined && recordB.margem !== null) {
      if (Math.abs(recordA.margem - recordB.margem) > 0.01) {
        addIssue('margem', recordA.margem, recordB.margem, 'error', 'difference_between_reports', `Divergência na Margem: ${recordA.margem} vs ${recordB.margem}`);
      }
    }
  });

  return issues;
};
