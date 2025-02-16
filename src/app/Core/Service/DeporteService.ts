import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


export interface DeporteService {
    getDeportes(): Observable<any>;

    
  }