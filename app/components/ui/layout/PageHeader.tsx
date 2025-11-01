import { Link } from "react-router";
import { ArrowLeft, LucideIcon } from "lucide-react";

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  backTo?: string;
  backLabel?: string;
  compact?: boolean;
  gradient?: boolean;
  actions?: React.ReactNode;
};

export default function PageHeader({
  title,
  description,
  icon: Icon,
  backTo,
  backLabel = "Volver",
  compact = false,
  gradient = false,
  actions,
}: PageHeaderProps) {
  const iconSize = compact ? 24 : 32;
  const iconContainerSize = compact ? "w-12 h-12" : "w-16 h-16";
  const titleSize = compact ? "text-2xl" : "text-4xl";
  const descriptionSize = compact ? "text-base" : "text-xl";
  const spacing = compact ? "mb-6" : "mb-10";

  return (
    <div className={`${spacing} text-center`}>
      {backTo && (
        <div className="flex items-center gap-4 mb-4">
          <Link
            to={backTo}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">{backLabel}</span>
          </Link>
          {actions && <div className="ml-auto">{actions}</div>}
        </div>
      )}

      {Icon && (
        <div
          className={`inline-flex items-center justify-center ${iconContainerSize} bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl ${compact ? "mb-4 shadow-md" : "mb-6 shadow-lg"}`}
        >
          <Icon className="text-white" size={iconSize} />
        </div>
      )}

      <h1
        className={`${titleSize} font-bold ${gradient ? "bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent" : "text-gray-900"} ${compact ? "mb-2" : "mb-4"}`}
      >
        {title}
      </h1>

      {description && (
        <p className={`${descriptionSize} text-gray-600 max-w-3xl mx-auto`}>
          {description}
        </p>
      )}
    </div>
  );
}
