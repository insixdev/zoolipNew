import {
  Heart,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import BaseCard, { type BaseCardProps } from "./BaseCard";

export type PetAdmin = {
  id: string;
  name: string;
  type: "dog" | "cat" | "other";
  breed: string;
  age: string;
  gender: "male" | "female";
  size: "small" | "medium" | "large";
  image: string;
  description: string;
  location: string;
  refugioName: string;
  refugioId: string;
  status: "available" | "adopted" | "pending" | "reserved" | "unavailable";
  vaccinated: boolean;
  sterilized: boolean;
  specialNeeds: boolean;
  adoptionFee: string;
  dateAdded: string;
  lastUpdated: string;
  views: number;
  likes: number;
  applications: number;
  verified: boolean;
};

type PetAdminCardProps = {
  pet: PetAdmin;
  onView?: (petId: string) => void;
  onEdit?: (petId: string) => void;
  onDelete?: (petId: string) => void;
  onToggleStatus?: (petId: string) => void;
  onViewApplications?: (petId: string) => void;
  showActions?: boolean;
};

const typeLabels = {
  dog: "Perro",
  cat: "Gato",
  other: "Otro",
};

const typeColors = {
  dog: "blue",
  cat: "purple",
  other: "gray",
} as const;

const statusLabels = {
  available: "Disponible",
  adopted: "Adoptado",
  pending: "Pendiente",
  reserved: "Reservado",
  unavailable: "No disponible",
};

const statusColors = {
  available: "green",
  adopted: "blue",
  pending: "yellow",
  reserved: "purple",
  unavailable: "red",
} as const;

const genderLabels = {
  male: "Macho",
  female: "Hembra",
};

const sizeLabels = {
  small: "Pequeño",
  medium: "Mediano",
  large: "Grande",
};

export default function PetAdminCard({
  pet,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewApplications,
  showActions = true,
}: PetAdminCardProps) {
  const baseCardProps: BaseCardProps = {
    id: pet.id,
    title: pet.name,
    subtitle: `${pet.breed} • ${pet.age}`,
    description: pet.description,
    image: pet.image,
    verified: pet.verified,
    status:
      pet.status === "available"
        ? "active"
        : pet.status === "adopted"
          ? "inactive"
          : pet.status === "pending"
            ? "pending"
            : "suspended",
    badges: [
      {
        text: typeLabels[pet.type],
        color: typeColors[pet.type],
      },
      {
        text: statusLabels[pet.status],
        color: statusColors[pet.status],
      },
      {
        text: genderLabels[pet.gender],
        color: pet.gender === "male" ? "blue" : "red",
      },
      {
        text: sizeLabels[pet.size],
        color: "gray",
      },
      ...(pet.vaccinated
        ? [
            {
              text: "Vacunado",
              color: "green" as const,
            },
          ]
        : []),
      ...(pet.sterilized
        ? [
            {
              text: "Esterilizado",
              color: "green" as const,
            },
          ]
        : []),
      ...(pet.specialNeeds
        ? [
            {
              text: "Necesidades especiales",
              color: "yellow" as const,
            },
          ]
        : []),
    ],
    stats: [
      {
        label: "Vistas",
        value: pet.views,
        color: "blue",
      },
      {
        label: "Me gusta",
        value: pet.likes,
        color: "red",
      },
      {
        label: "Solicitudes",
        value: pet.applications,
        color: "green",
      },
      {
        label: "Costo",
        value: pet.adoptionFee,
        color: "purple",
      },
    ],
    metadata: [
      {
        icon: MapPin,
        text: pet.location,
      },
      {
        icon: Shield,
        text: pet.refugioName,
      },
      {
        icon: Calendar,
        text: `Agregado: ${pet.dateAdded}`,
      },
      {
        icon: Heart,
        text: `Actualizado: ${pet.lastUpdated}`,
      },
    ],
    actions: showActions
      ? [
          {
            label: "Ver",
            icon: Eye,
            color: "secondary",
            onClick: () => onView?.(pet.id),
          },
          {
            label: "Editar",
            icon: Edit,
            color: "primary",
            onClick: () => onEdit?.(pet.id),
          },
          ...(pet.applications > 0
            ? [
                {
                  label: `Ver solicitudes (${pet.applications})`,
                  icon: Heart,
                  color: "success" as const,
                  onClick: () => onViewApplications?.(pet.id),
                },
              ]
            : []),
          {
            label:
              pet.status === "available"
                ? "Marcar no disponible"
                : "Marcar disponible",
            icon: pet.status === "available" ? XCircle : CheckCircle,
            color: pet.status === "available" ? "warning" : "success",
            onClick: () => onToggleStatus?.(pet.id),
          },
          {
            label: "Eliminar",
            icon: Trash2,
            color: "danger",
            onClick: () => onDelete?.(pet.id),
          },
        ]
      : [],
    onClick: () => onView?.(pet.id),
  };

  return <BaseCard {...baseCardProps} />;
}
