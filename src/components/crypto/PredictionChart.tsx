
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from "recharts";

type PredictionChartProps = {
  symbol: string;
  name: string;
  historicalData: {
    date: string;
    price: number;
  }[];
  predictedData: {
    date: string;
    prediction: number;
    lowerBound?: number;
    upperBound?: number;
  }[];
};

export function PredictionChart({ symbol, name, historicalData, predictedData }: PredictionChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Combine historical and predicted data
  const combinedData = [
    ...historicalData,
    ...predictedData.map(d => ({
      date: d.date,
      price: null,
      prediction: d.prediction,
      lowerBound: d.lowerBound,
      upperBound: d.upperBound
    }))
  ];

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-2 rounded-md shadow-md">
          <p className="text-sm font-medium">{`Date: ${label}`}</p>
          {payload[0]?.value !== null && (
            <p className="text-sm">{`Actual: $${payload[0]?.value?.toLocaleString()}`}</p>
          )}
          {payload[1]?.value !== null && (
            <p className="text-sm text-primary">{`Prediction: $${payload[1]?.value?.toLocaleString()}`}</p>
          )}
          {payload[2]?.value !== null && (
            <p className="text-xs text-muted-foreground">{`Lower: $${payload[2]?.value?.toLocaleString()}`}</p>
          )}
          {payload[3]?.value !== null && (
            <p className="text-xs text-muted-foreground">{`Upper: $${payload[3]?.value?.toLocaleString()}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">AI Price Prediction for {name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={combinedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
              />
              <XAxis 
                dataKey="date" 
                stroke={isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"}
              />
              <YAxis 
                stroke={isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                name="Historical"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 1 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="prediction"
                name="Prediction"
                stroke="#9b87f5"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 2 }}
              />
              <Line
                type="monotone"
                dataKey="lowerBound"
                name="Lower Bound"
                stroke="#9b87f5"
                strokeWidth={1}
                strokeOpacity={0.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="upperBound"
                name="Upper Bound"
                stroke="#9b87f5"
                strokeWidth={1}
                strokeOpacity={0.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>* Predictions are based on historical data and machine learning models. Past performance is not indicative of future results.</p>
        </div>
      </CardContent>
    </Card>
  );
}
