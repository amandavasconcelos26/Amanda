/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ValidationIssue } from '@/src/types/audit';
import { StatusBadge } from '@/src/components/common/StatusBadge';
import { useAuditStore } from '@/src/store/auditStore';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, MessageSquare, Info } from 'lucide-react';

// Need to create Textarea component since I didn't add it via shadcn
// Actually I'll just use a standard textarea or add it now.
// I'll add it via shadcn for consistency.

interface VariableCheckDetailsDrawerProps {
  issue: ValidationIssue;
  isOpen: boolean;
  onClose: () => void;
}

export function VariableCheckDetailsDrawer({ issue, isOpen, onClose }: VariableCheckDetailsDrawerProps) {
  const [note, setNote] = useState(issue.note || '');
  const updateValidationIssue = useAuditStore(state => state.updateValidationIssue);

  const handleSave = () => {
    updateValidationIssue(issue.id, { note, reviewed: true });
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={issue.severity} />
            <span className="text-xs font-mono text-muted-foreground">ID: {issue.id.slice(0, 8)}</span>
          </div>
          <SheetTitle className="text-xl">Detalhes da Inconsistência</SheetTitle>
          <SheetDescription>
            Análise detalhada do registro {issue.cte ? `CTE ${issue.cte}` : 'sem CTE'}.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase">Variável</Label>
              <p className="font-medium capitalize">{issue.field}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase">Origem</Label>
              <p className="font-medium">{issue.source === 'A' ? 'GW Sistemas' : 'ATUA'}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50 border">
              <Label className="text-muted-foreground text-xs uppercase mb-2 block">Valor Encontrado</Label>
              <p className="text-sm font-mono break-all">{String(issue.currentValue || 'Nulo/Vazio')}</p>
            </div>

            {issue.expectedValue !== undefined && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <Label className="text-emerald-700 text-xs uppercase mb-2 block">Valor Esperado</Label>
                <p className="text-sm font-mono text-emerald-800">{String(issue.expectedValue)}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-800">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold">Mensagem do Sistema</p>
              <p className="text-sm opacity-90">{issue.message}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label htmlFor="note" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Observações da Revisão
            </Label>
            <textarea
              id="note"
              className="w-full min-h-[120px] p-3 rounded-md border bg-background text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Adicione uma nota sobre esta inconsistência..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <SheetFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button onClick={handleSave} className="flex-1 gap-2">
            <CheckCircle className="w-4 h-4" />
            Marcar como Revisado
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
