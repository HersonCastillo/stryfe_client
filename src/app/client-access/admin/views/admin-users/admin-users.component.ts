import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Includes } from '../../../../utils/Includes';
import { AdministradorService } from '../../../../services/administrador.service';
import { Usuario } from 'src/app/interfaces/usuario';

declare var $: any;
@Component({
    selector: 'app-admin-users',
    templateUrl: './admin-users.component.html',
    styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
    constructor(
        private provider: AdministradorService,
        private router: Router
    ) { }
    public loggerLocal = {
        errors: [],
        warnings: [],
        success: []
    };
    public value: Usuario = {
        nombre: "",
        apellido: "",
        correo: "",
        id: undefined,
        id_tipo_usuario: 1,
        password: "",
        token: undefined,
        genero: 0,
        verificado: 0
    };
    public editValue: Usuario = {
        nombre: "",
        apellido: "",
        correo: "",
        id: undefined,
        id_tipo_usuario: 1,
        password: "",
        token: undefined
    }

    public values: Array<Usuario> = [];
    public auxValues: Array<Usuario> = [];
    public search: string = "";

    public loggerNameLow: string = "administrador";
    public loggerNameUpp: string = "Administrador";

    itsMe(admin: Usuario): boolean {
        let user = localStorage.getItem('u_data');
        if (user) {
            try {
                let rawDecode = atob(user);
                let parsed = <Usuario>JSON.parse(rawDecode);
                return parsed.id == admin.id;
            } catch (ex) {
                Includes.saveErrorLog(ex);
                return true;
            }
        } return true;
    }
    ngOnInit() {
        this.load(false);
    }
    load(reset: boolean): void {
        this.provider.listar(reset).subscribe(u => {
            this.values = u;
            if (!localStorage.getItem('u_data')) {
                this.values = [];
                this.loggerLocal.warnings.push("No se puede obtener tu información.");
                this.loggerLocal.errors.push("Debes iniciar sesión otra vez.");
                localStorage.removeItem('u_data');
                localStorage.removeItem('token');
            }
        }, e => {
            Includes.saveErrorLog(e);
            this.loggerLocal.errors.push("No se puede obtener la lista. [GET:All]");
        });
    }
    crear(): void {
        if (
            Includes.validateText(this.value.nombre) &&
            Includes.validateText(this.value.apellido) &&
            Includes.validateText(this.value.correo) &&
            Includes.validateText(this.value.password)
        ) {
            let alert: string = `Guardando ${this.loggerNameLow}...`;
            this.loggerLocal.warnings.push(alert);
            this.provider.crear(this.value).subscribe(r => {
                this.removeAlert(alert, 'warnings');
                $(`#crear${this.loggerNameUpp}`).modal('hide');
                if (r.success) {
                    this.loggerLocal.success.push(`El ${this.loggerNameLow} se guardó con éxito.`);
                    this.load(true);
                } else {
                    if (r.error) this.loggerLocal.errors.push(r.error);
                    else this.loggerLocal.warnings.push("Ocurrió un error al guardar.");
                }
            }, e => {
                Includes.saveErrorLog(e);
                this.loggerLocal.errors.push("No se puede guardar. [POST:Inidividual]");
                this.removeAlert(alert, 'warnings');
            });
        } else this.loggerLocal.warnings.push("Los datos de guardado no son correctos.");
    }
    crearModal(): void {
        $(`#crear${this.loggerNameUpp}`).modal('show');
    }
    eliminar(admin: Usuario): void {
        Includes.question("¡Espera un momento!", `¿Estás seguro de que quieres eliminar a '${admin.nombre}'?`, () => {
            let alert: string = `Eliminando ${this.loggerNameLow}...`;
            this.loggerLocal.warnings.push(alert);
            this.provider.eliminar(admin).subscribe(r => {
                this.removeAlert(alert, 'warnings');
                if (r.success) {
                    this.loggerLocal.success.push(`El ${this.loggerNameLow} se eliminó con éxito.`);
                    this.load(true);
                } else {
                    if (r.error) this.loggerLocal.errors.push(r.error);
                    else this.loggerLocal.warnings.push("Ocurrió un error al eliminar.");
                }
            }, e => {
                Includes.saveErrorLog(e);
                this.loggerLocal.errors.push("No se puede eliminar. [DELETE:Inidividual]");
                this.removeAlert(alert, 'warnings');
            });
        }, null, true);
    }
    editar(): void {
        if (
            Includes.validateText(this.editValue.nombre) &&
            Includes.validateText(this.editValue.apellido) &&
            Includes.validateText(this.editValue.correo) &&
            Includes.validateText(this.editValue.password)
        ) {
            let alert: string = `Guardando ${this.loggerNameLow}...`;
            this.loggerLocal.warnings.push(alert);
            this.provider.modificar(this.editValue).subscribe(r => {
                this.removeAlert(alert, 'warnings');
                $(`#editar${this.loggerNameUpp}`).modal('hide');
                if (r.success) {
                    this.loggerLocal.success.push(`El ${this.loggerNameLow} se guardó con éxito.`);
                    this.load(true);
                    setTimeout(() => {
                        if (this.itsMe(this.editValue)) {
                            sessionStorage.setItem('renoval', JSON.stringify({
                                icon: 'success',
                                text: 'Datos actualizados',
                                title: '¡Perfecto!',
                                userId: Includes.getEmail()
                            }));
                            localStorage.removeItem('token');
                            localStorage.removeItem('u_data');
                            Includes.alert("Actualización detectada",
                                "Se detectó un cambio de datos de la sesión actual, se procederá a cerrar la sesión debido a nuestras políticas de seguridad. Vuelve a iniciar sesión.",
                                "info", () => setTimeout(() => this.router.navigate(['/login']), 500));
                        }
                    }, 1000);
                } else {
                    if (r.error) this.loggerLocal.errors.push(r.error);
                    else this.loggerLocal.warnings.push("Ocurrió un error al guardar.");
                }
            }, e => {
                Includes.saveErrorLog(e);
                this.loggerLocal.errors.push("No se puede guardar. [PUT:Inidividual]");
                this.removeAlert(alert, 'warnings');
            });
        } else this.loggerLocal.warnings.push("Los datos de edición no son correctos.");
    }
    editarModal(admin: Usuario) {
        $(`#editar${this.loggerNameUpp}`).modal('show');
        this.editValue = admin;
        this.editValue.password = "";
    }
    removeAlert(alert: string, listArr: string): void {
        try {
            this.loggerLocal[listArr] = this.loggerLocal[listArr].filter(r => r != alert);
        } catch (ex) {
            Includes.saveErrorLog(ex);
        }
    }
    searchEvent(event): void{
        if(this.auxValues.length == 0)
            if(this.search.length == 1)
                this.auxValues = this.values;
        if(this.auxValues.length > 0)
            if(this.search.length == 0){
                this.values = this.auxValues;
                this.auxValues = [];
            }
        if(this.auxValues.length == 0 && this.values.length == 0)
            this.load(false);
        if(event.target.value === "")
            this.load(false);
        this.values = this.values.filter(res => 
            res.nombre.toLowerCase().indexOf(this.search.toLowerCase().trim()) >= 0 || 
            res.apellido.toLowerCase().indexOf(this.search.toLowerCase().trim()) >= 0 || 
            res.correo.toLowerCase().indexOf(this.search.toLowerCase().trim()) >= 0
        );
    }
}
