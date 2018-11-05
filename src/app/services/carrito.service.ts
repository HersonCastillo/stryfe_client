import { Injectable } from '@angular/core';
import { CRUD, Carrito, Respuesta } from '../interfaces/ifs';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Globals } from './global.service';
@Injectable({
    providedIn: 'root'
})
export class CarritoService implements CRUD {
    constructor(
        private http: HttpClient,
        private globals: Globals
    ){}
    crear(value: Carrito): Observable<Respuesta>{
        return this.http.post<Respuesta>(`${this.globals.PATH}api/v1/carrito`, value);
    }
    eliminar(value: Carrito): Observable<Respuesta>{
        return this.http.delete<Respuesta>(`${this.globals.PATH}api/v1/carrito/${value.id}`);
    }
    listar(): Observable<Carrito[]>{
        return this.http.get<Carrito[]>(`${this.globals.PATH}api/v1/carrito`);
    }
    modificar(value: Carrito): Observable<Respuesta>{
        return this.http.put<Respuesta>(`${this.globals.PATH}api/v1/carrito`, value);
    }
    obtener(value: Carrito): Observable<Carrito>{
        return this.http.get<Carrito>(`${this.globals.PATH}api/v1/carrito/${value.id}`);
    }
}
