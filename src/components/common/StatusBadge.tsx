/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Badge } from '@/components/ui/badge';
import { Severity } from '@/src/types/audit';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: Severity;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = {
    ok: {
      color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
      text: label || 'OK',
    },
    warning: {
      color: 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200',
      icon: <AlertTriangle className="w-3.5 h-3.5 mr-1" />,
      text: label || 'Aviso',
    },
    error: {
      color: 'bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200',
      icon: <XCircle className="w-3.5 h-3.5 mr-1" />,
      text: label || 'Erro',
    },
  };

  const { color, icon, text } = config[status];

  return (
    <Badge variant="outline" className={`${color} font-medium px-2 py-0.5 flex items-center w-fit`}>
      {icon}
      {text}
    </Badge>
  );
}
