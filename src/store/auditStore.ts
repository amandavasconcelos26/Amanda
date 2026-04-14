/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { 
  AuditRecord, 
  ValidationIssue, 
  ComparisonIssue, 
  AuditSummary 
} from '@/src/types/audit';

interface AuditState {
  reportA: AuditRecord[];
  reportB: AuditRecord[];
  validationIssues: ValidationIssue[];
  comparisonIssues: ComparisonIssue[];
  summary: AuditSummary;
  isLoading: boolean;
  
  // Actions
  setReportA: (records: AuditRecord[]) => void;
  setReportB: (records: AuditRecord[]) => void;
  setValidationIssues: (issues: ValidationIssue[]) => void;
  setComparisonIssues: (issues: ComparisonIssue[]) => void;
  setSummary: (summary: AuditSummary) => void;
  setLoading: (isLoading: boolean) => void;
  
  updateValidationIssue: (id: string, updates: Partial<ValidationIssue>) => void;
  resetAudit: () => void;
}

const initialSummary: AuditSummary = {
  totalRecords: 0,
  totalValidatedVariables: 0,
  totalIssues: 0,
  totalWarnings: 0,
  totalErrors: 0,
  compliancePercentage: 100,
};

export const useAuditStore = create<AuditState>((set) => ({
  reportA: [],
  reportB: [],
  validationIssues: [],
  comparisonIssues: [],
  summary: initialSummary,
  isLoading: false,

  setReportA: (records) => set({ reportA: records }),
  setReportB: (records) => set({ reportB: records }),
  setValidationIssues: (issues) => set({ validationIssues: issues }),
  setComparisonIssues: (issues) => set({ comparisonIssues: issues }),
  setSummary: (summary) => set({ summary }),
  setLoading: (isLoading) => set({ isLoading }),

  updateValidationIssue: (id, updates) => set((state) => ({
    validationIssues: state.validationIssues.map((issue) => 
      issue.id === id ? { ...issue, ...updates } : issue
    ),
  })),

  resetAudit: () => set({
    reportA: [],
    reportB: [],
    validationIssues: [],
    comparisonIssues: [],
    summary: initialSummary,
    isLoading: false,
  }),
}));
