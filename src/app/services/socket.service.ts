import { Injectable } from '@angular/core';
import { Globals } from './global.service'
declare var io: any;
@Injectable({
    providedIn: 'root'
})
export class SocketService {
    constructor(
        private globals: Globals
    ){}
    private url: string = this.globals.PATH;
    public SOCKET = {
        MENSAJE: 'mensaje'
    };
    openConnection(): any {
        return io.connect(this.url);
    }
    send(socket: any, to: string, data: any): void {
        socket.emit(to, data);
    }
    recieve(socket: any, from: string, fn: Function): void {
        socket.on(from, (d) => fn(d));
    }
}
