import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

type ChartDataItem = {
  [key: string]: string | number;
};

type AreaChartLinearProps = {
  data: ChartDataItem[];
  dataKey: string;
  xAxisKey: string;
  config: {
    label: string;
    color: string;
  };
  title?: string;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
  footer?: string;
  height?: number;
  className?: string;
  fillOpacity?: number;
  showGrid?: boolean;
  xAxisFormatter?: (value: string) => string;
};

export function AreaChartLinear({
  data,
  dataKey,
  xAxisKey,
  config,
  title = "Gráfico de Área",
  description,
  trend,
  footer,
  height = 250,
  className = "",
  fillOpacity = 0.4,
  showGrid = true,
  xAxisFormatter = (value) => value.slice(0, 3),
}: AreaChartLinearProps) {
  const chartConfig = {
    [dataKey]: config,
  };

  const isTrendingUp = trend && trend.value > 0;

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="border-b p-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>

      {/* Chart */}
      <div className="p-6">
        <ChartContainer
          config={chartConfig}
          className={`h-[${height}px] w-full`}
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            {showGrid && (
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
            )}
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={xAxisFormatter}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey={dataKey}
              type="linear"
              fill={config.color}
              fillOpacity={fillOpacity}
              stroke={config.color}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </div>

      {/* Footer */}
      {(trend || footer) && (
        <div className="border-t p-6">
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              {trend && (
                <div className="flex items-center gap-2 leading-none font-medium">
                  {isTrendingUp ? (
                    <>
                      <span className="text-green-600">
                        Incremento de {Math.abs(trend.value)}% {trend.label}
                      </span>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </>
                  ) : (
                    <>
                      <span className="text-red-600">
                        Disminución de {Math.abs(trend.value)}% {trend.label}
                      </span>
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    </>
                  )}
                </div>
              )}
              {footer && (
                <div className="text-gray-500 flex items-center gap-2 leading-none">
                  {footer}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
