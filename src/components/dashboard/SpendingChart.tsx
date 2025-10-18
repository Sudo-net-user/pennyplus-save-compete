import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { SpendingCategory } from "@/pages/Index";

interface SpendingChartProps {
  spending: SpendingCategory[];
}

const COLORS = [
  "hsl(142, 76%, 36%)",
  "hsl(262, 83%, 58%)",
  "hsl(45, 100%, 51%)",
  "hsl(38, 92%, 50%)",
  "hsl(158, 64%, 52%)",
  "hsl(282, 76%, 65%)",
];

export const SpendingChart = ({ spending }: SpendingChartProps) => {
  const data = spending.map((cat) => ({
    name: cat.name,
    value: cat.amount,
  }));

  return (
    <Card className="border-2 shadow-md">
      <CardHeader>
        <CardTitle>Spending Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `$${entry.value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
