import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from './global.service';
import { Categoria } from '../interfaces/categoria';
import { Observable } from 'rxjs';
import { Respuesta } from '../interfaces/respuesta';

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
    public obtenerCategoria(categoria: Categoria): Observable<Categoria[]>{
        return this.http.get<Categoria[]>(`${this.globals.PATH}api/v1/categoria/${categoria.id}`);
    }
    public nuevaCategoria(categoria: Categoria): Observable<Respuesta>{
        return this.http.post<Respuesta>(`${this.globals.PATH}api/v1/categoria`, categoria);
    }
    public modificarCategoria(categoria: Categoria): Observable<Respuesta>{
        return this.http.put<Respuesta>(`${this.globals.PATH}api/v1/categoria`, categoria);
    }
    public eliminarCategoria(categoria: Categoria): Observable<Respuesta>{
        return this.http.delete<Respuesta>(`${this.globals.PATH}api/v1/categoria/${categoria.id}`);
    }
}
