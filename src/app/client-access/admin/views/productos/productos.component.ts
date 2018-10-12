import { Component, OnInit } from '@angular/core';
import { Includes } from '../../../../utils/Includes';
import { ProductoService } from '../../../../services/producto.service';
import { SubcategoriaService } from '../../../../services/subcategoria.service';
import { TallaService } from '../../../../services/talla.service';
import { ColorService } from '../../../../services/color.service';
import { Producto } from 'src/app/interfaces/producto';
import { Subcategoria, Talla, Color } from 'src/app/interfaces/ifs';
declare var $: any;
@Component({
    selector: 'app-productos',
    templateUrl: './productos.component.html',
    styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
    constructor(
        private provider: ProductoService,
        private colorProvider: ColorService,
        private tallaProvider: TallaService,
        private subcategoriaProvider: SubcategoriaService
    ) { }
    public loggerLocal = {
        errors: [],
        warnings: [],
        success: []
    };
    public value: Producto = {
        cantidad: 0,
        nombre: "",
        descripcion: "",
        id: undefined,
        id_color: 0,
        id_estado_prod: 1,
        id_rubro: 1,
        id_subcategoria_prod: 0,
        id_talla: 0,
        img: null,
        precio: 0.0,
        stock_existente: 0,
        stock_minimo: 0
    }
    public editValue: Producto = {
        cantidad: 0,
        nombre: "",
        descripcion: "",
        id: undefined,
        id_color: 0,
        id_estado_prod: 0,
        id_rubro: 1,
        id_subcategoria_prod: 0,
        id_talla: 0,
        img: null,
        precio: 0.0,
        stock_existente: 0,
        stock_minimo: 0
    }
    public values: Array<Producto> = [];
    public auxValues: Array<Producto> = [];
    public search: string = "";

    public loggerNameLow: string = "producto";
    public loggerNameUpp: string = "Producto";

    public image: File = null;

    public subcategoria: Array<Subcategoria> = [];
    public talla: Array<Talla> = [];
    public color: Array<Color> = [];
    ngOnInit() {
        this.subcategoriaProvider.listar(false).subscribe(c => {
            this.tallaProvider.listar(false).subscribe(t => {
                this.colorProvider.listar(false).subscribe(cl => {
                    this.subcategoria = c;
                    this.talla = t;
                    this.color = cl;
                    this.load(false);
                }, errColor => {
                    this.loggerLocal.warnings.push("No se puede obtener las tallas.");
                    Includes.saveErrorLog(errColor);
                });
            }, errTalla => {
                this.loggerLocal.warnings.push("No se puede obtener las tallas.");
                Includes.saveErrorLog(errTalla);
            });
        }, errSubcategoria => {
            this.loggerLocal.warnings.push("No se puede obtener las sub-categorías.");
            Includes.saveErrorLog(errSubcategoria);
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
    onChangeImage(event: any): void {
        try {
            this.image = event.target.files[0];
        } catch (ex) {
            this.image = null;
        }
    }
    crear(): void {
        if (
            Includes.validateText(this.value.nombre) &&
            Includes.validateText(this.value.descripcion) &&
            this.value.cantidad > 0 &&
            this.value.stock_minimo >= 0 &&
            this.value.id_color > 0 &&
            this.value.id_estado_prod > 0 &&
            this.value.id_rubro > 0 &&
            this.value.id_subcategoria_prod > 0 &&
            this.value.id_talla > 0 &&
            this.image != null &&
            this.value.stock_minimo < this.value.cantidad
        ) {
            this.value.stock_existente = this.value.cantidad;
            this.provider.guardarImagen(this.image).subscribe(r => {
                if (r.success) {
                    this.value.img = r.imageName;
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
                } else
                    if (r.error) this.loggerLocal.errors.push(r.error);
                    else this.loggerLocal.warnings.push("No se puede subir la imagen.");
            }, e => {
                Includes.saveErrorLog(e);
            });
        } else this.loggerLocal.warnings.push("Los datos de guardado no son correctos, verifica los datos.");
    }
    crearModal(): void {
        $(`#crear${this.loggerNameUpp}`).modal('show');
    }
    editar(): void {
        if (
            Includes.validateText(this.editValue.nombre) &&
            Includes.validateText(this.editValue.descripcion) &&
            this.editValue.cantidad > 0 &&
            this.editValue.stock_minimo >= 0 &&
            this.editValue.id_color > 0 &&
            this.editValue.id_estado_prod > 0 &&
            this.editValue.id_rubro > 0 &&
            this.editValue.id_subcategoria_prod > 0 &&
            this.editValue.id_talla > 0 &&
            this.editValue.stock_minimo < this.editValue.cantidad &&
            this.editValue.stock_minimo < this.editValue.stock_existente
        ) {
            if(this.image == null){
                let alert: string = `Guardando ${this.loggerNameLow}...`;
                this.loggerLocal.warnings.push(alert);
                this.provider.modificar(this.editValue).subscribe(r => {
                    this.removeAlert(alert, 'warnings');
                    $(`#editar${this.loggerNameUpp}`).modal('hide');
                    if (r.success) {
                        this.loggerLocal.success.push(`El ${this.loggerNameLow} se guardó con éxito.`);
                        this.load(true);
                        this.image = null;
                    } else {
                        if (r.error) this.loggerLocal.errors.push(r.error);
                        else this.loggerLocal.warnings.push("Ocurrió un error al guardar [NOIMAGE].");
                    }
                }, e => {
                    Includes.saveErrorLog(e);
                    this.loggerLocal.errors.push("No se puede guardar. [POST:Inidividual]");
                    this.removeAlert(alert, 'warnings');
                });
            } else {
                this.editValue.img_aux = this.editValue.img;
                this.provider.guardarImagen(this.image).subscribe(r => {
                    if (r.success) {
                        this.editValue.img = r.imageName;
                        let alert: string = `Guardando ${this.loggerNameLow}...`;
                        this.loggerLocal.warnings.push(alert);
                        this.provider.modificar(this.editValue).subscribe(r => {
                            this.removeAlert(alert, 'warnings');
                            $(`#editar${this.loggerNameUpp}`).modal('hide');
                            if (r.success) {
                                this.loggerLocal.success.push(`El ${this.loggerNameLow} se guardó con éxito.`);
                                this.load(true);
                                this.image = null;
                            } else {
                                if (r.error) this.loggerLocal.errors.push(r.error);
                                else this.loggerLocal.warnings.push("Ocurrió un error al guardar.");
                            }
                        }, e => {
                            Includes.saveErrorLog(e);
                            this.loggerLocal.errors.push("No se puede guardar. [POST:Inidividual]");
                            this.removeAlert(alert, 'warnings');
                        });
                    } else
                        if (r.error) this.loggerLocal.errors.push(r.error);
                        else this.loggerLocal.warnings.push("No se puede subir la imagen.");
                }, e => {
                    Includes.saveErrorLog(e);
                    this.loggerLocal.warnings.push("La imagen no se puede subir.");
                });
            }
        } else this.loggerLocal.warnings.push("Los datos de guardado no son correctos, verifica los datos.");
    }
    editarModal(val: Producto): void {
        $(`#editar${this.loggerNameUpp}`).modal('show');
        this.editValue = val;
    }
    eliminar(val: Producto): void {
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
    removeAlert(alert: string, listArr: string): void {
        try {
            this.loggerLocal[listArr] = this.loggerLocal[listArr].filter(r => r != alert);
        } catch (ex) {
            Includes.saveErrorLog(ex);
        }
    }
    getImage(imageName: string): any {
        return this.provider.mostrarImagen(imageName);
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
            res.descripcion.toLowerCase().indexOf(this.search.toLowerCase().trim()) >= 0
        );
    }
}