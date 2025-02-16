import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


export interface LocalidadService {
  getLocalidades(): Observable<any>;
  }