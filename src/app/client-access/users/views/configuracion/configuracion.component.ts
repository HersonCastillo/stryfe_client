import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../../interfaces/usuario';
import { Includes } from '../../../../utils/Includes';
import { Router } from '@angular/router';
import { AdministradorService } from '../../../../services/administrador.service';
@Component({
    selector: 'app-configuracion',
    templateUrl: './configuracion.component.html',
    styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
    constructor(
        private administradorProvider: AdministradorService,
        private router: Router
    ) {}
    public usuario: Usuario = {
        nombre: "",
        apellido: "",
        correo: "",
        direccion: "",
        dui: "",
        fecha_nac: new Date(),
        genero: 1,
        img: "",
        password: "",
        telefono: ""
    }
    public isLoad: boolean = false;
    ngOnInit(){
        let user = <Usuario>JSON.parse(atob(localStorage.getItem('u_data')));
        this.administradorProvider.obtener(user).subscribe(r => {
            this.usuario = r;
            this.usuario.direccion = r.direccion || "";
            this.usuario.fecha_nac = new Date(this.usuario.fecha_nac) || new Date();
        }, err => {
            Includes.saveErrorLog(err);
            Includes.alert("¡Error!", "No se puede obtener la información del usuario", "error");
        });
    }
    get isAllowed(){
        try{
            return (
                this.usuario.nombre.length == 0 ||
                this.usuario.apellido.length == 0 ||
                this.usuario.correo.length == 0 ||
                this.usuario.dui.length == 0 ||
                this.usuario.telefono.length == 0 ||
                this.usuario.genero == 0 ||
                this.usuario.direccion.length == 0
            );
        }catch(ex){
            return true;
        }
    }
    save(){
        if(!this.isAllowed){
            let date = new Date(this.usuario.fecha_nac);
            let min = new Date();
            min.setDate(1);
            min.setMonth(min.getMonth() - 216);
            if(date <= min){
                let regex01 = /^[\d]{8}-[\d]{1}$/g;
                let regex02 = /^[267][\d]{3}-[\d]{4}$/g;
                let regex03 = /^([\S][\s]?){10,100}$/gim;
                if(regex01.exec(this.usuario.dui.trim())){
                    if(regex02.exec(this.usuario.telefono.trim())){
                        if(regex03.exec(this.usuario.direccion.trim())){
                            this.isLoad = true;
                            this.administradorProvider.modificar(this.usuario).subscribe(r => {
                                this.isLoad = false;
                                if(r.success){
                                    Includes.alert("¡Bien!", "Datos actualizados, vuelve a iniciar sesión para refrescar.");
                                    localStorage.removeItem('u_data');
                                    localStorage.removeItem('token');
                                    this.router.navigate(['/login']);
                                } else {
                                    if (r.error) Includes.alert("¡Error!", r.error);
                                    else Includes.alert("¡Ups!", "No se puede cambiar la configuración.");
                                }
                            }, err => {
                                Includes.saveErrorLog(err);
                                Includes.alert("¡Error!", "No se puede guardar la información");
                                this.isLoad = false;
                            });
                        } else Includes.alert(null, "La dirección no es válida");
                    } else Includes.alert(null, "El teléfono no es válido");
                } else Includes.alert(null, "El DUI no es válido");
            } else Includes.alert("...", "La fecha no es válida");
        } else Includes.alert("¡Espera un momento!", "La información no está completa");
    }
}
