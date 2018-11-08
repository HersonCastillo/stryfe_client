import { Component, OnInit } from '@angular/core';
import { Includes } from '../../../../utils/Includes';
import { EmpleadoService } from '../../../../services/empleado.service';
import { Usuario } from 'src/app/interfaces/usuario';

declare var $: any;
@Component({
    selector: 'app-employee-users',
    templateUrl: './employee-users.component.html',
    styleUrls: ['./employee-users.component.css']
})
export class EmployeeUsersComponent implements OnInit {
    constructor(
        private provider: EmpleadoService
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
        id_tipo_usuario: 2,
        password: "",
        token: undefined,
        genero: 0,
        verificado: 1
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

    public loggerNameLow: string = "empleado";
    public loggerNameUpp: string = "Empleado";

    ngOnInit() {
        this.load(false);
    }
    load(reset: boolean): void {
        this.provider.listar(reset).subscribe(u => {
            this.values = u.filter(user => user.id_tipo_usuario == 2);
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
    eliminar(val: Usuario): void {
        Includes.question("¡Espera un momento!", `¿Estás seguro de que quieres eliminar a '${val.nombre}'?`, () => {
            let alert: string = `Eliminando ${this.loggerNameLow}...`;
            this.loggerLocal.warnings.push(alert);
            this.provider.eliminar(val).subscribe(r => {
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
    editarModal(val: Usuario) {
        $(`#editar${this.loggerNameUpp}`).modal('show');
        this.editValue = val;
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
