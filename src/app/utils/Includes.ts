import { Injectable } from '@angular/core';
import swal from 'sweetalert';
import { isArray } from 'util';

@Injectable({
    providedIn: 'root'
})

export class Includes {
    static determinateAccess(type: number): string[]{
        switch(type){
            case 1: return ['/admin'];
            case 2: return ['/employee'];
            case 3: return ['/me'];
            default: return ['/login'];
        }
    }
    static alert(title: string, message: string, type?: any, onSuccess?: Function): void{
        swal({
            title: title,
            text: message,
            icon: type || "info"
        }).then(() => {
            if(onSuccess) onSuccess();
        })
    }
    static question(title: string, message: string, onSuccess: Function, onCancel?: Function, isDanger?: boolean, onError?: Function): void{
        swal({
            title: title,
            text: message,
            dangerMode: isDanger || false,
            icon: "warning",
            buttons: ["Cancelar", "OK"]
        }).then(answer => {
            if(answer) onSuccess();
            else if(onCancel) onCancel();
        }).catch(() => {
            if(onError) onError();
            return;
        });
    }
    static saveErrorLog(error: any): void{
        let logger = sessionStorage.getItem('logger');
        if(logger != undefined){
            try{
                let parser = JSON.parse(logger);
                if(isArray(parser)){
                    if(parser.length > 10) parser.pop();
                    parser.push(error);
                    sessionStorage.setItem("logger", JSON.stringify(parser));
                } else Includes.cleanErrorLog();
            }catch(ex){
                Includes.cleanErrorLog();
            }
        } else sessionStorage.setItem('logger', JSON.stringify([].push(error)));
    }
    static cleanErrorLog(): void{
        let logger = sessionStorage.getItem('logger');
        if(logger != undefined) sessionStorage.removeItem('logger');
    }
    static validateText(val: string): boolean{
        return val && val.trim().length > 0;
    }
}