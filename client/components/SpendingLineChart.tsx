import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

// Generate sample daily spending data for the past 30 days
const generateSpendingData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic spending patterns with weekend spikes
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseSpending = Math.random() * 800 + 200; // 200-1000 base
    const weekendMultiplier = isWeekend ? 1.3 : 1;
    const spending = Math.round(baseSpending * weekendMultiplier);
    
    // Calculate cumulative spending
    const prevCumulative = data.length > 0 ? data[data.length - 1].cumulative : 0;
    
    data.push({
      date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      fullDate: date.toISOString().split('T')[0],
      daily: spending,
      cumulative: prevCumulative + spending,
      budget: 25000, // Monthly budget reference line
      isWeekend
    });
  }
  
  return data;
};

const spendingData = generateSpendingData();

interface SpendingLineChartProps {
  viewType?: 'daily' | 'cumulative';
}

export default function SpendingLineChart({ viewType = 'daily' }: SpendingLineChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (viewType === 'cumulative') {
    return (
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={spendingData}>
            <defs>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="budget" 
              stroke="#ef4444" 
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
              name="Budget Line"
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill="url(#spendingGradient)"
              name="Cumulative Spending"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={spendingData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="daily" 
            stroke="#8b5cf6" 
            strokeWidth={3}
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#8b5cf6' }}
            name="Daily Spending"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
