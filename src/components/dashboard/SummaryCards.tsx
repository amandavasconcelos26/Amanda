/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuditSummary } from '@/src/types/audit';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Activity,
  Percent
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardsProps {
  summary: AuditSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total de Registros',
      value: summary.totalRecords,
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Variáveis Validadas',
      value: summary.totalValidatedVariables,
      icon: Activity,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Inconsistências',
      value: summary.totalIssues,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Erros Críticos',
      value: summary.totalErrors,
      icon: XCircle,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      title: 'Soma Frete GW',
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.sumFreteEmpresaA || 0),
      icon: Activity,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Soma Frete ATUA',
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.sumFreteEmpresaB || 0),
      icon: Activity,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title} className="border-none shadow-sm bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={cn("p-2 rounded-lg", card.bg)}>
              <card.icon className={cn("w-4 h-4", card.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
