/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ValidationIssue } from '@/src/types/audit';

interface TopIssueTypesProps {
  issues: ValidationIssue[];
}

const ISSUE_TYPE_LABELS: Record<string, string> = {
  missing_value: 'Valor Ausente',
  null_value: 'Valor Nulo',
  invalid_format: 'Formato Inválido',
  duplicate: 'Duplicidade',
  negative_value: 'Valor Negativo',
  invalid_document: 'Doc. Inválido',
  invalid_plate: 'Placa Inválida',
  invalid_date: 'Data Inválida',
  date_conflict: 'Conflito de Data',
  outlier_weight: 'Peso Atípico',
  outlier_freight: 'Frete Atípico',
  business_rule: 'Regra de Negócio',
  missing_required_field: 'Campo Obrigatório',
};

export function TopIssueTypes({ issues }: TopIssueTypesProps) {
  const counts: Record<string, number> = {};
  issues.forEach(issue => {
    const label = ISSUE_TYPE_LABELS[issue.issueType] || issue.issueType;
    counts[label] = (counts[label] || 0) + 1;
  });

  const data = Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  if (data.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Principais Tipos de Inconsistência</CardTitle>
          <CardDescription>Ranking dos problemas mais frequentes</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          Sem dados para exibir
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Principais Tipos de Inconsistência</CardTitle>
        <CardDescription>Ranking dos problemas mais frequentes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={120} 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
