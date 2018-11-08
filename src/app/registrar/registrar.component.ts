import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
declare var $: any;
@Component({
    selector: 'app-registrar',
    templateUrl: './registrar.component.html',
    styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
    constructor(
        private login: LoginService,
        private router: Router
    ) { }
    ngOnInit() {
        $("title").text("Registrarme en Stryfe");
    }
    public data = {
        nombre: "",
        apellido: "",
        correo: "",
        password: "",
        aceptar: false
    }
    public errors: Array<any> = [];
    registrar(): void{
        if(
            this.data.nombre.length &&
            this.data.apellido.length &&
            this.data.correo.length &&
            this.data.password.length
        ){
            if(this.data.aceptar){
                this.login.registrar(this.data).subscribe(r => {
                    if(r.error){
                        this.errors = [];
                        this.errors.push('Ocurrió un error al guardar. Verifica los datos.');
                    }else {
                        this.login.validar(this.data.correo).subscribe(r => {
                            if(r.success){
                                $("#modal-accept").modal({
                                    show: true,
                                    keyboard: false
                                });
                            } else {
                                this.errors.push("Error al enviar el correo de verificación al usuario");
                            }
                        }, err => {
                            this.errors.push("El servidor no puede enviar el correo de verificación al usuario");
                        });
                    }
                    //this.router.navigate(['login']);
                }, err => {
                    this.errors.push("Error al registrar el usuario");
                    console.error(err);
                });
            } else this.errors.push("Debes aceptar los términos y condiciones");
        } else{
            this.errors.pop();
            this.errors.push("Campos vacíos");
        }
    }
    goToLogin(): void{
        $("#modal-accept").modal({
            show: false
        });
        setTimeout(() => {
            this.router.navigate(['login']);
        }, 800);
    }
}
