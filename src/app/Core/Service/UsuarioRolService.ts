import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


export interface UsuarioRolService {
    getUsuariosRoles(): Observable<any>;
  }