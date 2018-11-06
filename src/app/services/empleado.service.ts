import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from './global.service';
import { Usuario, Respuesta, CRUD } from '../interfaces/ifs';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class EmpleadoService implements CRUD<Usuario> {
    constructor(
        private http: HttpClient,
        private globals: Globals
    ){}
    private values: Usuario[];
    crear(value: Usuario): Observable<Respuesta> {
        return this.http.post<Respuesta>(`${this.globals.PATH}api/v1/usuario`, value);
    }
    modificar(value: Usuario): Observable<Respuesta> {
        return this.http.put<Respuesta>(`${this.globals.PATH}api/v1/usuario`, value);
    }
    eliminar(value: Usuario): Observable<Respuesta> {
        return this.http.delete<Respuesta>(`${this.globals.PATH}api/v1/usuario/${value.id}`);
    }
    listar(reset: boolean): Observable<Usuario[]> {
        if(!reset) if(this.values != null) return of(this.values);
        return this.http.get<Usuario[]>(`${this.globals.PATH}api/v1/usuario`).pipe(map(s => s), tap(nList => this.values = nList.filter(user => user.id_tipo_usuario == 2)));
    }
    obtener(value: Usuario): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.globals.PATH}api/v1/usuario/${value.id}`);
    }
}
