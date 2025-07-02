
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Investment } from '@/contexts/InvestmentContext';
import { getBankColor, formatCurrency, calculateProfitability } from '@/utils/bankUtils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';

interface InvestmentCardProps {
  investment: Investment;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const InvestmentCard = ({ investment, onEdit, onDelete }: InvestmentCardProps) => {
  const bankColor = getBankColor(investment.bank);
  const profitability = calculateProfitability(investment.investedValue, investment.currentValue);
  const isProfit = profitability > 0;

  return (
    <Card className="md3-elevation-1 hover:md3-elevation-2 transition-all duration-200 animate-fade-in">
      <CardContent className="p-0">
        <Link to={`/investments/${investment.id}`} className="block">
          {/* Bank Color Strip */}
          <div 
            className="h-1 w-full rounded-t-lg"
            style={{ backgroundColor: bankColor }}
          />
          
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: bankColor }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {investment.bank}
                  </span>
                  <span className="text-xs bg-accent text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full font-medium">
                    {investment.type}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {investment.name}
                </h3>
                {investment.yield && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {investment.yield}
                  </p>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border z-50">
                  <DropdownMenuItem onClick={(e) => { e.preventDefault(); onEdit?.(); }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => { e.preventDefault(); onDelete?.(); }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Values */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Investido</p>
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                  {formatCurrency(investment.investedValue)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Atual</p>
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                  {formatCurrency(investment.currentValue)}
                </p>
              </div>
            </div>

            {/* Profitability */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {investment.days} dias
              </span>
              <span className={`font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                {isProfit ? '+' : ''}{profitability.toFixed(2)}%
              </span>
            </div>

            {/* Dates */}
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2 pt-2 border-t">
              <span>Aplicação: {investment.applicationDate}</span>
              <span>Vencimento: {investment.maturityDate}</span>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};
