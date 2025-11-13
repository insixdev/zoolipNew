# Componentes de Gráficos

## AreaChartInteractive

Componente de gráfico de área interactivo con filtros de tiempo.

### Uso

```tsx
import { AreaChartInteractive } from "~/components/charts/AreaChartInteractive";

const data = [
  { date: "2024-01-01", ventas: 100, gastos: 50 },
  { date: "2024-01-02", ventas: 150, gastos: 60 },
  // ...
];

const config = {
  ventas: {
    label: "Ventas",
    color: "#ec4899",
  },
  gastos: {
    label: "Gastos",
    color: "#f97316",
  },
};

<AreaChartInteractive
  data={data}
  config={config}
  title="Ventas vs Gastos"
  description="Comparación mensual"
  height={300}
/>;
```

### Props

- `data`: Array de objetos con fecha y valores numéricos
- `config`: Configuración de las series (label y color)
- `title`: Título del gráfico (opcional)
- `description`: Descripción (opcional)
- `timeRangeOptions`: Opciones de rango de tiempo (opcional)
- `defaultTimeRange`: Rango por defecto (opcional)
- `height`: Altura en píxeles (default: 250)
- `className`: Clases CSS adicionales (opcional)

---

## AreaChartLinear

Componente de gráfico de área lineal simple con tendencia.

### Uso

```tsx
import { AreaChartLinear } from "~/components/charts/AreaChartLinear";

const data = [
  { month: "Enero", visitors: 186 },
  { month: "Febrero", visitors: 305 },
  { month: "Marzo", visitors: 237 },
  // ...
];

<AreaChartLinear
  data={data}
  dataKey="visitors"
  xAxisKey="month"
  config={{
    label: "Visitantes",
    color: "#ec4899",
  }}
  title="Visitantes Mensuales"
  description="Total de visitantes"
  trend={{
    value: 5.2,
    label: "este mes",
  }}
  footer="Enero - Junio 2024"
  height={200}
/>;
```

### Props

- `data`: Array de objetos con los datos
- `dataKey`: Clave del valor a graficar
- `xAxisKey`: Clave para el eje X
- `config`: Configuración (label y color)
- `title`: Título del gráfico (opcional)
- `description`: Descripción (opcional)
- `trend`: Objeto con value (número) y label (string) para mostrar tendencia (opcional)
- `footer`: Texto del pie de gráfico (opcional)
- `height`: Altura en píxeles (default: 250)
- `fillOpacity`: Opacidad del relleno (default: 0.4)
- `showGrid`: Mostrar cuadrícula (default: true)
- `xAxisFormatter`: Función para formatear etiquetas del eje X (opcional)
- `className`: Clases CSS adicionales (opcional)
