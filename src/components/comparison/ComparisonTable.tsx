/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ColumnDef } from '@tanstack/react-table';
import { ComparisonIssue } from '@/src/types/audit';
import { DataTable } from '@/src/components/common/DataTable';
import { StatusBadge } from '@/src/components/common/StatusBadge';

interface ComparisonTableProps {
  issues: ComparisonIssue[];
}

export function ComparisonTable({ issues }: ComparisonTableProps) {
  const columns: ColumnDef<ComparisonIssue>[] = [
    {
      accessorKey: 'cte',
      header: 'CTE',
      cell: ({ row }) => <span className="font-mono font-medium">{row.original.cte}</span>,
    },
    {
      accessorKey: 'field',
      header: 'Campo',
      cell: ({ row }) => <span className="capitalize">{row.original.field}</span>,
    },
    {
      accessorKey: 'valueA',
      header: 'Valor GW Sistemas',
      cell: ({ row }) => (
        <span className="text-muted-foreground truncate max-w-[150px] inline-block">
          {String(row.original.valueA || '-')}
        </span>
      ),
    },
    {
      accessorKey: 'valueB',
      header: 'Valor ATUA',
      cell: ({ row }) => (
        <span className="text-muted-foreground truncate max-w-[150px] inline-block">
          {String(row.original.valueB || '-')}
        </span>
      ),
    },
    {
      accessorKey: 'severity',
      header: 'Severidade',
      cell: ({ row }) => <StatusBadge status={row.original.severity} />,
    },
    {
      accessorKey: 'message',
      header: 'Observação',
      cell: ({ row }) => <span className="text-sm">{row.original.message}</span>,
    },
  ];

  return (
    <DataTable 
      columns={columns} 
      data={issues} 
      searchKey="cte" 
      searchPlaceholder="Buscar por CTE..." 
    />
  );
}
