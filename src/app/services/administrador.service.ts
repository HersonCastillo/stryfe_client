import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from './global.service';
import { Usuario, Respuesta, CRUD } from '../interfaces/ifs';
import { Observable, of } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AdministradorService {
    constructor(
        private http: HttpClient,
        private globals: Globals
    ){}
    private administradores: Usuario[];
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
        if(!reset) if(this.administradores != null) return of(this.administradores);
        return this.http.get<Usuario[]>(`${this.globals.PATH}api/v1/usuario`).pipe(map(s => s), tap(nList => this.administradores = nList.filter(user => user.id_tipo_usuario == 1)));
    }
    obtener(value: Usuario): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.globals.PATH}api/v1/usuario/${value.id}`);
    }
}
