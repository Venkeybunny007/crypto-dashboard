
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";

type TimeRange = "24h" | "7d" | "30d" | "90d" | "1y";

type PriceChartProps = {
  symbol: string;
  name: string;
  data: {
    timestamp: number;
    price: number;
  }[];
};

export function PriceChart({ symbol, name, data }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const { theme } = useTheme();

  // Format the data for the chart
  const chartData = data.map((item) => ({
    date: new Date(item.timestamp).toLocaleDateString(),
    price: item.price,
  }));

  const isDark = theme === "dark";
  const gradientColor = symbol === "BTC" ? "#f7931a" : 
                       symbol === "ETH" ? "#627eea" : 
                       symbol === "SOL" ? "#00FFA3" : "#9b87f5";
  
  const timeRanges = [
    { label: "24h", value: "24h" },
    { label: "7d", value: "7d" },
    { label: "30d", value: "30d" },
    { label: "90d", value: "90d" },
    { label: "1y", value: "1y" },
  ];

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-2 rounded-md shadow-md">
          <p className="text-sm">{`Date: ${label}`}</p>
          <p className="text-sm font-medium">{`Price: $${payload[0].value?.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">{name} Price Chart</CardTitle>
        <div className="flex gap-1">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? "default" : "outline"}
              size="sm"
              className="text-xs h-7"
              onClick={() => setTimeRange(range.value as TimeRange)}
            >
              {range.label}
            </Button>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-7"
            onClick={() => console.log("Download data")}
          >
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gradientColor} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"} 
              />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                stroke={isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"}
                tickFormatter={(value) => {
                  // Format x-axis labels based on time range
                  if (timeRange === "24h") {
                    return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  } else if (timeRange === "7d" || timeRange === "30d") {
                    return new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric' });
                  } else {
                    return new Date(value).toLocaleDateString([], { month: 'short', year: '2-digit' });
                  }
                }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                stroke={isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={gradientColor} 
                fillOpacity={1} 
                fill="url(#colorPrice)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
