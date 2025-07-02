
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { useInvestments } from '@/contexts/InvestmentContext';
import { getBankColor, formatCurrency, calculateProfitability } from '@/utils/bankUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, Calendar, TrendingUp, Wallet, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InvestmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInvestment, deleteInvestment } = useInvestments();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const investment = id ? getInvestment(id) : undefined;

  if (!investment) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation title="Investimento não encontrado" showBack />
        <div className="p-4 text-center">
          <p className="text-muted-foreground">O investimento solicitado não foi encontrado.</p>
        </div>
      </div>
    );
  }

  const bankColor = getBankColor(investment.bank);
  const profitability = calculateProfitability(investment.investedValue, investment.currentValue);
  const profit = investment.currentValue - investment.investedValue;
  const isProfit = profitability > 0;

  const handleEdit = () => {
    navigate(`/investments/${investment.id}/edit`);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteInvestment(investment.id);
    toast({
      title: "Investimento excluído",
      description: "O investimento foi removido com sucesso.",
    });
    navigate('/investments');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="Detalhes do Investimento" showBack />
      
      <div className="p-4 space-y-6">
        {/* Main Info Card */}
        <Card className="md3-elevation-2">
          <CardContent className="p-0">
            {/* Bank Color Strip */}
            <div 
              className="h-2 w-full rounded-t-lg"
              style={{ backgroundColor: bankColor }}
            />
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: bankColor }}
                />
                <span className="text-lg font-semibold text-foreground">
                  {investment.bank}
                </span>
                <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm">
                  {investment.type}
                </span>
              </div>

              <h1 className="text-2xl font-bold mb-2">{investment.name}</h1>
              
              {investment.yield && (
                <p className="text-lg text-muted-foreground mb-4">
                  Rendimento: {investment.yield}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={handleEdit} className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteClick}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="md3-elevation-1">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wallet className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Valor Investido</p>
                  <p className="font-semibold">
                    {formatCurrency(investment.investedValue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md3-elevation-1">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Valor Atual</p>
                  <p className="font-semibold">
                    {formatCurrency(investment.currentValue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md3-elevation-1">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Lucro/Prejuízo</p>
                  <p className={`font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(profit)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md3-elevation-1">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rentabilidade</p>
                  <p className={`font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                    {isProfit ? '+' : ''}{profitability.toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Details */}
        <Card className="md3-elevation-1">
          <CardHeader>
            <CardTitle>Informações do Investimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Data de Aplicação</p>
                <p className="font-medium">{investment.applicationDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de Vencimento</p>
                <p className="font-medium">{investment.maturityDate}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Dias Corridos</p>
              <p className="font-medium">{investment.days} dias</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Investimento</p>
              <p className="font-medium">{investment.type}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Investimento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o investimento "{investment.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvestmentDetails;
