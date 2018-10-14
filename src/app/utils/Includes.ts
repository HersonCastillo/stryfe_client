import { Injectable } from '@angular/core';
import swal from 'sweetalert';
import { isArray } from 'util';
import { Producto } from '../interfaces/ifs';

@Injectable({
    providedIn: 'root'
})

export class Includes {
    static NAMES = {
        ERROR_LOG: "logger",
        LISTA_DESEOS: "ldeseos"
    }
    static determinateAccess(type: number): string[] {
        switch (type) {
            case 1: return ['/admin'];
            case 2: return ['/employee'];
            case 3: return ['/me'];
            default: return ['/login'];
        }
    }
    static alert(title: string, message: string, type?: any, onSuccess?: Function): void {
        swal({
            title: title,
            text: message,
            icon: type || "info"
        }).then(() => {
            if (onSuccess) onSuccess();
        })
    }
    static question(title: string, message: string, onSuccess: Function, onCancel?: Function, isDanger?: boolean, onError?: Function): void {
        swal({
            title: title,
            text: message,
            dangerMode: isDanger || false,
            icon: "warning",
            buttons: ["Cancelar", "OK"]
        }).then(answer => {
            if (answer) onSuccess();
            else if (onCancel) onCancel();
        }).catch(() => {
            if (onError) onError();
            return;
        });
    }
    static saveErrorLog(error: any): void {
        let logger = sessionStorage.getItem(this.NAMES.ERROR_LOG);
        if (logger != undefined) {
            try {
                let parser = JSON.parse(logger);
                if (isArray(parser)) {
                    if (parser.length > 10) parser.pop();
                    parser.push(error);
                    sessionStorage.setItem(this.NAMES.ERROR_LOG, JSON.stringify(parser));
                } else Includes.cleanErrorLog();
            } catch (ex) {
                Includes.cleanErrorLog();
            }
        } else sessionStorage.setItem(this.NAMES.ERROR_LOG, JSON.stringify([].push(error)));
    }
    static cleanErrorLog(): void {
        let logger = sessionStorage.getItem(this.NAMES.ERROR_LOG);
        if (logger != undefined) sessionStorage.removeItem(this.NAMES.ERROR_LOG);
    }
    static validateText(val: string): boolean {
        return val && val.trim().length > 0;
    }
    static getEmail(): string {
        let user = localStorage.getItem('u_data');
        if (user) {
            try {
                let rawDecode = atob(user);
                let parsed = JSON.parse(rawDecode);
                return parsed.correo;
            } catch (ex) {
                Includes.saveErrorLog(ex);
                return null;
            }
        } return null;
    }
    static eliminarListaDeseos(): void {
        let deseos = localStorage.getItem(this.NAMES.LISTA_DESEOS);
        if (deseos) localStorage.removeItem(this.NAMES.LISTA_DESEOS);
    }
    static obtenerListaDeseos(): Array<Producto> {
        let deseos = localStorage.getItem(this.NAMES.LISTA_DESEOS);
        if (deseos) return <Producto[]>JSON.parse(deseos);
        return [];
    }
    static guardarProductoEnListaDeseos(prod: Producto): boolean {
        try {
            let deseos = localStorage.getItem(this.NAMES.LISTA_DESEOS);
            if (deseos) {
                let productos = <Array<Producto>>JSON.parse(deseos);
                let distincProductos = productos.filter(p => p.id == prod.id);
                if (distincProductos.length == 0) {
                    productos.push(prod);
                    localStorage.setItem(this.NAMES.LISTA_DESEOS, JSON.stringify(productos));
                    return true;
                }
                return false;
            } else {
                localStorage.setItem(this.NAMES.LISTA_DESEOS, JSON.stringify([prod]));
                return true;
            }
        } catch (ex) {
            return false;
        }
    }
    static quitarProductoDeListaDeseos(prod: Producto): boolean {
        try {
            let deseos = localStorage.getItem(this.NAMES.LISTA_DESEOS);
            if (deseos) {
                let productos = <Array<Producto>>JSON.parse(deseos);
                let distincProductos = productos.filter(p => p.id != prod.id);
                if (distincProductos.length == 0) {
                    localStorage.removeItem(this.NAMES.LISTA_DESEOS);
                    return true;
                }
                localStorage.setItem(this.NAMES.LISTA_DESEOS, JSON.stringify(distincProductos));
                return true;
            }
            return false;
        } catch (ex) {
            return false;
        }
    }
    static obtenerProductoDeListaDeseosPorId(prod: Producto): Producto {
        try {
            let deseos = localStorage.getItem(this.NAMES.LISTA_DESEOS);
            if (deseos) {
                let productos = <Array<Producto>>JSON.parse(deseos);
                let distincProductos = productos.filter(p => p.id == prod.id);
                if (distincProductos.length > 0) return distincProductos[0];
                return null;
            }
            return null;
        } catch (ex) {
            return null;
        }
    }
    static existeEnListaDeseos(prod: Producto): boolean {
        return this.obtenerProductoDeListaDeseosPorId(prod) != null;
    }
}