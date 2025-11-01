import {
  MapPin,
  Phone,
  MessageCircle,
  Globe,
  Clock,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import BaseCard, { type BaseCardProps } from "./BaseCard";

export type RefugioAdmin = {
  id: string;
  name: string;
  description: string;
  image: string;
  logo?: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  established: string;
  animalsRescued: number;
  adoptionsCompleted: number;
  currentAnimals: number;
  specialties: string[];
  workingHours: string;
  verified: boolean;
  status: "active" | "inactive" | "pending" | "suspended";
  lastActivity: string;
  totalReports: number;
  rating: number;
};

type RefugioAdminCardProps = {
  refugio: RefugioAdmin;
  onView?: (refugioId: string) => void;
  onEdit?: (refugioId: string) => void;
  onDelete?: (refugioId: string) => void;
  onToggleStatus?: (refugioId: string) => void;
  onVerify?: (refugioId: string) => void;
  showActions?: boolean;
};

export default function RefugioAdminCard({
  refugio,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onVerify,
  showActions = true,
}: RefugioAdminCardProps) {
  const baseCardProps: BaseCardProps = {
    id: refugio.id,
    title: refugio.name,
    subtitle: refugio.location,
    description: refugio.description,
    image: refugio.image,
    avatar: refugio.logo,
    verified: refugio.verified,
    status: refugio.status,
    badges: [
      ...refugio.specialties.slice(0, 3).map((specialty) => ({
        text: specialty,
        color: "blue" as const,
      })),
      ...(refugio.specialties.length > 3
        ? [
            {
              text: `+${refugio.specialties.length - 3} más`,
              color: "gray" as const,
            },
          ]
        : []),
      ...(refugio.totalReports > 0
        ? [
            {
              text: `${refugio.totalReports} reportes`,
              color: "red" as const,
            },
          ]
        : []),
    ],
    stats: [
      {
        label: "Rescatados",
        value: refugio.animalsRescued,
        color: "blue",
      },
      {
        label: "Adoptados",
        value: refugio.adoptionsCompleted,
        color: "green",
      },
      {
        label: "Disponibles",
        value: refugio.currentAnimals,
        color: "purple",
      },
      {
        label: "Rating",
        value: `${refugio.rating}/5`,
        color: "yellow",
      },
    ],
    metadata: [
      {
        icon: MapPin,
        text: refugio.address,
      },
      {
        icon: Phone,
        text: refugio.phone,
      },
      {
        icon: Clock,
        text: refugio.workingHours,
      },
      {
        icon: Globe,
        text: `Desde ${refugio.established}`,
      },
    ],
    actions: showActions
      ? [
          {
            label: "Ver",
            icon: Eye,
            color: "secondary",
            onClick: () => onView?.(refugio.id),
          },
          {
            label: "Editar",
            icon: Edit,
            color: "primary",
            onClick: () => onEdit?.(refugio.id),
          },
          ...(refugio.status === "pending" && !refugio.verified
            ? [
                {
                  label: "Verificar",
                  icon: CheckCircle,
                  color: "success" as const,
                  onClick: () => onVerify?.(refugio.id),
                },
              ]
            : []),
          {
            label: refugio.status === "active" ? "Suspender" : "Activar",
            icon: refugio.status === "active" ? XCircle : CheckCircle,
            color: refugio.status === "active" ? "warning" : "success",
            onClick: () => onToggleStatus?.(refugio.id),
          },
          {
            label: "Eliminar",
            icon: Trash2,
            color: "danger",
            onClick: () => onDelete?.(refugio.id),
          },
        ]
      : [],
    onClick: () => onView?.(refugio.id),
  };

  return <BaseCard {...baseCardProps} />;
}
