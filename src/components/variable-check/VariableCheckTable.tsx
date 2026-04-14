/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ValidationIssue } from '@/src/types/audit';
import { DataTable } from '@/src/components/common/DataTable';
import { StatusBadge } from '@/src/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, MessageSquare } from 'lucide-react';
import { useAuditStore } from '@/src/store/auditStore';
import { VariableCheckDetailsDrawer } from './VariableCheckDetailsDrawer';

interface VariableCheckTableProps {
  issues: ValidationIssue[];
}

export function VariableCheckTable({ issues }: VariableCheckTableProps) {
  const [selectedIssue, setSelectedIssue] = useState<ValidationIssue | null>(null);
  const updateValidationIssue = useAuditStore(state => state.updateValidationIssue);

  const columns: ColumnDef<ValidationIssue>[] = [
    {
      accessorKey: 'cte',
      header: 'CTE',
      cell: ({ row }) => <span className="font-mono font-medium">{row.original.cte || '-'}</span>,
    },
    {
      accessorKey: 'field',
      header: 'Variável',
      cell: ({ row }) => <span className="capitalize">{row.original.field}</span>,
    },
    {
      accessorKey: 'currentValue',
      header: 'Valor Encontrado',
      cell: ({ row }) => <span className="text-muted-foreground truncate max-w-[150px] inline-block">{String(row.original.currentValue || '-')}</span>,
    },
    {
      accessorKey: 'severity',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.severity} />,
    },
    {
      accessorKey: 'message',
      header: 'Mensagem',
      cell: ({ row }) => <span className="text-sm">{row.original.message}</span>,
    },
    {
      accessorKey: 'reviewed',
      header: 'Revisado',
      cell: ({ row }) => (
        row.original.reviewed ? (
          <CheckCircle className="w-5 h-5 text-emerald-500" />
        ) : (
          <div className="w-5 h-5 border-2 rounded-full border-muted-foreground/20" />
        )
      ),
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSelectedIssue(row.original)}
            title="Ver detalhes"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => updateValidationIssue(row.original.id, { reviewed: !row.original.reviewed })}
            className={row.original.reviewed ? "text-emerald-600" : "text-muted-foreground"}
            title={row.original.reviewed ? "Desmarcar como revisado" : "Marcar como revisado"}
          >
            <CheckCircle className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable 
        columns={columns} 
        data={issues} 
        searchKey="cte" 
        searchPlaceholder="Buscar por CTE..." 
      />
      
      {selectedIssue && (
        <VariableCheckDetailsDrawer 
          issue={selectedIssue} 
          isOpen={!!selectedIssue} 
          onClose={() => setSelectedIssue(null)} 
        />
      )}
    </div>
  );
}
