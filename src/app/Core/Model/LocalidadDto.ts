import { ProvinciaDto } from "./ProvinciaDto";

export interface LocalidadDto {
    id: number;
    descripcion: string;
    idProvincia: ProvinciaDto;
  }