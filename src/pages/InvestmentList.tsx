
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { InvestmentCard } from '@/components/InvestmentCard';
import { useInvestments } from '@/contexts/InvestmentContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

const InvestmentList = () => {
  const { investments, deleteInvestment } = useInvestments();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [investmentToDelete, setInvestmentToDelete] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    navigate(`/investments/${id}/edit`);
  };

  const handleDeleteClick = (id: string) => {
    setInvestmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (investmentToDelete) {
      deleteInvestment(investmentToDelete);
      toast({
        title: "Investimento excluído",
        description: "O investimento foi removido com sucesso.",
      });
      setDeleteDialogOpen(false);
      setInvestmentToDelete(null);
    }
  };

  const investmentToDeleteData = investments.find(inv => inv.id === investmentToDelete);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation title="Meus Investimentos" />
      
      <div className="p-4">
        {investments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Nenhum investimento encontrado</h3>
              <p className="text-muted-foreground mb-6">
                Comece adicionando seu primeiro investimento
              </p>
              <Button onClick={() => navigate('/investments/add')}>
                Adicionar Investimento
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {investments.map((investment) => (
              <InvestmentCard
                key={investment.id}
                investment={investment}
                onEdit={() => handleEdit(investment.id)}
                onDelete={() => handleDeleteClick(investment.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => navigate('/investments/add')}
        className="fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg md3-elevation-3"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Investimento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o investimento "{investmentToDeleteData?.name}"?
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

export default InvestmentList;
