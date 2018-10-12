import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Includes } from '../../../../utils/Includes';
import { TallaService } from '../../../../services/talla.service';
import { Talla } from 'src/app/interfaces/talla';

declare var $: any;
@Component({
    selector: 'app-talla',
    templateUrl: './talla.component.html',
    styleUrls: ['./talla.component.css']
})
export class TallaComponent implements OnInit {
    constructor(
        private provider: TallaService,
        private router: Router
    ) { }
    public loggerLocal = {
        errors: [],
        warnings: [],
        success: []
    };
    public value: Talla = {
        id: undefined,
        descripcion: ""
    };
    public editValue: Talla = {
        id:undefined,
        descripcion: ""
    }

    public values: Array<Talla> = [];
    public auxValues: Array<Talla> = [];
    public search: string = "";

    public loggerNameLow: string = "talla";
    public loggerNameUpp: string = "Talla";

    ngOnInit() {
        this.load(false);
    }
    load(reset: boolean): void {
        this.provider.listar(reset).subscribe(u => {
            this.values = u;
        }, e => {
            Includes.saveErrorLog(e);
            this.loggerLocal.errors.push("No se puede obtener la lista. [GET:All]");
        });
    }
    crear(): void {
        if (
            Includes.validateText(this.value.descripcion)
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
    eliminar(val: Talla): void {
        Includes.question("¡Espera un momento!", `¿Estás seguro de que quieres eliminar la talla '${val.descripcion}'?`, () => {
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
            Includes.validateText(this.editValue.descripcion)
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
    editarModal(val: Talla) {
        $(`#editar${this.loggerNameUpp}`).modal('show');
        this.editValue = val;
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
            res.descripcion.toLowerCase().indexOf(this.search.toLowerCase().trim()) >= 0
        );
    }
}
