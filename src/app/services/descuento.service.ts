import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from './global.service';
import { Descuento, Respuesta, CRUD } from '../interfaces/ifs';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DescuentoService implements CRUD<Descuento> {
    constructor(
        private http: HttpClient,
        private globals: Globals
    ){}
    private descuentos: Descuento[];
    private estados: Array<any>;
    crear(value: Descuento): Observable<Respuesta> {
        return this.http.post<Respuesta>(`${this.globals.PATH}api/v1/descuento`, value);
    }
    modificar(value: Descuento): Observable<Respuesta> {
        return this.http.put<Respuesta>(`${this.globals.PATH}api/v1/descuento`, value);
    }
    eliminar(value: Descuento): Observable<Respuesta> {
        return this.http.delete<Respuesta>(`${this.globals.PATH}api/v1/descuento/${value.id}`);
    }
    listar(reset: boolean): Observable<Descuento[]> {
        if(!reset) if(this.descuentos != null) return of(this.descuentos);
        return this.http.get<Descuento[]>(`${this.globals.PATH}api/v1/descuento`).pipe(map(s => s), tap(nList => this.descuentos = nList));
    }
    obtener(value: Descuento): Observable<Descuento> {
        return this.http.get<Descuento>(`${this.globals.PATH}api/v1/descuento/${value.id}`);
    }
    listarEstados(): Observable<any>{
        if(this.estados != null) return of(this.estados);
        return this.http.get(`${this.globals.PATH}api/v1/descuento/estados`).pipe(map(d => d), tap(nL => this.estados = nL));
    }
}
