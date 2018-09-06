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
}
