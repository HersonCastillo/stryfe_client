import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
declare var $: any;
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    constructor(
        private loginProvider: LoginService,
        private router: Router
    ){}
    public data = {
        correo: "",
        password: ""
    }
    public errors: Array<any> = [];
    public isLoad: boolean = false;
    ngOnInit(){
        $("title").text("Iniciar sesión");
    }
    login(): void{
        if(this.data.correo.length && this.data.password.length){
            this.isLoad = true;
            this.loginProvider.login(this.data.correo, this.data.password).subscribe(r => {
                this.isLoad = false;
                if(r.error){
                    this.errors.push(r.error);
                } else if(r.user && r.token){
                    this.errors = [];
                    localStorage.setItem('token', r.token);
                    localStorage.setItem('u_data', btoa(JSON.stringify(r.user)));
                    switch(r.user.id_tipo_usuario){
                        case 1: {
                            this.router.navigate(['admin']);
                            break;
                        }
                        case 2: {
                            //this.router.navigate(['employee', 'home']); Falta vista de empleado
                            break;
                        }
                        case 3: {
                            this.router.navigate(['me', 'home']);
                            break;
                        }
                    }
                }
            }, err => {
                this.isLoad = false;
                console.error(err);
                this.errors.push("Se encontró un error al conectarse con el servidor.");
            });
        }
    }
}
