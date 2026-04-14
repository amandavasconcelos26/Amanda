/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FileSearch } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg bg-muted/30">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-muted">
        {icon || <FileSearch className="w-8 h-8 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-xs mt-2 text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
