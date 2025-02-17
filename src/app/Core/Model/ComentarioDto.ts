export interface Comentario {
    id?: number;
    texto: string;
    idAfiliacion?: string;
    fechaComentario?: string;
    nombre?: String;
    [key: string]: any; // Permite cualquier propiedad de tipo string
  }
