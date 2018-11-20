import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Includes } from '../../../../utils/Includes';
import { ColorService } from '../../../../services/color.service';
import { Color } from 'src/app/interfaces/color';

declare var $: any;
@Component({
    selector: 'app-color',
    templateUrl: './color.component.html',
    styleUrls: ['./color.component.css']
})
export class ColorComponent implements OnInit {
    constructor(
        private provider: ColorService,
        private router: Router
    ) { }
    public loggerLocal = {
        errors: [],
        warnings: [],
        success: []
    };
    public value: Color = {
        id: undefined,
        descripcion: ""
    };
    public editValue: Color = {
        id:undefined,
        descripcion: ""
    }

    public paginator = {
        length: 0,
        perPage: 5,
        indexes: [],
        page: 0
    }
    getData(arr: Array<any>): Color[]{
        try{
            let i = this.paginator.perPage * this.paginator.page;
            let f = i + this.paginator.perPage;
            return arr.slice(i, f);
        }catch(ex){
            return [];
        }
    }
    isTabSelected(i: number): boolean{
        return (i - 1) == this.paginator.page;
    }
    clickChange(i: number): void{
        this.paginator.page = i - 1;
    }

    public values: Array<Color> = [];
    public auxValues: Array<Color> = [];
    public search: string = "";

    public loggerNameLow: string = "color";
    public loggerNameUpp: string = "Color";

    ngOnInit() {
        this.load(false);
    }
    load(reset: boolean): void {
        this.provider.listar(reset).subscribe(u => {
            this.values = u;
            this.paginator.length = Math.ceil(u.length / this.paginator.perPage);
            this.paginator.indexes = [];
            for(let i = 0; i < this.paginator.length; i++) this.paginator.indexes.push(i + 1);
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
    eliminar(val: Color): void {
        Includes.question("¡Espera un momento!", `¿Estás seguro de que quieres eliminar el color '${val.descripcion}'?`, () => {
            let alert: string = `Eliminando ${this.loggerNameLow}...`;
            this.loggerLocal.warnings.push(alert);
            this.provider.eliminar(val).subscribe(r => {
                this.removeAlert(alert, 'warnings');
                if (r.success) {
                    this.loggerLocal.success.push(`El ${this.loggerNameLow} se eliminó con éxito.`);
                    this.load(true);
                    this.paginator.page = 0;
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
    editarModal(val: Color) {
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
        this.paginator.page = 0;
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
