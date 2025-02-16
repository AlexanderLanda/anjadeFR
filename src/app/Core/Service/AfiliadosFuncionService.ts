import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


export interface AfiliadosFuncionService {
  getAfiliadosFuncion(): Observable<any>;
  }