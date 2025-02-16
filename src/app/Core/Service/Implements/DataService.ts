// Ejemplo de un servicio compartido para comunicación entre componentes
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSubject = new BehaviorSubject<boolean>(false);
  data$ = this.dataSubject.asObservable();

  constructor() {}

  updateData() {
    this.dataSubject.next(true);
  }
}
