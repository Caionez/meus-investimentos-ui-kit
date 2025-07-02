
import { Navigation } from '@/components/Navigation';
import { useInvestments } from '@/contexts/InvestmentContext';
import { formatCurrency, getBankColor } from '@/utils/bankUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, Wallet, Target, Calendar } from 'lucide-react';

const Index = () => {
  const { investments } = useInvestments();

  // Calculate totals
  const totalInvested = investments.reduce((sum, inv) => sum + inv.investedValue, 0);
  const totalCurrent = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalProfit = totalCurrent - totalInvested;
  const totalProfitability = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  // Data for investment type distribution
  const typeDistribution = investments.reduce((acc, inv) => {
    const existing = acc.find(item => item.name === inv.type);
    if (existing) {
      existing.value += inv.currentValue;
    } else {
      acc.push({ name: inv.type, value: inv.currentValue });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Data for bank distribution
  const bankDistribution = investments.reduce((acc, inv) => {
    const existing = acc.find(item => item.name === inv.bank);
    if (existing) {
      existing.value += inv.currentValue;
    } else {
      acc.push({ 
        name: inv.bank, 
        value: inv.currentValue,
        color: getBankColor(inv.bank)
      });
    }
    return acc;
  }, [] as { name: string; value: number; color: string }[]);

  // Monthly evolution mock data (would come from real data in production)
  const monthlyData = [
    { month: 'Jan', invested: 15000, current: 15200 },
    { month: 'Fev', invested: 20000, current: 20400 },
    { month: 'Mar', invested: 25000, current: 25800 },
    { month: 'Abr', invested: 30000, current: 31050 },
  ];

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="Dashboard" />
      
      <div className="p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="md3-elevation-1">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total Investido</p>
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {formatCurrency(totalInvested)}
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
                  <p className="text-xs text-gray-600 dark:text-gray-400">Valor Atual</p>
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {formatCurrency(totalCurrent)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md3-elevation-1">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Lucro</p>
                  <p className="font-semibold text-sm text-green-600">
                    {formatCurrency(totalProfit)}
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
                  <p className="text-xs text-gray-600 dark:text-gray-400">Rentabilidade</p>
                  <p className="font-semibold text-sm text-green-600">
                    +{totalProfitability.toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Distribution by Type */}
        <Card className="md3-elevation-1">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Distribuição por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribution by Bank */}
        <Card className="md3-elevation-1">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Distribuição por Banco</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={bankDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bankDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Evolution */}
        <Card className="md3-elevation-1">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Evolução Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="invested" fill="#94A3B8" name="Investido" />
                <Bar dataKey="current" fill="#10B981" name="Atual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
