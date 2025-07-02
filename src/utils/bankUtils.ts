
import { Bank } from '@/contexts/InvestmentContext';

export const getBankColor = (bank: Bank): string => {
  const colors = {
    'Nubank': 'rgb(123, 33, 203)',
    'Inter': 'rgb(220, 124, 52)',
    'XP': 'rgb(25, 25, 25)',
    'Sofisa': 'rgb(81, 169, 148)',
    'Icatu': 'rgb(23, 48, 89)'
  };
  return colors[bank];
};

export const getBankColorClass = (bank: Bank): string => {
  const classes = {
    'Nubank': 'nubank',
    'Inter': 'inter',
    'XP': 'xp',
    'Sofisa': 'sofisa',
    'Icatu': 'icatu'
  };
  return classes[bank];
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  return dateString;
};

export const calculateProfitability = (invested: number, current: number): number => {
  return ((current - invested) / invested) * 100;
};
