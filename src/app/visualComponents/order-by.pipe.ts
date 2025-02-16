import { Pipe, PipeTransform } from '@angular/core';
import { Comentario } from 'src/app/Core/Model/ComentarioDto';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform(comentarios: Comentario[], field: string): Comentario[] {
    if (!comentarios || comentarios.length === 0) {
      return comentarios;
    }
    return comentarios.sort((a, b) => {
      return new Date(b[field]).getTime() - new Date(a[field]).getTime();
    });
  }
}
