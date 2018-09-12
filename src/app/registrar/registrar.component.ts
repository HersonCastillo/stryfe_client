import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
declare var $: any;
@Component({
    selector: 'app-registrar',
    templateUrl: './registrar.component.html',
    styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
    constructor(
        private login: LoginService
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
                    console.log(r);
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
}
