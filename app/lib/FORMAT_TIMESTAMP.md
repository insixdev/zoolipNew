# Timestamp Formatting Guide

Centralizado en `~/lib/formatTimestamp.ts`

## Funciones Disponibles

### `formatTimestamp(dateString)`
Convierte un string de fecha ISO a formato relativo o legible.

**Uso:**
```tsx
import { formatTimestamp } from "~/lib/formatTimestamp";

const date = "2024-11-21T14:30:00Z";
formatTimestamp(date); // "Ahora" | "Hace 5m" | "Hace 2h" | "Hace 3d" | "21 nov"
```

**Retorna:**
- "Ahora" - si es menor a 1 minuto
- "Hace Xm" - minutos (1-59)
- "Hace Xh" - horas (1-23)
- "Hace Xd" - días (1-6)
- "D MMM" - fecha corta (más de 7 días) ej: "21 nov"

### `formatTimestampLong(dateString)`
Convierte a formato largo legible con fecha y hora completa.

**Uso:**
```tsx
import { formatTimestampLong } from "~/lib/formatTimestamp";

const date = "2024-11-21T14:30:00Z";
formatTimestampLong(date); // "21 de noviembre de 2024, 14:30"
```

### `formatTimestampTime(dateString)`
Extrae solo la hora en formato HH:mm.

**Uso:**
```tsx
import { formatTimestampTime } from "~/lib/formatTimestamp";

const date = "2024-11-21T14:30:00Z";
formatTimestampTime(date); // "14:30"
```

## Manejo de Errores

Todas las funciones manejan:
- ✓ `null` / `undefined` - retorna valor por defecto
- ✓ Strings no ISO - intenta parsear, si falla retorna valor por defecto
- ✓ Timestamps numéricos - soportados (convertidos automáticamente)
- ✓ Fechas futuras - soportadas

## Ejemplos de Uso en Componentes

### En PostCard
```tsx
import { formatTimestamp } from "~/lib/formatTimestamp";

export default function PostCard({ post }) {
  const formattedDate = formatTimestamp(post.fecha_creacion);
  
  return (
    <div>
      <p className="text-sm text-gray-500">
        {post.author.username} · {formattedDate}
      </p>
    </div>
  );
}
```

### En Pregunta
```tsx
import { formatTimestamp } from "~/lib/formatTimestamp";

export function Pregunta({ timestamp, ...props }) {
  const formattedTimestamp = formatTimestamp(timestamp);
  
  return (
    <span className="text-sm text-gray-500">
      {formattedTimestamp}
    </span>
  );
}
```

### En Comentarios
```tsx
import { formatTimestamp } from "~/lib/formatTimestamp";

export function CommentItem({ comment }) {
  const timeAgo = formatTimestamp(comment.fecha_comentario);
  
  return (
    <div className="text-xs text-gray-400">
      {timeAgo}
    </div>
  );
}
```

## Locales Soportados

- **es-ES** (español de España) - Localization por defecto
- Puede adaptarse a otros locales si es necesario

## Data Flow

```
Backend (ISO string)
    ↓
formatTimestamp()
    ↓
Componente (texto formateado)
    ↓
UI ("Hace 5m", "21 nov", etc)
```

## Testing

Para probar los formatos:

```tsx
// Hace menos de un minuto
formatTimestamp(new Date().toISOString()); // "Ahora"

// Hace 5 minutos
const date5m = new Date(Date.now() - 5 * 60000);
formatTimestamp(date5m.toISOString()); // "Hace 5m"

// Hace 2 horas
const date2h = new Date(Date.now() - 2 * 3600000);
formatTimestamp(date2h.toISOString()); // "Hace 2h"

// Hace 3 días
const date3d = new Date(Date.now() - 3 * 86400000);
formatTimestamp(date3d.toISOString()); // "Hace 3d"

// Hace 30 días
const date30d = new Date(Date.now() - 30 * 86400000);
formatTimestamp(date30d.toISOString()); // "21 oct" (o fecha actual)
```

## Notas Importantes

1. **No requires timezone** - Maneja automáticamente timezones
2. **Null-safe** - Devuelve "Hace un momento" si es null/undefined
3. **Lazy evaluation** - Se calcula en cliente, no en servidor
4. **No overhead** - Una sola función, sin imports pesados
5. **Spanish by default** - Labels en español

## Migrando código viejo

Si encuentras código que usa formatTimestamp local:

**Antes:**
```tsx
const formatTimestamp = (dateString: string): string => {
  // ... lógica
};
```

**Después:**
```tsx
import { formatTimestamp } from "~/lib/formatTimestamp";
// Usar directamente
```
