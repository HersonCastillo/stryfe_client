import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from './global.service';
import { Categoria } from '../interfaces/categoria';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Respuesta } from '../interfaces/respuesta';

@Injectable({
    providedIn: 'root'
})
export class CategoriaService {
    constructor(
        private http: HttpClient,
        private globals: Globals
    ) { }
    private categorias: Categoria[];
    public listar(reset: boolean): Observable<Categoria[]>{
        if(!reset) if(this.categorias != null) return of(this.categorias);
        return this.http.get<Categoria[]>(`${this.globals.PATH}api/v1/categoria`).pipe(map(d => d), tap(nList => this.categorias = nList));
    }
    public obtener(categoria: Categoria): Observable<Categoria>{
        return this.http.get<Categoria>(`${this.globals.PATH}api/v1/categoria/${categoria.id}`);
    }
    public crear(categoria: Categoria): Observable<Respuesta>{
        return this.http.post<Respuesta>(`${this.globals.PATH}api/v1/categoria`, categoria);
    }
    public modificar(categoria: Categoria): Observable<Respuesta>{
        return this.http.put<Respuesta>(`${this.globals.PATH}api/v1/categoria`, categoria);
    }
    public eliminar(categoria: Categoria): Observable<Respuesta>{
        return this.http.delete<Respuesta>(`${this.globals.PATH}api/v1/categoria/${categoria.id}`);
    }
}
