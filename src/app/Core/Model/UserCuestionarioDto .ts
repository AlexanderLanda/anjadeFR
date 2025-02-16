import { CuestionarioDto } from "./CuestionarioDto ";
import { UsuariosDto } from "./UsuariosDto";

export interface UserCuestionarioDto {
    id: number;
    usuario: UsuariosDto;
    cuestionario: CuestionarioDto;
    respuesta: string;
  }