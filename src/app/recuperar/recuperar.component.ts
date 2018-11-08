import { Component, OnInit } from '@angular/core';
import { Includes } from '../utils/Includes';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
@Component({
    selector: 'app-recuperar',
    templateUrl: './recuperar.component.html',
    styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent implements OnInit {
    constructor(
        private loginProvider: LoginService,
        private router: Router,
        private route: ActivatedRoute
    ) { }
    public isAllowed: boolean = true;
    public pass = {
        password: "",
        confirm: ""
    }
    private token: string = "";
    public isLoad: boolean = false;
    ngOnInit(){
        this.route.params.subscribe(p => {
            this.token = p['token'];
            this.loginProvider.isAllowedUpdate(this.token).subscribe(r => {
                if(r.ok && r.ok == 1){
                    this.isAllowed = true;
                    this.pass.password = "";
                    this.pass.confirm = "";
                } else {
                    this.isAllowed = false;
                    Includes.alert("¡Un problema!", "No se encuentra esta cuenta en nuestros servidores.");
                    this.router.navigate(['/login']);
                }
            }, err => {
                Includes.saveErrorLog(err);
                Includes.alert(null, "No se puede recuperar esta cuenta.");
                this.router.navigate(['/login']);
            });
        });
    }
    recuperar(): void{
        if(this.pass.password.length > 0){
            if(this.pass.password.trim() == this.pass.confirm.trim()){
                Includes.question("¡Espera!", "¿Estás seguro de que quieres guardar esta configuración?", () => {
                    this.isLoad = true;
                    this.loginProvider.actualizarPassword(this.token, this.pass.password).subscribe(r => {
                        this.isLoad = false;
                        if(r.success){
                            Includes.alert("¡Bien!", r.success);
                            this.router.navigate(['/login']);
                            this.pass.password = "";
                            this.pass.confirm = "";
                        } else {
                            Includes.alert("¡Error!", r.error || "No se puede guardar esta contraseña");
                            this.pass.password = "";
                            this.pass.confirm = "";
                        }
                    }, err => {
                        Includes.saveErrorLog(err);
                        Includes.alert(null, "No se puede recuperar esta cuenta.");
                    });
                }, null, true);
            } else Includes.alert(null, "Las contraseña no son iguales");
        } else Includes.alert(null, "La contraseña no puede ser nula");
    }
}
