import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from './global.service';
import { Producto, Respuesta, CRUD } from '../interfaces/ifs';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductoService {
    constructor(
        private http: HttpClient,
        private globals: Globals
    ){}
    private productos: Producto[];
    crear(value: Producto): Observable<Respuesta> {
        return this.http.post<Respuesta>(`${this.globals.PATH}api/v1/producto`, value);
    }
    modificar(value: Producto): Observable<Respuesta> {
        return this.http.put<Respuesta>(`${this.globals.PATH}api/v1/producto`, value);
    }
    eliminar(value: Producto): Observable<Respuesta> {
        return this.http.delete<Respuesta>(`${this.globals.PATH}api/v1/producto/${value.id}`);
    }
    listar(reset: boolean): Observable<Producto[]> {
        if(!reset) if(this.productos != null) return of(this.productos);
        return this.http.get<Producto[]>(`${this.globals.PATH}api/v1/producto`).pipe(map(s => s), tap(nList => this.productos = nList));
    }
    obtener(value: Producto): Observable<Producto> {
        return this.http.get<Producto>(`${this.globals.PATH}api/v1/producto/${value.id}`);
    }
}
