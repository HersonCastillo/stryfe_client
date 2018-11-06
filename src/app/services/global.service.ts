import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class Globals {
    constructor(){}
    private _PATH = "http://localhost:3500/";
    //private _PATH = "/";

    get PATH(){
        return this._PATH;
    }
}
