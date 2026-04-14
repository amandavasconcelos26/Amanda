/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { ValidationIssue } from '@/src/types/audit';

interface InconsistencyChartProps {
  issues: ValidationIssue[];
}

export function InconsistencyChart({ issues }: InconsistencyChartProps) {
  const data = [
    { name: 'Erros Críticos', value: issues.filter(i => i.severity === 'error').length, color: '#f43f5e' },
    { name: 'Alertas', value: issues.filter(i => i.severity === 'warning').length, color: '#f59e0b' },
    { name: 'OK', value: issues.filter(i => i.severity === 'ok').length, color: '#10b981' },
  ].filter(d => d.value > 0);

  if (issues.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Distribuição por Severidade</CardTitle>
          <CardDescription>Nenhuma inconsistência detectada</CardDescription>
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
        <CardTitle>Distribuição por Severidade</CardTitle>
        <CardDescription>Proporção de erros e alertas encontrados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
