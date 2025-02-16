import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UsuariosDto } from "../Model/UsuariosDto";


export interface UsuariosService {
    getUsuarios(): Observable<any>;

    validateEmail(email: string): Observable<boolean>;

    checkNumeroAfiliacionExists(numeroAfiliacion: string): Observable<boolean>;

    getUserById(id: number): Observable<UsuariosDto>;
  }