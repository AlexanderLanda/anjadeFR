import { Comentario } from "./ComentarioDto";

export interface Noticia {
    id?: number;
    titulo: string;
    linkOriginal: string;
    imagenes: any[];
    fechaInsercion?: Date;
    tipo: 'PARTICULAR' | 'GENERAL'| 'INCIDENCIAS';
    comentarios?: Comentario[]; // Lista de comentarios asociados a la noticia (puede ser opcional)
    ultimoComentario?: Comentario; // Último comentario agregado (optimización para la vista)
    mostrarFormulario?: boolean; // Controla si el formulario para agregar comentario está visible
    nuevoComentario?: string; // Almacena el texto del nuevo comentario que se está escribiendo
    idAfiliacion?: string; // Número de afiliación ingresado para identificar al usuario que comenta
  }