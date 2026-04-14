/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/src/components/layout/AppLayout';
import { PageTitle } from '@/src/components/common/PageTitle';
import { SummaryCards } from '@/src/components/dashboard/SummaryCards';
import { InconsistencyChart } from '@/src/components/dashboard/InconsistencyChart';
import { TopIssueTypes } from '@/src/components/dashboard/TopIssueTypes';
import { FileUploadCard } from '@/src/components/upload/FileUploadCard';
import { ColumnMapper } from '@/src/components/upload/ColumnMapper';
import { VariableCheckSummary } from '@/src/components/variable-check/VariableCheckSummary';
import { VariableCheckTable } from '@/src/components/variable-check/VariableCheckTable';
import { VariableCheckFilters } from '@/src/components/variable-check/VariableCheckFilters';
import { ComparisonSummary } from '@/src/components/comparison/ComparisonSummary';
import { ComparisonTable } from '@/src/components/comparison/ComparisonTable';
import { EmptyState } from '@/src/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuditStore } from '@/src/store/auditStore';
import { parseFile } from '@/src/services/fileParserService';
import { mapRawToAuditRecord, suggestMapping } from '@/src/utils/mappers';
import { validateRecords } from '@/src/services/variableValidationService';
import { compareReports } from '@/src/services/comparisonService';
import { exportToCSV, exportToExcel, exportSummaryPDF } from '@/src/services/exportService';
import { 
  Download, 
  Play, 
  RotateCcw, 
  FileSpreadsheet, 
  FileJson, 
  FileText as FilePdf,
  LayoutDashboard,
  ShieldCheck,
  GitCompare,
  FileUp
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { AuditSummary, ColumnMapping } from '@/src/types/audit';

export default function HomePage() {
  const { 
    reportA, 
    reportB, 
    validationIssues, 
    comparisonIssues, 
    summary,
    setReportA,
    setReportB,
    setValidationIssues,
    setComparisonIssues,
    setSummary,
    resetAudit
  } = useAuditStore();

  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [headersA, setHeadersA] = useState<string[]>([]);
  const [headersB, setHeadersB] = useState<string[]>([]);
  const [rawA, setRawA] = useState<Record<string, unknown>[]>([]);
  const [rawB, setRawB] = useState<Record<string, unknown>[]>([]);
  const [showMapperA, setShowMapperA] = useState(false);
  const [showMapperB, setShowMapperB] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [issueTypeFilter, setIssueTypeFilter] = useState('all');

  const handleFileA = async (file: File) => {
    setFileA(file);
    const result = await parseFile(file);
    setHeadersA(result.headers);
    setRawA(result.data);
    
    const mapping = suggestMapping(result.headers);
    const records = result.data.map(raw => mapRawToAuditRecord(raw, mapping, 'A'));
    setReportA(records);
    setShowMapperA(true);
  };

  const handleFileB = async (file: File) => {
    setFileB(file);
    const result = await parseFile(file);
    setHeadersB(result.headers);
    setRawB(result.data);
    
    const mapping = suggestMapping(result.headers);
    const records = result.data.map(raw => mapRawToAuditRecord(raw, mapping, 'B'));
    setReportB(records);
    setShowMapperB(true);
  };

  const handleMappingA = (mapping: ColumnMapping) => {
    const records = rawA.map(raw => mapRawToAuditRecord(raw, mapping, 'A'));
    setReportA(records);
    setShowMapperA(false);
  };

  const handleMappingB = (mapping: ColumnMapping) => {
    const records = rawB.map(raw => mapRawToAuditRecord(raw, mapping, 'B'));
    setReportB(records);
    setShowMapperB(false);
  };

  const runAudit = useCallback(() => {
    const allRecords = [...reportA, ...reportB];
    const vIssues = validateRecords(allRecords);
    const cIssues = compareReports(reportA, reportB);
    
    setValidationIssues(vIssues);
    setComparisonIssues(cIssues);
    
    const totalIssues = vIssues.length + cIssues.length;
    const totalErrors = vIssues.filter(i => i.severity === 'error').length + cIssues.filter(i => i.severity === 'error').length;
    const totalWarnings = vIssues.filter(i => i.severity === 'warning').length + cIssues.filter(i => i.severity === 'warning').length;
    
    const totalValidated = allRecords.length * 10; // Approx 10 variables per record
    const compliance = totalValidated > 0 ? Math.max(0, 100 - (totalIssues / totalValidated) * 100) : 100;

    const sumFreteEmpresaA = reportA.reduce((acc, curr) => acc + (curr.freteEmpresa || 0), 0);
    const sumFreteEmpresaB = reportB.reduce((acc, curr) => acc + (curr.freteEmpresa || 0), 0);

    const newSummary: AuditSummary = {
      totalRecords: allRecords.length,
      totalValidatedVariables: totalValidated,
      totalIssues,
      totalWarnings,
      totalErrors,
      compliancePercentage: compliance,
      sumFreteEmpresaA,
      sumFreteEmpresaB,
    };
    
    setSummary(newSummary);
  }, [reportA, reportB, setValidationIssues, setComparisonIssues, setSummary]);

  useEffect(() => {
    if (reportA.length > 0 || reportB.length > 0) {
      runAudit();
    }
  }, [reportA, reportB, runAudit]);

  const filteredValidationIssues = validationIssues.filter(issue => {
    const matchesSearch = !searchTerm || 
      (issue.cte?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (issue.message.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSeverity = severityFilter === 'all' || issue.severity === severityFilter;
    const matchesType = issueTypeFilter === 'all' || issue.issueType === issueTypeFilter;
    
    return matchesSearch && matchesSeverity && matchesType;
  });

  const isAuditReady = reportA.length > 0 || reportB.length > 0;

  return (
    <AppLayout>
      <PageTitle 
        title="Auditoria de Fretes" 
        subtitle="Validação e comparação profissional de relatórios logísticos"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
              resetAudit();
              setFileA(null);
              setFileB(null);
            }}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetar
            </Button>
            <Button onClick={runAudit}>
              <Play className="w-4 h-4 mr-2" />
              Executar Auditoria
            </Button>
            {summary.totalRecords > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="secondary" />}>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => exportToCSV(validationIssues, 'inconsistencias')}>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    CSV (Inconsistências)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToExcel(validationIssues, 'inconsistencias')}>
                    <FileJson className="w-4 h-4 mr-2" />
                    Excel (Inconsistências)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportSummaryPDF(summary, validationIssues, comparisonIssues)}>
                    <FilePdf className="w-4 h-4 mr-2" />
                    PDF (Resumo Executivo)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        }
      />

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="dashboard" className="gap-2">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="import" className="gap-2">
            <FileUp className="w-4 h-4" />
            Importação
          </TabsTrigger>
          <TabsTrigger value="validation" className="gap-2">
            <ShieldCheck className="w-4 h-4" />
            Validação
          </TabsTrigger>
          <TabsTrigger value="comparison" className="gap-2">
            <GitCompare className="w-4 h-4" />
            Comparação
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {summary.totalRecords > 0 ? (
            <>
              <SummaryCards summary={summary} />
              <div className="grid gap-6 md:grid-cols-2">
                <InconsistencyChart issues={validationIssues} />
                <TopIssueTypes issues={validationIssues} />
              </div>
            </>
          ) : (
            <EmptyState 
              title="Nenhuma auditoria executada" 
              description="Importe seus relatórios e clique em 'Executar Auditoria' para ver os indicadores."
            />
          )}
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FileUploadCard 
              title="GW Sistemas" 
              description="Base principal para auditoria"
              onFileSelect={handleFileA}
              onFileRemove={() => {
                setFileA(null);
                setReportA([]);
              }}
              selectedFile={fileA}
            />
            <FileUploadCard 
              title="ATUA" 
              description="Base de comparação ou conferência"
              onFileSelect={handleFileB}
              onFileRemove={() => {
                setFileB(null);
                setReportB([]);
              }}
              selectedFile={fileB}
            />
          </div>

          {showMapperA && (
            <ColumnMapper 
              headers={headersA} 
              reportName="GW Sistemas" 
              onMappingComplete={handleMappingA} 
            />
          )}

          {showMapperB && (
            <ColumnMapper 
              headers={headersB} 
              reportName="ATUA" 
              onMappingComplete={handleMappingB} 
            />
          )}
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          {validationIssues.length > 0 ? (
            <>
              <VariableCheckSummary summary={summary} />
              <VariableCheckFilters 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                severityFilter={severityFilter}
                onSeverityChange={setSeverityFilter}
                issueTypeFilter={issueTypeFilter}
                onIssueTypeChange={setIssueTypeFilter}
                onClear={() => {
                  setSearchTerm('');
                  setSeverityFilter('all');
                  setIssueTypeFilter('all');
                }}
              />
              <VariableCheckTable issues={filteredValidationIssues} />
            </>
          ) : (
            <EmptyState 
              title="Sem inconsistências de variáveis" 
              description="Após importar os dados e executar a auditoria, as inconsistências de variáveis aparecerão aqui."
            />
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          {comparisonIssues.length > 0 ? (
            <>
              <ComparisonSummary issues={comparisonIssues} />
              <ComparisonTable issues={comparisonIssues} />
            </>
          ) : (
            <EmptyState 
              title="Sem divergências entre relatórios" 
              description="Importe dois relatórios para comparar os dados por CTE e identificar divergências."
              icon={<GitCompare className="w-8 h-8 text-muted-foreground" />}
            />
          )}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
