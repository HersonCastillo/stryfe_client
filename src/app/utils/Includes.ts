import { Injectable } from '@angular/core';
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
}