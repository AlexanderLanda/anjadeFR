import { DeportesDto } from "./DeportesDto";
import { ProvinciaDto } from "./ProvinciaDto";

// report.model.ts
export interface ReportDto {
    afiliacionId: string;
    nombre: string;
    apellidos: string;
    descripcion: string;
    attachments: File[];
    telefono: string;
    email: string;
    provincia: ProvinciaDto;
    deporte: DeportesDto;
  }
  