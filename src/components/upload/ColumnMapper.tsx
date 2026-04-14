/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AuditRecord, ColumnMapping } from '@/src/types/audit';
import { suggestMapping } from '@/src/utils/mappers';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ColumnMapperProps {
  headers: string[];
  onMappingComplete: (mapping: ColumnMapping) => void;
  reportName: string;
}

const AUDIT_FIELDS: { label: string; value: keyof AuditRecord; required?: boolean }[] = [
  { label: 'Data de Emissão', value: 'dataEmissao', required: true },
  { label: 'CTE / Chave', value: 'cte', required: true },
  { label: 'Valor Carreteiro', value: 'valorCarreteiro' },
  { label: 'Frete Empresa', value: 'freteEmpresa' },
  { label: 'Frete Motorista', value: 'freteMotorista' },
  { label: 'Frete Tabela', value: 'freteTabela' },
  { label: 'Margem', value: 'margem' },
];

export function ColumnMapper({ headers, onMappingComplete, reportName }: ColumnMapperProps) {
  const [mapping, setMapping] = useState<ColumnMapping>({});

  useEffect(() => {
    const suggested = suggestMapping(headers);
    setMapping(suggested);
  }, [headers]);

  const handleMap = (fileColumn: string, auditField: keyof AuditRecord) => {
    setMapping(prev => {
      const newMapping = { ...prev };
      // Remove any existing mapping to this audit field
      Object.keys(newMapping).forEach(key => {
        if (newMapping[key] === auditField) delete newMapping[key];
      });
      newMapping[fileColumn] = auditField;
      return newMapping;
    });
  };

  const isComplete = AUDIT_FIELDS.filter(f => f.required).every(f => 
    Object.values(mapping).includes(f.value)
  );

  return (
    <Card className="border-primary/20 shadow-md">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mapeamento Automático - {reportName}</CardTitle>
            <CardDescription>O sistema mapeou as colunas automaticamente. Revise e ajuste se necessário.</CardDescription>
          </div>
          {isComplete ? (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5" />
              Pronto para processar
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
              <AlertCircle className="w-5 h-5" />
              Campos obrigatórios pendentes
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {AUDIT_FIELDS.map((field) => {
            const mappedColumn = Object.keys(mapping).find(key => mapping[key] === field.value);
            
            return (
              <div key={field.value} className="space-y-2">
                <Label className="flex items-center gap-1">
                  {field.label}
                  {field.required && <span className="text-rose-500">*</span>}
                </Label>
                <Select 
                  value={mappedColumn || "none"} 
                  onValueChange={(val) => val !== "none" && handleMap(val, field.value)}
                >
                  <SelectTrigger className={cn(
                    "bg-background",
                    !mappedColumn && field.required ? "border-rose-300 ring-rose-100" : ""
                  )}>
                    <SelectValue placeholder="Selecione uma coluna..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Não mapeado</SelectItem>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>{header}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t bg-muted/10 pt-6">
        <Button 
          onClick={() => onMappingComplete(mapping)} 
          disabled={!isComplete}
          className="px-8"
        >
          Confirmar e Ocultar
        </Button>
      </CardFooter>
    </Card>
  );
}
