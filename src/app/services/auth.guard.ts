import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Globals } from './global.service';
import { Includes } from '../utils/Includes';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardLogin implements CanActivate {
    constructor(
        private http: HttpClient,
        private globals: Globals,
        private router: Router
    ) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        try {
            return new Promise<boolean>((rs, rj) => {
                let token = localStorage.getItem('token');
                if (token == null) rs(true);
                else {
                    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
                    this.http.get<Usuario>(this.globals.PATH + 'auth/validate', { headers: headers }).subscribe(r => {
                        if (r != undefined) {
                            rs(false);
                            let type = Includes.determinateAccess(r.id_tipo_usuario);
                            this.router.navigate(type);
                        } else rs(true);
                    }, () => rs(true));
                }
            });
        } catch (ex) {
            return new Promise<boolean>((rs, rj) => {
                rs(true);
            });
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthGuardAdmin implements CanActivate {
    constructor(
        private http: HttpClient,
        private globals: Globals,
        private router: Router
    ) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        try {
            return new Promise<boolean>((rs, rj) => {
                let token = localStorage.getItem('token');
                if (token == null) {
                    rs(false);
                    this.router.navigate(['/login']);
                } else {
                    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
                    this.http.get<Usuario>(this.globals.PATH + 'auth/validate', { headers: headers }).subscribe(r => {
                        if (r != undefined && r.id_tipo_usuario == 1) rs(true);
                        else {
                            rs(false);
                            this.router.navigate(['/login']);
                        }
                    }, () => {
                        rs(false)
                        this.router.navigate(['/login']);
                    });
                }
            });
        } catch (ex) {
            return new Promise<boolean>((rs, rj) => {
                rs(false);
                this.router.navigate(['/login']);
            });
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthGuardClient implements CanActivate {
    constructor(
        private http: HttpClient,
        private globals: Globals,
        private router: Router
    ) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
            try {
                return new Promise<boolean>((rs, rj) => {
                    let token = localStorage.getItem('token');
                    if (token == null) {
                        rs(false);
                        this.router.navigate(['/login']);
                    } else {
                        let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
                        this.http.get<Usuario>(this.globals.PATH + 'auth/validate', { headers: headers }).subscribe(r => {
                            if (r != undefined && r.id_tipo_usuario == 3) rs(true);
                            else {
                                rs(false);
                                this.router.navigate(['/login']);
                            }
                        }, () => {
                            rs(false)
                            this.router.navigate(['/login']);
                        });
                    }
                });
            } catch (ex) {
                return new Promise<boolean>((rs, rj) => {
                    rs(false);
                    this.router.navigate(['/login']);
                });
            }
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthGuardEmployee implements CanActivate {
    constructor(
        private http: HttpClient,
        private globals: Globals,
        private router: Router
    ) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
            try {
                return new Promise<boolean>((rs, rj) => {
                    let token = localStorage.getItem('token');
                    if (token == null) {
                        rs(false);
                        this.router.navigate(['/login']);
                    } else {
                        let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
                        this.http.get<Usuario>(this.globals.PATH + 'auth/validate', { headers: headers }).subscribe(r => {
                            if (r != undefined && r.id_tipo_usuario == 2) rs(true);
                            else {
                                rs(false);
                                this.router.navigate(['/login']);
                            }
                        }, () => {
                            rs(false)
                            this.router.navigate(['/login']);
                        });
                    }
                });
            } catch (ex) {
                return new Promise<boolean>((rs, rj) => {
                    rs(false);
                    this.router.navigate(['/login']);
                });
            }
    }
}
