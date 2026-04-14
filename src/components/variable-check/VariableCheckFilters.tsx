/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

interface VariableCheckFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  severityFilter: string;
  onSeverityChange: (val: string) => void;
  issueTypeFilter: string;
  onIssueTypeChange: (val: string) => void;
  onClear: () => void;
}

export function VariableCheckFilters({
  searchTerm,
  onSearchChange,
  severityFilter,
  onSeverityChange,
  issueTypeFilter,
  onIssueTypeChange,
  onClear
}: VariableCheckFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 mb-6 border rounded-lg bg-card">
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por CTE ou mensagem..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="w-[180px]">
        <Select value={severityFilter} onValueChange={onSeverityChange}>
          <SelectTrigger>
            <SelectValue placeholder="Severidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Severidades</SelectItem>
            <SelectItem value="error">Crítico (Error)</SelectItem>
            <SelectItem value="warning">Alerta (Warning)</SelectItem>
            <SelectItem value="ok">OK</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-[200px]">
        <Select value={issueTypeFilter} onValueChange={onIssueTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de Problema" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="missing_required_field">Campo Obrigatório</SelectItem>
            <SelectItem value="invalid_document">Documento Inválido</SelectItem>
            <SelectItem value="invalid_plate">Placa Inválida</SelectItem>
            <SelectItem value="duplicate">Duplicidade</SelectItem>
            <SelectItem value="outlier_freight">Frete Atípico</SelectItem>
            <SelectItem value="business_rule">Regra de Negócio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
        <X className="w-4 h-4 mr-2" />
        Limpar Filtros
      </Button>
    </div>
  );
}
