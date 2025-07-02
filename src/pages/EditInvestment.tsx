
import { useParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { InvestmentForm } from '@/components/InvestmentForm';
import { useInvestments } from '@/contexts/InvestmentContext';

const EditInvestment = () => {
  const { id } = useParams<{ id: string }>();
  const { getInvestment, updateInvestment } = useInvestments();

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

  const handleSubmit = (data: any) => {
    updateInvestment(investment.id, data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="Editar Investimento" showBack />
      
      <div className="p-4">
        <InvestmentForm 
          initialData={investment}
          onSubmit={handleSubmit}
          isEditing={true}
        />
      </div>
    </div>
  );
};

export default EditInvestment;
