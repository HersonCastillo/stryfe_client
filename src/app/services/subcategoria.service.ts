import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from './global.service';
import { Subcategoria, Respuesta, CRUD } from '../interfaces/ifs';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SubcategoriaService implements CRUD {
    constructor(
        private http: HttpClient,
        private globals: Globals
    ){}
    private subcategorias: Subcategoria[];
    crear(value: Subcategoria): Observable<Respuesta> {
        return this.http.post<Respuesta>(`${this.globals.PATH}api/v1/subcategoria`, value);
    }
    modificar(value: Subcategoria): Observable<Respuesta> {
        return this.http.put<Respuesta>(`${this.globals.PATH}api/v1/subcategoria`, value);
    }
    eliminar(value: Subcategoria): Observable<Respuesta> {
        return this.http.delete<Respuesta>(`${this.globals.PATH}api/v1/subcategoria/${value.id}`);
    }
    listar(reset: boolean): Observable<Subcategoria[]> {
        if(!reset) if(this.subcategorias != null) return of(this.subcategorias);
        return this.http.get<Subcategoria[]>(`${this.globals.PATH}api/v1/subcategoria`).pipe(map(s => s), tap(nList => this.subcategorias = nList));
    }
    obtener(value: Subcategoria): Observable<Subcategoria> {
        return this.http.get<Subcategoria>(`${this.globals.PATH}api/v1/subcategoria/${value.id}`);
    }
}
