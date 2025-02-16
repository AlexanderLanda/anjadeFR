import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CuestionarioDto } from "../Model/CuestionarioDto ";


export interface CuestionarioService {
    getCuestionario(): Observable<CuestionarioDto[]>;
  }