import { Observable } from "rxjs";
import { Injectable } from "@angular/core";


export interface TipoDocumentacionService {
    getTipoDocumentacion(): Observable<any>;
  }