import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

type ChartDataItem = {
  date: string;
  [key: string]: string | number;
};

type AreaChartInteractiveProps = {
  data: ChartDataItem[];
  config: Record<string, { label: string; color: string }>;
  title?: string;
  description?: string;
  timeRangeOptions?: { value: string; label: string; days: number }[];
  defaultTimeRange?: string;
  height?: number;
  className?: string;
};

export function AreaChartInteractive({
  data,
  config,
  title = "Gráfico de Área",
  description,
  timeRangeOptions = [
    { value: "90d", label: "Últimos 3 meses", days: 90 },
    { value: "30d", label: "Últimos 30 días", days: 30 },
    { value: "7d", label: "Últimos 7 días", days: 7 },
  ],
  defaultTimeRange = "90d",
  height = 250,
  className = "",
}: AreaChartInteractiveProps) {
  const [timeRange, setTimeRange] = React.useState(defaultTimeRange);

  const filteredData = React.useMemo(() => {
    const selectedOption = timeRangeOptions.find((o) => o.value === timeRange);
    if (!selectedOption || !data.length) return data;

    const lastDate = new Date(data[data.length - 1].date);
    const startDate = new Date(lastDate);
    startDate.setDate(startDate.getDate() - selectedOption.days);

    return data.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate;
    });
  }, [data, timeRange, timeRangeOptions]);

  const dataKeys = Object.keys(config);

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      <div className="flex items-center justify-between border-b p-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        >
          {timeRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="p-6">
        <ChartContainer config={config} className={`h-[${height}px] w-full`}>
          <AreaChart data={filteredData}>
            <defs>
              {dataKeys.map((key) => (
                <linearGradient
                  key={key}
                  id={`fill${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={config[key].color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={config[key].color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("es-ES", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-ES", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={`url(#fill${key})`}
                stroke={config[key].color}
                stackId={index === 0 ? "a" : undefined}
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
