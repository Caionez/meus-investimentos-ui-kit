
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Investment, Bank, InvestmentType } from '@/contexts/InvestmentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface InvestmentFormProps {
  initialData?: Investment;
  onSubmit: (data: Omit<Investment, 'id' | 'days'>) => void;
  isEditing?: boolean;
}

const banks: Bank[] = ['Nubank', 'Inter', 'Sofisa', 'XP', 'Icatu'];
const investmentTypes: InvestmentType[] = ['CDB', 'LCI/LCA', 'SELIC', 'IPCA+', 'PREFIX', 'FI', 'RDB', 'PREV'];

export const InvestmentForm = ({ initialData, onSubmit, isEditing = false }: InvestmentFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    bank: initialData?.bank || '' as Bank,
    type: initialData?.type || '' as InvestmentType,
    name: initialData?.name || '',
    yield: initialData?.yield || '',
    investedValue: initialData?.investedValue?.toString() || '',
    currentValue: initialData?.currentValue?.toString() || '',
    applicationDate: initialData?.applicationDate || '',
    maturityDate: initialData?.maturityDate || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.bank) newErrors.bank = 'Selecione um banco';
    if (!formData.type) newErrors.type = 'Selecione o tipo de investimento';
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.investedValue) newErrors.investedValue = 'Valor investido é obrigatório';
    if (!formData.currentValue) newErrors.currentValue = 'Valor atual é obrigatório';
    if (!formData.applicationDate) newErrors.applicationDate = 'Data de aplicação é obrigatória';
    if (!formData.maturityDate) newErrors.maturityDate = 'Data de vencimento é obrigatória';

    // Validate number fields
    if (formData.investedValue && isNaN(Number(formData.investedValue))) {
      newErrors.investedValue = 'Valor deve ser um número válido';
    }
    if (formData.currentValue && isNaN(Number(formData.currentValue))) {
      newErrors.currentValue = 'Valor deve ser um número válido';
    }

    // Validate date format (dd/mm/yyyy)
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (formData.applicationDate && !dateRegex.test(formData.applicationDate)) {
      newErrors.applicationDate = 'Use o formato dd/mm/aaaa';
    }
    if (formData.maturityDate && !dateRegex.test(formData.maturityDate)) {
      newErrors.maturityDate = 'Use o formato dd/mm/aaaa';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive",
      });
      return;
    }

    const investmentData = {
      bank: formData.bank,
      type: formData.type,
      name: formData.name.trim(),
      yield: formData.yield.trim() || undefined,
      investedValue: Number(formData.investedValue),
      currentValue: Number(formData.currentValue),
      applicationDate: formData.applicationDate,
      maturityDate: formData.maturityDate,
    };

    onSubmit(investmentData);
    
    toast({
      title: isEditing ? "Investimento atualizado" : "Investimento criado",
      description: isEditing ? "As alterações foram salvas com sucesso." : "Novo investimento adicionado com sucesso.",
    });

    navigate('/investments');
  };

  const formatDateInput = (value: string) => {
    // Remove non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Format as dd/mm/yyyy
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const handleDateChange = (field: 'applicationDate' | 'maturityDate', value: string) => {
    const formatted = formatDateInput(value);
    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const formatCurrencyInput = (value: string) => {
    // Remove non-numeric characters except dots and commas
    const numbers = value.replace(/[^\d.,]/g, '');
    return numbers;
  };

  return (
    <Card className="md3-elevation-1">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bank Selection */}
          <div className="space-y-2">
            <Label htmlFor="bank">Banco *</Label>
            <Select value={formData.bank} onValueChange={(value: Bank) => setFormData(prev => ({ ...prev, bank: value }))}>
              <SelectTrigger className={errors.bank ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione o banco" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bank && <p className="text-sm text-destructive">{errors.bank}</p>}
          </div>

          {/* Investment Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Investimento *</Label>
            <Select value={formData.type} onValueChange={(value: InvestmentType) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className={errors.type ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {investmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
          </div>

          {/* Investment Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Investimento *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: CDB Banco XYZ 120% CDI"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Yield */}
          <div className="space-y-2">
            <Label htmlFor="yield">Rendimento</Label>
            <Input
              id="yield"
              value={formData.yield}
              onChange={(e) => setFormData(prev => ({ ...prev, yield: e.target.value }))}
              placeholder="Ex: 120% CDI, IPCA + 5%, 12% a.a."
            />
          </div>

          {/* Values */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="investedValue">Valor Investido (R$) *</Label>
              <Input
                id="investedValue"
                value={formData.investedValue}
                onChange={(e) => setFormData(prev => ({ ...prev, investedValue: formatCurrencyInput(e.target.value) }))}
                placeholder="0.00"
                className={errors.investedValue ? 'border-destructive' : ''}
              />
              {errors.investedValue && <p className="text-sm text-destructive">{errors.investedValue}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentValue">Valor Atual (R$) *</Label>
              <Input
                id="currentValue"
                value={formData.currentValue}
                onChange={(e) => setFormData(prev => ({ ...prev, currentValue: formatCurrencyInput(e.target.value) }))}
                placeholder="0.00"
                className={errors.currentValue ? 'border-destructive' : ''}
              />
              {errors.currentValue && <p className="text-sm text-destructive">{errors.currentValue}</p>}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicationDate">Data de Aplicação *</Label>
              <Input
                id="applicationDate"
                value={formData.applicationDate}
                onChange={(e) => handleDateChange('applicationDate', e.target.value)}
                placeholder="dd/mm/aaaa"
                maxLength={10}
                className={errors.applicationDate ? 'border-destructive' : ''}
              />
              {errors.applicationDate && <p className="text-sm text-destructive">{errors.applicationDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maturityDate">Data de Vencimento *</Label>
              <Input
                id="maturityDate"
                value={formData.maturityDate}
                onChange={(e) => handleDateChange('maturityDate', e.target.value)}
                placeholder="dd/mm/aaaa"
                maxLength={10}
                className={errors.maturityDate ? 'border-destructive' : ''}
              />
              {errors.maturityDate && <p className="text-sm text-destructive">{errors.maturityDate}</p>}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {isEditing ? 'Salvar Alterações' : 'Criar Investimento'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
