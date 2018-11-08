import { Component, OnInit } from '@angular/core';
import { Includes } from '../../../../utils/Includes';
import { SocketService } from '../../../../services/socket.service';
import { MensajesService } from '../../../../services/mensajes.service';
import { Mensajes, Usuario } from '../../../../interfaces/ifs';
@Component({
    selector: 'app-reportar-chat',
    templateUrl: './reportar-chat.component.html',
    styleUrls: ['./reportar-chat.component.css']
})
export class ReportarChatComponent implements OnInit {
    constructor(
        private mensajesProvider: MensajesService,
        private socket: SocketService
    ) { }
    private _socket: any;
    public mensajes: Mensajes[] = [];
    public mensaje: string = "";
    public user: Usuario;
    ngOnInit() {
        this._socket = this.socket.openConnection();
        this.user = <Usuario>JSON.parse(atob(localStorage.getItem('u_data')));
        this.mensajesProvider.listar().subscribe(r => {
            this.mensajes = r;
        }, err => {
            Includes.saveErrorLog(err);
            Includes.alert("¡Error!", "No se pueden obtener los mensajes", "error");
        });
    }
    enviar(){
        let mensaje = this.mensaje.trim();
        if(mensaje.length > 0){
            let msj: Mensajes = {
                id_estado_mensaje: 2,
                mensaje: mensaje
            }
            this.mensajesProvider.crear(msj).subscribe(m => {
                if(m.success){
                    this.socket.send(this._socket, this.socket.SOCKET.MENSAJE, m.mensaje);
                    this.mensajes.push(msj);
                    this.mensaje = "";
                } else {
                    Includes.alert("!Error¡", m.error || "Mensaje no enviado", "warning");
                }
            }, err => {
                Includes.saveErrorLog(err);
                Includes.alert("¡Error!", "No se pueden crear el mensaje", "error");
            });
        }
    }
}
