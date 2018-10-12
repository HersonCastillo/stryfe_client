import { Component, OnInit } from '@angular/core';
import { Includes } from '../../../../utils/Includes';
import { DescuentoService } from '../../../../services/descuento.service';
import { ProductoService } from '../../../../services/producto.service';
import { Descuento } from 'src/app/interfaces/descuento';
import { Producto } from 'src/app/interfaces/ifs';

declare var $: any;
@Component({
    selector: 'app-descuentos',
    templateUrl: './descuentos.component.html',
    styleUrls: ['./descuentos.component.css']
})
export class DescuentosComponent implements OnInit {
    constructor(
        private provider: DescuentoService,
        private productoProvider: ProductoService
    ) { }
    public loggerLocal = {
        errors: [],
        warnings: [],
        success: []
    };
    public value: Descuento = {
        id: undefined,
        fech_in: new Date(),
        fech_fin: new Date(),
        id_estado: 0,
        id_prod: "",
        monto: 0
    };
    public editValue: Descuento = {
        id: undefined,
        fech_in: new Date(),
        fech_fin: new Date(),
        id_estado: 0,
        id_prod: "",
        monto: 0
    }

    public values: Array<Descuento> = [];
    public auxValues: Array<Descuento> = [];
    public search: string = "";

    public loggerNameLow: string = "descuento";
    public loggerNameUpp: string = "Descuento";

    public estados: Array<any> = [];
    public productos: Producto[] = [];
    ngOnInit() {
        this.provider.listarEstados().subscribe(e => {
            this.estados = e;
            this.productoProvider.listar(false).subscribe(p => {
                this.productos = p;
                this.load(false);
            }, errProd => {
                Includes.saveErrorLog(errProd);
                this.loggerLocal.warnings.push("No se puede obtener los productos.");
            });
        }, err => {
            Includes.saveErrorLog(err);
            this.loggerLocal.warnings.push("No se puede obtener los estados.");
        });
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
            this.value.fech_in <= this.value.fech_fin &&
            this.value.id_estado > 0 &&
            Includes.validateText(this.value.id_prod)
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
    eliminar(val: Descuento): void {
        Includes.question("¡Espera un momento!", `¿Estás seguro de que quieres eliminar el descuento?`, () => {
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
            this.editValue.fech_in <= this.editValue.fech_fin &&
            this.editValue.id_estado > 0 &&
            Includes.validateText(this.editValue.id_prod)
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
    editarModal(val: Descuento) {
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
}
