import { Component, OnInit } from '@angular/core';
import { Includes } from '../../../utils/Includes';
import { Router } from '@angular/router';
import { Usuario, Mensajes } from '../../../interfaces/ifs';
import { MensajesService } from '../../../services/mensajes.service';
import { SocketService } from '../../../services/socket.service';
@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
    constructor(
        private socket: SocketService,
        private mensajesProvider: MensajesService,
        private router: Router
    ) {}
    private _socket: any;
    public mensajes: Mensajes[] = [];
    public mensaje: Mensajes;
    public employeeDate: Usuario;
    ngOnInit(){
        this.employeeDate = <Usuario>JSON.parse(atob(localStorage.getItem('u_data')));
        this._socket = this.socket.openConnection();
        if(this._socket){
            this.socket.recieve(this._socket, this.socket.SOCKET.MENSAJE, (d) => {
                this.mensajes.push(d);
                //this.socket.send(this._socket, this.socket.SOCKET.MENSAJE, d);
            });
        } else {
            Includes.alert("¡Ups!", "No hay conexión de tiempo real disponible", "info");
        }
        this.mensajesProvider.listarTodos().subscribe(r => {
            this.mensajes = r;
            this.mensaje = this.mensajes[0];
        }, err => {
            Includes.saveErrorLog(err);
            Includes.alert('¡Error!', "No se pueden listar los mensaje","error");
        });
    }
    closesession(): void{
        Includes.question("¡Espera un momento!", "¿Estás seguro de que deseas cerrar sesión?", () => {
            localStorage.removeItem('token');
            localStorage.removeItem('u_data');
            this.router.navigate(['/login']);
        });
    }
    generar(){
        
    }
    finalizarEstado(msj: Mensajes): void{
        Includes.question("¡Espera!", "¿Cambiar el estado ya?", () => {
            this.mensajesProvider.modificar(msj).subscribe(r => {
                if(r.error) Includes.alert("¡Error!", r.error, "warning");
            }, err => {
                Includes.saveErrorLog(err);
                Includes.alert('¡Error!', "No se pueden actualizar los mensaje","error");
            });
        });
    }
    reduce(str: string): string{
        if(str.length < 10) return str;
        else return str.slice(0, 7).concat("...");
    }
    show(msj: Mensajes): void{
        this.mensaje = msj;
    }
}
