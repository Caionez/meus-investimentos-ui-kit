
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Bank = 'Nubank' | 'Inter' | 'Sofisa' | 'XP' | 'Icatu';
export type InvestmentType = 'CDB' | 'LCI/LCA' | 'SELIC' | 'IPCA+' | 'PREFIX' | 'FI' | 'RDB' | 'PREV';

export interface Investment {
  id: string;
  bank: Bank;
  type: InvestmentType;
  name: string;
  yield?: string;
  investedValue: number;
  currentValue: number;
  applicationDate: string;
  maturityDate: string;
  days: number;
}

interface InvestmentContextType {
  investments: Investment[];
  addInvestment: (investment: Omit<Investment, 'id' | 'days'>) => void;
  updateInvestment: (id: string, investment: Omit<Investment, 'id' | 'days'>) => void;
  deleteInvestment: (id: string) => void;
  getInvestment: (id: string) => Investment | undefined;
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

export const useInvestments = () => {
  const context = useContext(InvestmentContext);
  if (!context) {
    throw new Error('useInvestments must be used within an InvestmentProvider');
  }
  return context;
};

const calculateDays = (applicationDate: string): number => {
  const appDate = new Date(applicationDate.split('/').reverse().join('-'));
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - appDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Mock data for demonstration
const mockInvestments: Investment[] = [
  {
    id: '1',
    bank: 'Nubank',
    type: 'CDB',
    name: 'CDB Nubank 100% CDI',
    yield: '100% CDI',
    investedValue: 10000,
    currentValue: 10500,
    applicationDate: '15/01/2024',
    maturityDate: '15/01/2025',
    days: calculateDays('15/01/2024')
  },
  {
    id: '2',
    bank: 'XP',
    type: 'IPCA+',
    name: 'Tesouro IPCA+ 2029',
    yield: 'IPCA + 5,5%',
    investedValue: 5000,
    currentValue: 5250,
    applicationDate: '10/03/2024',
    maturityDate: '15/05/2029',
    days: calculateDays('10/03/2024')
  },
  {
    id: '3',
    bank: 'Inter',
    type: 'LCI/LCA',
    name: 'LCI Inter',
    yield: '95% CDI',
    investedValue: 15000,
    currentValue: 15300,
    applicationDate: '20/02/2024',
    maturityDate: '20/02/2026',
    days: calculateDays('20/02/2024')
  }
];

export const InvestmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments);

  const addInvestment = (investmentData: Omit<Investment, 'id' | 'days'>) => {
    const newInvestment: Investment = {
      ...investmentData,
      id: Date.now().toString(),
      days: calculateDays(investmentData.applicationDate)
    };
    setInvestments(prev => [...prev, newInvestment]);
  };

  const updateInvestment = (id: string, investmentData: Omit<Investment, 'id' | 'days'>) => {
    setInvestments(prev =>
      prev.map(inv =>
        inv.id === id
          ? { ...investmentData, id, days: calculateDays(investmentData.applicationDate) }
          : inv
      )
    );
  };

  const deleteInvestment = (id: string) => {
    setInvestments(prev => prev.filter(inv => inv.id !== id));
  };

  const getInvestment = (id: string) => {
    return investments.find(inv => inv.id === id);
  };

  return (
    <InvestmentContext.Provider value={{
      investments,
      addInvestment,
      updateInvestment,
      deleteInvestment,
      getInvestment
    }}>
      {children}
    </InvestmentContext.Provider>
  );
};
