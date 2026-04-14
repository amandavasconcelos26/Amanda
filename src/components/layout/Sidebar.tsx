/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  BarChart3, 
  FileUp, 
  ShieldCheck, 
  GitCompare, 
  Download, 
  LayoutDashboard,
  Truck,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: FileUp, label: 'Importação', active: false },
  { icon: ShieldCheck, label: 'Validação', active: false },
  { icon: GitCompare, label: 'Comparação', active: false },
  { icon: Download, label: 'Exportação', active: false },
  { icon: History, label: 'Histórico', active: false },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-muted/30 hidden lg:block">
      <div className="flex flex-col h-full">
        <div className="flex items-center h-16 px-6 border-b bg-background">
          <Truck className="w-6 h-6 mr-2 text-primary" />
          <span className="text-xl font-bold tracking-tight">AuditFrete</span>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Menu Principal
          </p>
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? 'secondary' : 'ghost'}
              className={cn(
                "w-full justify-start gap-3 px-3 py-2 h-10",
                item.active ? "bg-primary/10 text-primary hover:bg-primary/15" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Button>
          ))}
          
          <div className="pt-8">
            <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Relatórios
            </p>
            <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-2 h-10 text-muted-foreground">
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Mensal</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-2 h-10 text-muted-foreground">
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Por Filial</span>
            </Button>
          </div>
        </div>
        
        <div className="p-4 border-t bg-background">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Sistema Online</p>
              <p className="text-[10px] text-muted-foreground truncate">v1.2.0-stable</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
