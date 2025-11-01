import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Trash2,
  Eye,
  Ban,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import BaseCard, { type BaseCardProps } from "./BaseCard";

export type UserAdmin = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  location?: string;
  joinDate: string;
  lastActivity: string;
  role: "user" | "moderator" | "admin";
  status: "active" | "inactive" | "suspended" | "pending";
  verified: boolean;
  totalPosts: number;
  totalAdoptions: number;
  totalReports: number;
  reportsAgainst: number;
  bio?: string;
};

type UserAdminCardProps = {
  user: UserAdmin;
  onView?: (userId: string) => void;
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
  onToggleStatus?: (userId: string) => void;
  onChangeRole?: (userId: string) => void;
  showActions?: boolean;
};

const roleColors = {
  user: "blue",
  moderator: "purple",
  admin: "red",
} as const;

const roleLabels = {
  user: "Usuario",
  moderator: "Moderador",
  admin: "Administrador",
};

export default function UserAdminCard({
  user,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onChangeRole,
  showActions = true,
}: UserAdminCardProps) {
  const baseCardProps: BaseCardProps = {
    id: user.id,
    title: user.name,
    subtitle: user.email,
    description: user.bio,
    avatar: user.avatar,
    verified: user.verified,
    status: user.status,
    badges: [
      {
        text: roleLabels[user.role],
        color: roleColors[user.role],
      },
      ...(user.reportsAgainst > 0
        ? [
            {
              text: `${user.reportsAgainst} reportes`,
              color: "red" as const,
            },
          ]
        : []),
      ...(user.totalReports > 5
        ? [
            {
              text: "Usuario activo",
              color: "green" as const,
            },
          ]
        : []),
    ],
    stats: [
      {
        label: "Publicaciones",
        value: user.totalPosts,
        color: "blue",
      },
      {
        label: "Adopciones",
        value: user.totalAdoptions,
        color: "green",
      },
      {
        label: "Reportes hechos",
        value: user.totalReports,
        color: "yellow",
      },
      {
        label: "Reportes recibidos",
        value: user.reportsAgainst,
        color: "red",
      },
    ],
    metadata: [
      ...(user.phone
        ? [
            {
              icon: Phone,
              text: user.phone,
            },
          ]
        : []),
      ...(user.location
        ? [
            {
              icon: MapPin,
              text: user.location,
            },
          ]
        : []),
      {
        icon: Calendar,
        text: `Miembro desde ${user.joinDate}`,
      },
      {
        icon: Shield,
        text: `Última actividad: ${user.lastActivity}`,
      },
    ],
    actions: showActions
      ? [
          {
            label: "Ver perfil",
            icon: Eye,
            color: "secondary",
            onClick: () => onView?.(user.id),
          },
          {
            label: "Editar",
            icon: Edit,
            color: "primary",
            onClick: () => onEdit?.(user.id),
          },
          ...(user.role !== "admin"
            ? [
                {
                  label: "Cambiar rol",
                  icon: Shield,
                  color: "warning" as const,
                  onClick: () => onChangeRole?.(user.id),
                },
              ]
            : []),
          {
            label: user.status === "active" ? "Suspender" : "Activar",
            icon: user.status === "active" ? Ban : CheckCircle,
            color: user.status === "active" ? "warning" : "success",
            onClick: () => onToggleStatus?.(user.id),
          },
          ...(user.role !== "admin"
            ? [
                {
                  label: "Eliminar",
                  icon: Trash2,
                  color: "danger" as const,
                  onClick: () => onDelete?.(user.id),
                },
              ]
            : []),
        ]
      : [],
    onClick: () => onView?.(user.id),
  };

  return <BaseCard {...baseCardProps} />;
}
