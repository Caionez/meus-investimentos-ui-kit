
import { Navigation } from '@/components/Navigation';
import { InvestmentForm } from '@/components/InvestmentForm';
import { useInvestments } from '@/contexts/InvestmentContext';

const AddInvestment = () => {
  const { addInvestment } = useInvestments();

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="Novo Investimento" showBack />
      
      <div className="p-4">
        <InvestmentForm onSubmit={addInvestment} />
      </div>
    </div>
  );
};

export default AddInvestment;
