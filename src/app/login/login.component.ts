import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Includes } from '../utils/Includes';
declare var $: any;
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    constructor(
        private loginProvider: LoginService,
        private router: Router,
        private route: ActivatedRoute
    ){}
    public data = {
        correo: "",
        password: ""
    }
    public errors: Array<any> = [];
    public isLoad: boolean = false;
    ngOnInit(){
        $("title").text("Iniciar sesión");
        this.route.queryParams.subscribe(q => {
            let val = q['val'];
            if(val){
                Includes.alert("¡Bien!", "Cuenta verificada", "success", () => {
                    this.router.navigate(['/login']);
                });
            }
        });
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
                            localStorage.setItem('type', 'admin');
                            this.router.navigate(['admin']);
                            break;
                        }
                        case 2: {
                            localStorage.setItem('type', 'employee');
                            this.router.navigate(['employee']);
                            break;
                        }
                        case 3: {
                            localStorage.setItem('type', 'client');
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
    public email: string = "";
    recuperarModal(){
        this.email = "";
        $("#recuperar").modal('show');
    }
    public isLoadEmail: boolean = false;
    OK(){
        if(this.email.length > 0){
            this.isLoadEmail = true;
            this.loginProvider.recuperar(this.email).subscribe(e => {
                this.isLoadEmail = false;
                if(e.success){
                    Includes.alert("Confirmado", e.success, "info");
                    $("#recuperar").modal('hide');
                } else Includes.alert("¡Error!", e.error, "error");
            }, err => {
                this.isLoadEmail = false;
                Includes.alert("¡Error!", "No se puede enviar el correo", "error");
                Includes.saveErrorLog(err);
                this.email = "";
            });
        } else Includes.alert(null, "El correo electrónico es requerido");
    }
}
