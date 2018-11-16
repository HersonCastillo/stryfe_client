import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class Globals {
    constructor(){}
    private _PATH_DEVELOPMENT = "http://localhost:3500/";
    private _PATH_PRODUCTION = "/";

    get PATH(){
        return (environment.production) ? this._PATH_PRODUCTION : this._PATH_DEVELOPMENT;
    }
}
