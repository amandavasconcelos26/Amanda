/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuditSummary } from '@/src/types/audit';
import { ShieldCheck, AlertCircle, XCircle, CheckCircle2 } from 'lucide-react';

interface VariableCheckSummaryProps {
  summary: AuditSummary;
}

export function VariableCheckSummary({ summary }: VariableCheckSummaryProps) {
  const stats = [
    {
      label: 'Registros Analisados',
      value: summary.totalRecords,
      icon: ShieldCheck,
      color: 'text-blue-600',
    },
    {
      label: 'Inconsistências',
      value: summary.totalIssues,
      icon: AlertCircle,
      color: 'text-amber-600',
    },
    {
      label: 'Erros Críticos',
      value: summary.totalErrors,
      icon: XCircle,
      color: 'text-rose-600',
    },
    {
      label: 'Conformidade',
      value: `${summary.compliancePercentage.toFixed(1)}%`,
      icon: CheckCircle2,
      color: summary.compliancePercentage > 90 ? 'text-emerald-600' : 'text-amber-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
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
