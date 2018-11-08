import { Injectable } from '@angular/core';
import { CRUD, Reporte, Respuesta } from '../interfaces/ifs';
import { Observable } from 'rxjs';
import { Globals } from './global.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ReporteService implements CRUD<Reporte> {
    constructor(
        private http: HttpClient,
        private globals: Globals
    ){}
    crear(value: Reporte): Observable<Respuesta> {
        return this.http.post<Respuesta>(`${this.globals.PATH}api/v1/reporte`, value);
    }
    modificar(value: Reporte): Observable<Respuesta> {
        throw new Error("Method not implemented.");
    }
    eliminar(value: Reporte): Observable<Respuesta> {
        return this.http.delete<Respuesta>(`${this.globals.PATH}api/v1/reporte/${value.id}`);
    }
    listar(reset?: boolean): Observable<Reporte[]> {
        return this.http.get<Reporte[]>(`${this.globals.PATH}api/v1/reporte`);
    }
    obtener(value: Reporte): Observable<Reporte> {
        throw new Error("Method not implemented.");
    }
}
