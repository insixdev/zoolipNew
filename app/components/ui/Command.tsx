import * as React from "react";
import { cn } from "~/lib/generalUtil";

type CommandProps = {
  className?: string;
  children: React.ReactNode;
};

type CommandInputProps = {
  placeholder?: string;
  className?: string;
};

type CommandListProps = {
  children: React.ReactNode;
  className?: string;
};

type CommandEmptyProps = {
  children: React.ReactNode;
  className?: string;
};

type CommandGroupProps = {
  heading?: string;
  children: React.ReactNode;
  className?: string;
};

type CommandItemProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
  className?: string;
};

type CommandSeparatorProps = {
  className?: string;
};

type CommandShortcutProps = {
  children: React.ReactNode;
  className?: string;
};

const CommandContext = React.createContext<{
  search: string;
  setSearch: (search: string) => void;
}>({
  search: "",
  setSearch: () => {},
});

export function Command({ className, children }: CommandProps) {
  const [search, setSearch] = React.useState("");

  return (
    <CommandContext.Provider value={{ search, setSearch }}>
      <div
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-gray-900",
          className
        )}
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
}

export function CommandInput({ placeholder, className }: CommandInputProps) {
  const { search, setSearch } = React.useContext(CommandContext);

  return (
    <div className="flex items-center border-b px-3">
      <svg
        className="mr-2 h-4 w-4 shrink-0 opacity-50"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      />
    </div>
  );
}

export function CommandList({ children, className }: CommandListProps) {
  return (
    <div
      className={cn(
        "max-h-[300px] overflow-y-auto overflow-x-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CommandEmpty({ children, className }: CommandEmptyProps) {
  const { search } = React.useContext(CommandContext);
  const [hasResults, setHasResults] = React.useState(true);

  React.useEffect(() => {
    // Este efecto se ejecutará después de que los items se rendericen
    const timer = setTimeout(() => {
      const items = document.querySelectorAll("[data-command-item]");
      const visibleItems = Array.from(items).filter(
        (item) => !item.classList.contains("hidden")
      );
      setHasResults(visibleItems.length > 0);
    }, 0);

    return () => clearTimeout(timer);
  }, [search]);

  if (hasResults || !search) return null;

  return (
    <div className={cn("py-6 text-center text-sm text-gray-500", className)}>
      {children}
    </div>
  );
}

export function CommandGroup({
  heading,
  children,
  className,
}: CommandGroupProps) {
  return (
    <div className={cn("overflow-hidden p-1", className)}>
      {heading && (
        <div className="px-2 py-1.5 text-xs font-medium text-gray-500">
          {heading}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

export function CommandItem({
  children,
  disabled,
  onSelect,
  className,
}: CommandItemProps) {
  const { search } = React.useContext(CommandContext);

  // Filtrar items basado en la búsqueda - extraer todo el texto
  const extractText = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(extractText).join(" ");
    if (React.isValidElement(node) && node.props.children) {
      return extractText(node.props.children);
    }
    return "";
  };

  const text = extractText(children).toLowerCase();
  const matches = !search || text.includes(search.toLowerCase());

  if (!matches) {
    return null;
  }

  return (
    <div
      data-command-item
      onClick={disabled ? undefined : onSelect}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors text-gray-900",
        disabled ? "pointer-events-none opacity-50" : "hover:bg-gray-100",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CommandSeparator({ className }: CommandSeparatorProps) {
  return <div className={cn("-mx-1 h-px bg-gray-200", className)} />;
}

export function CommandShortcut({ children, className }: CommandShortcutProps) {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-gray-500", className)}
    >
      {children}
    </span>
  );
}
