import { Component, OnInit } from '@angular/core';
import { Includes } from '../../../utils/Includes';
import { Router } from '@angular/router';
import { Usuario, Mensajes, Reporte, Producto } from '../../../interfaces/ifs';
import { ProductoService } from '../../../services/producto.service';
import { MensajesService } from '../../../services/mensajes.service';
import { ReporteService } from '../../../services/reporte.service';
import { SocketService } from '../../../services/socket.service';
declare var $: any;
@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
    constructor(
        private socket: SocketService,
        private mensajesProvider: MensajesService,
        private productoProvider: ProductoService,
        private reporteProvider: ReporteService,
        private router: Router
    ) {}
    private _socket: any;
    public mensajes: Mensajes[] = [];
    public mensaje: Mensajes = null;
    public reporte: Reporte = {
        descripcion: "",
        id: undefined,
        id_cliente: undefined,
        id_producto: "none",
        id_tipo_reporte: 1
    }
    public productos: Producto[] = [];
    public employeeDate: Usuario;
    ngOnInit(){
        this.employeeDate = <Usuario>JSON.parse(atob(localStorage.getItem('u_data')));
        this._socket = this.socket.openConnection();
        if(this._socket){
            this.socket.recieve(this._socket, this.socket.SOCKET.MENSAJE, (d) => {
                this.mensajes.push(d);
            });
        } else {
            Includes.alert("¡Ups!", "No hay conexión de tiempo real disponible", "info");
        }
        this.productoProvider.listar(false).subscribe(l => {
            this.productos = l;
        }, err => {
            Includes.saveErrorLog(err);
            Includes.alert('¡Error!', "No se pueden listar los productos","error");
        });
        this.mensajesProvider.listarTodos().subscribe(r => {
            this.mensajes = r;
            if(r.length > 0) this.mensaje = this.mensajes[r.length - 1];
        }, err => {
            Includes.saveErrorLog(err);
            Includes.alert('¡Error!', "No se pueden listar los mensaje","error");
        });
    }
    canShow(): boolean {
        try{
            return this.mensaje != null;
        }catch(ex){
            return false;
        }
    }
    closesession(): void{
        Includes.question("¡Espera un momento!", "¿Estás seguro de que deseas cerrar sesión?", () => {
            localStorage.removeItem('token');
            localStorage.removeItem('u_data');
            this.router.navigate(['/login']);
        });
    }
    guardarGenerar(){
        if(this.canShow()){
            if(this.reporte.descripcion.trim().length > 0 && this.reporte.id_producto != 'none'){
                this.reporte.id_cliente = this.mensaje.id_usuario;
                this.reporteProvider.crear(this.reporte).subscribe(r => {
                    if(r.success){
                        $("#reporte").modal('hide');
                        Includes.alert("¡Bien!", "Reporte guardado", "success");
                    }else {
                        Includes.saveErrorLog(r.error);
                        Includes.alert('¡Error!', r.error || "No se pueden guardar los reportes","error");
                    }
                }, err => {
                    Includes.saveErrorLog(err);
                    Includes.alert('¡Error!', "No se pueden guardar los reportes","error");
                });
            } else Includes.alert(null, "La información no es correcta");
        }
    }
    generarModal(){
        $("#reporte").modal('show');
    }
    finalizarEstado(msj: Mensajes): void{
        if(this.canShow()){
            Includes.question("¡Espera!", "¿Cambiar el estado ya?", () => {
                msj.id_estado_mensaje = 1;
                this.mensajesProvider.modificar(msj).subscribe(r => {
                    if(r.error) Includes.alert("¡Error!", r.error, "warning");
                }, err => {
                    Includes.saveErrorLog(err);
                    Includes.alert('¡Error!', "No se pueden actualizar los mensaje","error");
                });
            });
        }
    }
    reduce(str: string): string{
        try{
            if(str.length < 10) return str;
            else return str.slice(0, 7).concat("...");
        }catch(ex){
            return "";
        }
    }
    show(msj: Mensajes): void{
        this.mensaje = msj;
    }
}
