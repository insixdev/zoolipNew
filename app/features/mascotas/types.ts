// tipos mascotas
export enum petSize  {
  small = "PEQUENIO",
  medium = "MEDIANO",
  large = "GRANDE",
}
export enum adoptionState {
  available = "DISPONIBLE",
  in_process = "EN_PROCESO",
  adopted = "ADOPTADO",
}
export enum healthState {
  healthy = "SALUDABLE",
  unhealthy = "ENFERMO",
  convalescent = "CONVALECIENTE",
  unknown = "UNKNOWN",
}
// POR AHORA AQUI
type id_institution = {
  id_institution: number
}
export type PetRequest = {
  size: petSize;
  adoptionState: adoptionState;
  healthState: healthState;
  age: number;
  race: string;
  species: string;
  id_institution: id_institution;
  name: string | null;
}
/*
 * reponse de update , delete , create
 * */
export type PetResponse = {
  status: string;
  httpCode: number;
  message: string;
}
export type PetUpdateRequest = {
  id: number;
  size: petSize;
  adoptionState: adoptionState;
  healthState: healthState;
  age: number;
  race: string;
  species: string;
  id_institution: id_institution;
  name: string | null;
}
/**
 * Response de getAll and getBy id of pets
 * */
export type PetGetByResponse= {
  id: number;
  size: petSize;
  adoptionState: adoptionState;
  healthState: healthState;
  age: number;
  race: string;
  species: string;
}

