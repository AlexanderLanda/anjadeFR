import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


export interface AfiliadosCategoriasService {
    getFederaciones(): Observable<any>;
  }