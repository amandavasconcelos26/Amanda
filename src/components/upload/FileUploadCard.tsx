/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadCardProps {
  title: string;
  description: string;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
}

export function FileUploadCard({ 
  title, 
  description, 
  onFileSelect, 
  onFileRemove,
  selectedFile 
}: FileUploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {!selectedFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200",
              isDragging 
                ? "border-primary bg-primary/5 scale-[0.99]" 
                : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv,.xlsx,.xls,.pdf"
              className="hidden"
            />
            <div className="p-3 mb-4 rounded-full bg-primary/10 text-primary">
              <Upload className="w-6 h-6" />
            </div>
            <p className="mb-1 text-sm font-medium">Clique ou arraste o arquivo</p>
            <p className="text-xs text-muted-foreground">Suporta CSV, XLSX, XLS e PDF</p>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/30">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  onFileRemove();
                }}
                className="text-muted-foreground hover:text-rose-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
