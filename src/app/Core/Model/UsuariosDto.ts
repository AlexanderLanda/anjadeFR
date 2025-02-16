import { AfiliadosCategoriasDto } from "./AfiliadosCategoriasDto";
import { AfiliadosFuncionDto } from "./AfiliadosFuncionDto";
import { DeportesDto } from "./DeportesDto";
import { EstadosUsuariosDto } from "./EstadosUsuariosDto";
import { FederacionDto } from "./FederacionDto";
import { LocalidadDto } from "./LocalidadDto";
import { ProvinciaDto } from "./ProvinciaDto";
import { TipoDocumentoDto } from "./TipoDocumentoDto";
import { TipoPagoDto } from "./TipoPagosDto";
import { UsuariosRolDto } from "./UsuariosRolDto";

export interface    UsuariosDto {
    id_user: number;
    nombre: string;
    apellidos: string;
    fechaNacimiento: Date;
    direccion: string;
    correo: string;
    telefono: string;
    federacion: string;
    deporte: DeportesDto;
    localidad: string;
    documento: string;
    tipoDocumento: TipoDocumentoDto;
    tipoPago: TipoPagoDto;
    codigoPostal: string;
    provincia: ProvinciaDto;
    afiliadosFuncion: AfiliadosFuncionDto;
    afiliadosCategoria: AfiliadosCategoriasDto;
    usuariorol: UsuariosRolDto;
    estadoCuenta: EstadosUsuariosDto;
    situacionActual: string;
    observaciones: string;
    idAfiliacion: string;
    fechaAfiliacion: Date;
    selected?: boolean; // Propiedad para el checkbox
}