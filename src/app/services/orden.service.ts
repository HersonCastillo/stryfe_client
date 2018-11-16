import { Injectable } from '@angular/core';
import { CRUD, Orden, Respuesta } from '../interfaces/ifs';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Globals } from './global.service';
@Injectable({
    providedIn: 'root'
})
export class OrdenService implements CRUD<Orden> {
    constructor(
        private http: HttpClient,
        private globals: Globals
    ){}
    crear(value: Orden): Observable<Respuesta> {
        return this.http.post<Respuesta>(`${this.globals.PATH}api/v1/orden`, value);
    }
    modificar(value: Orden): Observable<Respuesta> {
        throw new Error("Method not implemented.");
    }
    eliminar(value: Orden): Observable<Respuesta> {
        throw new Error("Method not implemented.");
    }
    listar(reset: boolean): Observable<Orden[]> {
        return this.http.get<Orden[]>(`${this.globals.PATH}api/v1/orden`);
    }
    obtener(value: Orden): Observable<Orden> {
        throw new Error("Method not implemented.");
    }
}
