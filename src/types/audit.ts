/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Severity = 'ok' | 'warning' | 'error';

export type IssueType = 
  | 'missing_value' 
  | 'null_value' 
  | 'invalid_format' 
  | 'duplicate' 
  | 'negative_value' 
  | 'invalid_document' 
  | 'invalid_plate' 
  | 'invalid_date' 
  | 'date_conflict' 
  | 'outlier_weight' 
  | 'outlier_freight' 
  | 'business_rule' 
  | 'missing_required_field' 
  | 'difference_between_reports' 
  | 'missing_in_report_a' 
  | 'missing_in_report_b';

export interface AuditRecord {
  id: string;
  cte?: string;
  dataEmissao?: string;
  valorCarreteiro?: number | null;
  freteEmpresa?: number | null;
  freteMotorista?: number | null;
  freteTabela?: number | null;
  margem?: number | null;
  source?: 'A' | 'B';
  raw?: Record<string, unknown>;
}

export interface ValidationIssue {
  id: string;
  recordId: string;
  cte?: string;
  field: keyof AuditRecord | string;
  currentValue: unknown;
  expectedValue?: unknown;
  source?: 'A' | 'B' | 'both';
  severity: Severity;
  issueType: IssueType;
  message: string;
  reviewed: boolean;
  note?: string;
}

export interface ComparisonIssue {
  id: string;
  cte: string;
  field: keyof AuditRecord | string;
  valueA: unknown;
  valueB: unknown;
  severity: Severity;
  issueType: IssueType;
  message: string;
}

export interface AuditSummary {
  totalRecords: number;
  totalValidatedVariables: number;
  totalIssues: number;
  totalWarnings: number;
  totalErrors: number;
  compliancePercentage: number;
  sumFreteEmpresaA?: number;
  sumFreteEmpresaB?: number;
}

export interface ColumnMapping {
  [key: string]: keyof AuditRecord;
}
