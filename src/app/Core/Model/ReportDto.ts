import { DeportesDto } from "./DeportesDto";
import { ProvinciaDto } from "./ProvinciaDto";

// report.model.ts
export interface ReportDto {
    id?: number;
    afiliacionId: string;
    nombre: string;
    apellidos: string;
    descripcion: string;
    attachments: File[];
    telefono: string;
    email: string;
    provincia: ProvinciaDto;
    deporte: DeportesDto;
    createDate: Date;
    referenciaReporte: string;
    isEditing?:any;


  }
  