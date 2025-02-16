import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


export interface EstadoUsuariosService {
  getAllEstadosUsuarios(): Observable<any>;
  }