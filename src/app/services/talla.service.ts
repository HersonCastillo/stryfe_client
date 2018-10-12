import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from './global.service';
import { Talla, Respuesta, CRUD } from '../interfaces/ifs';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TallaService implements CRUD {
    constructor(
        private http: HttpClient,
        private globals: Globals
    ) { }
    private values: Talla[];
    public listar(reset: boolean): Observable<Talla[]>{
        if(!reset) if(this.values != null) return of(this.values);
        return this.http.get<Talla[]>(`${this.globals.PATH}api/v1/talla`).pipe(map(d => d), tap(nList => this.values = nList));
    }
    public obtener(val: Talla): Observable<Talla>{
        return this.http.get<Talla>(`${this.globals.PATH}api/v1/talla/${val.id}`);
    }
    public crear(val: Talla): Observable<Respuesta>{
        return this.http.post<Respuesta>(`${this.globals.PATH}api/v1/talla`, val);
    }
    public modificar(val: Talla): Observable<Respuesta>{
        return this.http.put<Respuesta>(`${this.globals.PATH}api/v1/talla`, val);
    }
    public eliminar(val: Talla): Observable<Respuesta>{
        return this.http.delete<Respuesta>(`${this.globals.PATH}api/v1/talla/${val.id}`);
    }
}
