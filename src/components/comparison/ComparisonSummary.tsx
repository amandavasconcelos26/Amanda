/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComparisonIssue } from '@/src/types/audit';
import { GitCompare, AlertCircle, XCircle, CheckCircle2 } from 'lucide-react';

interface ComparisonSummaryProps {
  issues: ComparisonIssue[];
}

export function ComparisonSummary({ issues }: ComparisonSummaryProps) {
  const stats = [
    {
      label: 'Divergências Detectadas',
      value: issues.length,
      icon: GitCompare,
      color: 'text-blue-600',
    },
    {
      label: 'Motorista vs Carreteiro',
      value: issues.filter(i => i.field === 'freteMotorista').length,
      icon: AlertCircle,
      color: 'text-amber-600',
    },
    {
      label: 'Empresa vs Tabela',
      value: issues.filter(i => i.field === 'freteEmpresa').length,
      icon: AlertCircle,
      color: 'text-rose-600',
    },
    {
      label: 'Divergências de Margem',
      value: issues.filter(i => i.field === 'margem').length,
      icon: AlertCircle,
      color: 'text-indigo-600',
    },
    {
      label: 'CTE Ausentes',
      value: issues.filter(i => i.field === 'cte').length,
      icon: XCircle,
      color: 'text-red-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-5 mb-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-full bg-muted`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
