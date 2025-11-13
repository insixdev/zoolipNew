import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "~/lib/generalUtil";

type AccordionProps = {
  type?: "single" | "multiple";
  collapsible?: boolean;
  className?: string;
  defaultValue?: string;
  children: React.ReactNode;
};

type AccordionItemProps = {
  value: string;
  children: React.ReactNode;
};

type AccordionTriggerProps = {
  children: React.ReactNode;
  className?: string;
};

type AccordionContentProps = {
  children: React.ReactNode;
  className?: string;
};

const AccordionContext = React.createContext<{
  openItems: string[];
  toggleItem: (value: string) => void;
}>({
  openItems: [],
  toggleItem: () => {},
});

export function Accordion({
  type = "single",
  collapsible = false,
  className,
  defaultValue,
  children,
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(
    defaultValue ? [defaultValue] : []
  );

  const toggleItem = (value: string) => {
    if (type === "single") {
      setOpenItems((prev) =>
        prev.includes(value) && collapsible ? [] : [value]
      );
    } else {
      setOpenItems((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn("w-full", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ value, children }: AccordionItemProps) {
  return (
    <div className="border-b border-gray-200" data-value={value}>
      {children}
    </div>
  );
}

export function AccordionTrigger({
  children,
  className,
}: AccordionTriggerProps) {
  const { openItems, toggleItem } = React.useContext(AccordionContext);
  const parentValue =
    React.useContext(AccordionItemContext) ||
    (React.useContext(AccordionContext) as any).value;

  const isOpen = openItems.includes(parentValue);

  return (
    <button
      onClick={() => toggleItem(parentValue)}
      className={cn(
        "flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:underline",
        className
      )}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
}

export function AccordionContent({
  children,
  className,
}: AccordionContentProps) {
  const { openItems } = React.useContext(AccordionContext);
  const parentValue = React.useContext(AccordionItemContext);

  const isOpen = openItems.includes(parentValue);

  return (
    <div
      className={cn(
        "overflow-hidden transition-all",
        isOpen ? "animate-accordion-down" : "animate-accordion-up hidden"
      )}
    >
      <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </div>
  );
}

// Context para pasar el value del item a sus hijos
const AccordionItemContext = React.createContext<string>("");

// Wrapper para AccordionItem que provee el contexto
const OriginalAccordionItem = AccordionItem;
export { OriginalAccordionItem as AccordionItemBase };

AccordionItem = ({ value, children }: AccordionItemProps) => {
  return (
    <AccordionItemContext.Provider value={value}>
      <OriginalAccordionItem value={value}>{children}</OriginalAccordionItem>
    </AccordionItemContext.Provider>
  );
};
