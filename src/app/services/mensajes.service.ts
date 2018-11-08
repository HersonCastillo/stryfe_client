import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from './global.service';
import { Mensajes, Respuesta, CRUD } from '../interfaces/ifs';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class MensajesService implements CRUD<Mensajes> {

    constructor(
        private http: HttpClient,
        private globals: Globals
    ) { }
    public listar(reset?: boolean): Observable<Mensajes[]>{
        return this.http.get<Mensajes[]>(`${this.globals.PATH}api/v1/mensaje`);
    }
    public listarTodos(): Observable<Mensajes[]>{
        return this.http.get<Mensajes[]>(`${this.globals.PATH}api/v1/mensaje/todos`);
    }
    public obtener(val: Mensajes): Observable<Mensajes>{
        return this.http.get<Mensajes>(`${this.globals.PATH}api/v1/mensaje/${val.id}`);
    }
    public crear(val: Mensajes): Observable<Respuesta>{
        return this.http.post<Respuesta>(`${this.globals.PATH}api/v1/mensaje`, val);
    }
    public modificar(val: Mensajes): Observable<Respuesta>{
        return this.http.put<Respuesta>(`${this.globals.PATH}api/v1/mensaje`, val);
    }
    public eliminar(val: Mensajes): Observable<Respuesta>{
        return this.http.delete<Respuesta>(`${this.globals.PATH}api/v1/mensaje/${val.id}`);
    }
}
