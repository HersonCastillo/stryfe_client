import { Injectable } from '@angular/core';
import { CRUD, Reporte, Respuesta } from '../interfaces/ifs';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ReporteService implements CRUD<Reporte> {
    constructor(
        private http: HttpClient
    ){}
    crear(value: Reporte): Observable<Respuesta> {
        throw new Error("Method not implemented.");
    }
    modificar(value: Reporte): Observable<Respuesta> {
        throw new Error("Method not implemented.");
    }
    eliminar(value: Reporte): Observable<Respuesta> {
        throw new Error("Method not implemented.");
    }
    listar(reset: boolean): Observable<Reporte[]> {
        throw new Error("Method not implemented.");
    }
    obtener(value: Reporte): Observable<Reporte> {
        throw new Error("Method not implemented.");
    }
}
