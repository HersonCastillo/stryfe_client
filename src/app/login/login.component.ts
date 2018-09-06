import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
declare var $: any;
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    constructor(
        private loginProvider: LoginService
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
                    console.log(r);
                }
            }, err => {
                this.isLoad = false;
                console.error(err);
            });
        }
    }
}
