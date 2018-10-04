import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Globals } from './global.service';
import { Categoria } from '../interfaces/categoria';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class CategoriaService {
    constructor(
        private http: HttpClient,
        private globals: Globals
    ) { }
    public listarCategorias(): Observable<Categoria[]>{
        return this.http.get<Categoria[]>(`${this.globals.PATH}api/v1/categoria`);
    }
}
