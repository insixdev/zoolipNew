import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export type BaseCardProps = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  avatar?: string;
  verified?: boolean;
  status?: "active" | "inactive" | "pending" | "suspended";
  badges?: Array<{
    text: string;
    color: "blue" | "green" | "red" | "yellow" | "purple" | "gray";
  }>;
  stats?: Array<{
    label: string;
    value: string | number;
    color?: "blue" | "green" | "red" | "yellow" | "purple" | "gray";
  }>;
  actions?: Array<{
    label: string;
    icon?: LucideIcon;
    color: "primary" | "secondary" | "success" | "danger" | "warning";
    onClick: () => void;
  }>;
  metadata?: Array<{
    icon: LucideIcon;
    text: string;
  }>;
  onClick?: () => void;
  className?: string;
};

const colorClasses = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    hover: "hover:bg-blue-200",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-700",
    hover: "hover:bg-green-200",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-700",
    hover: "hover:bg-red-200",
  },
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    hover: "hover:bg-yellow-200",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    hover: "hover:bg-purple-200",
  },
  gray: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    hover: "hover:bg-gray-200",
  },
};

const actionColorClasses = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-gray-500 text-white hover:bg-gray-600",
  success: "bg-green-500 text-white hover:bg-green-600",
  danger: "bg-red-500 text-white hover:bg-red-600",
  warning: "bg-yellow-500 text-white hover:bg-yellow-600",
};

const statusColors = {
  active: "bg-green-500",
  inactive: "bg-gray-400",
  pending: "bg-yellow-500",
  suspended: "bg-red-500",
};

export default function BaseCard({
  id,
  title,
  subtitle,
  description,
  image,
  avatar,
  verified = false,
  status,
  badges = [],
  stats = [],
  actions = [],
  metadata = [],
  onClick,
  className = "",
}: BaseCardProps) {
  return (
    <Card
      className={`bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {/* Header Image */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Status and Verification */}
          <div className="absolute top-4 left-4 flex items-center gap-3">
            {avatar && (
              <div className="w-12 h-12 bg-white rounded-full p-1 shadow-lg">
                <img
                  src={avatar}
                  alt={`${title} avatar`}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            )}
            {verified && (
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                ✓ Verificado
              </div>
            )}
            {status && (
              <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
            )}
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
            {subtitle && <p className="text-white/90 text-sm">{subtitle}</p>}
          </div>
        </div>
      )}

      <CardContent className="p-6">
        {/* Title (if no image) */}
        {!image && (
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {avatar && (
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={avatar}
                    alt={`${title} avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                  {verified && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      ✓
                    </div>
                  )}
                  {status && (
                    <div
                      className={`w-2 h-2 rounded-full ${statusColors[status]}`}
                    />
                  )}
                </div>
                {subtitle && (
                  <p className="text-gray-600 text-sm">{subtitle}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {badges.map((badge, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium ${colorClasses[badge.color].bg} ${colorClasses[badge.color].text}`}
              >
                {badge.text}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        {stats.length > 0 && (
          <div
            className={`grid grid-cols-${Math.min(stats.length, 4)} gap-4 mb-4`}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className={`text-2xl font-bold ${stat.color ? colorClasses[stat.color].text : "text-gray-900"}`}
                >
                  {typeof stat.value === "number"
                    ? stat.value.toLocaleString()
                    : stat.value}
                </div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Metadata */}
        {metadata.length > 0 && (
          <div className="space-y-2 mb-4">
            {metadata.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <item.icon size={16} />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${actionColorClasses[action.color]} ${actions.length === 1 ? "flex-1" : ""}`}
              >
                {action.icon && <action.icon size={16} />}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
