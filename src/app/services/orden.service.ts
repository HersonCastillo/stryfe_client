import { Injectable } from '@angular/core';
import { CRUD, Orden, Respuesta } from '../interfaces/ifs';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class OrdenService implements CRUD<Orden> {
    constructor(
        private http: HttpClient
    ){}
    crear(value: Orden): Observable<Respuesta> {
        throw new Error("Method not implemented.");
    }
    modificar(value: Orden): Observable<Respuesta> {
        throw new Error("Method not implemented.");
    }
    eliminar(value: Orden): Observable<Respuesta> {
        throw new Error("Method not implemented.");
    }
    listar(reset: boolean): Observable<Orden[]> {
        throw new Error("Method not implemented.");
    }
    obtener(value: Orden): Observable<Orden> {
        throw new Error("Method not implemented.");
    }
}
