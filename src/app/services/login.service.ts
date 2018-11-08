import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from './global.service';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(
        private http: HttpClient,
        private globals: Globals
    ){}
    public login(correo: string, password: string): Observable<any>{
        return this.http.post(this.globals.PATH + 'auth/login', {
            correo: correo,
            password: password
        });
    }
    public registrar(data: any): Observable<any>{
        return this.http.post(this.globals.PATH + 'auth/registrar', data);
    }
    public recuperar(email: string): Observable<any>{
        return this.http.post(`${this.globals.PATH}recuperar`, {
            correo: email
        });
    }
    public validar(email: string): Observable<any>{
        return this.http.post(`${this.globals.PATH}validar`, {
            correo: email
        });
    }
    public actualizarPassword(token: string, password: string): Observable<any>{
        return this.http.put(`${this.globals.PATH}public/recuperar`, {
            token: token,
            password: password
        });
    }
    public isAllowedUpdate(token: string): Observable<any>{
        return this.http.get(`${this.globals.PATH}public/recuperar/${token}`);
    }
}
