import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from './global.service';
import { Color, Respuesta, CRUD } from '../interfaces/ifs';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ColorService implements CRUD {
    constructor(
        private http: HttpClient,
        private globals: Globals
    ) { }
    private colores: Color[];
    public listar(reset: boolean): Observable<Color[]>{
        if(!reset) if(this.colores != null) return of(this.colores);
        return this.http.get<Color[]>(`${this.globals.PATH}api/v1/color`).pipe(map(d => d), tap(nList => this.colores = nList));
    }
    public obtener(colores: Color): Observable<Color>{
        return this.http.get<Color>(`${this.globals.PATH}api/v1/color/${colores.id}`);
    }
    public crear(colores: Color): Observable<Respuesta>{
        return this.http.post<Respuesta>(`${this.globals.PATH}api/v1/color`, colores);
    }
    public modificar(colores: Color): Observable<Respuesta>{
        return this.http.put<Respuesta>(`${this.globals.PATH}api/v1/color`, colores);
    }
    public eliminar(colores: Color): Observable<Respuesta>{
        return this.http.delete<Respuesta>(`${this.globals.PATH}api/v1/color/${colores.id}`);
    }
}
