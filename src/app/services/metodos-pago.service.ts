import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from './global.service';
import { CRUD, Respuesta, MetodosPago } from '../interfaces/ifs';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class MetodosPagoService implements CRUD<MetodosPago> {
    crear(value: MetodosPago): Observable<Respuesta> {
        return this.http.post<Respuesta>(`${this.globals.PATH}api/v1/metodos`, value);
    }
    modificar(value: MetodosPago): Observable<Respuesta> {
        return this.http.put<Respuesta>(`${this.globals.PATH}api/v1/metodos`, value);
    }
    eliminar(value: MetodosPago): Observable<Respuesta> {
        throw new Error("Method not implemented.");
    }
    listar(reset?: boolean): Observable<MetodosPago[]> {
        throw new Error("Method not implemented.");
    }
    listarUnique(reset?: boolean): Observable<MetodosPago> {
        return this.http.get<MetodosPago>(`${this.globals.PATH}api/v1/metodos`);
    }
    misMetodos(): Observable<MetodosPago>{
        return this.http.get<MetodosPago>(`${this.globals.PATH}api/v1/metodos`);
    }
    obtener(value: MetodosPago): Observable<MetodosPago> {
        throw new Error("Method not implemented.");
    }
    constructor(
        private http: HttpClient,
        private globals: Globals
    ) { }
}
