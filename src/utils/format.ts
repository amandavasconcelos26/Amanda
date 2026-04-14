/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatNumber = (value: number | null | undefined, decimals = 2): string => {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '-';
  const date = parseISO(dateString);
  if (!isValid(date)) return dateString;
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '-';
  const date = parseISO(dateString);
  if (!isValid(date)) return dateString;
  return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
};

export const formatCpfCnpj = (value: string | null | undefined): string => {
  if (!value) return '-';
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length === 11) {
    return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  if (cleanValue.length === 14) {
    return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return value;
};

export const formatPlate = (value: string | null | undefined): string => {
  if (!value) return '-';
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
};
