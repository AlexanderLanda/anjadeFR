import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


export interface ProvinciasService {
    getProvincias(): Observable<any>;
  }