import { Component, OnInit } from '@angular/core';
import { Includes } from '../../../../utils/Includes';
import { ProductoService } from '../../../../services/producto.service';
import { Producto } from 'src/app/interfaces/producto';
declare var $: any;
@Component({
    selector: 'app-productos',
    templateUrl: './productos.component.html',
    styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
    constructor(
        private provider: ProductoService
    ) { }
    public loggerLocal = {
        errors: [],
        warnings: [],
        success: []
    };
    public value: Producto = {
        cantidad: 0,
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
    public search: string = "";

    public loggerNameLow: string = "producto";
    public loggerNameUpp: string = "Producto";

    public image: File = null;
    ngOnInit(){
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
    onChangeImage(event: any): void{
        try{
            this.image = event.target.files[0];
        }catch(ex){
            this.image = null;
        }
    }
    crear(): void{
        /*this.provider.guardarImagen(this.image).subscribe(r => {
            console.log(r)
        }, e => {
            console.error(e)
        });*/
    }
    crearModal(): void{
        $(`#crear${this.loggerNameUpp}`).modal('show');
    }
    editar(): void{

    }
    editarModal(val: Producto): void{
        $(`#editar${this.loggerNameUpp}`).modal('show');
        this.editValue = val;
    }
    eliminar(val: Producto): void{

    }
    removeAlert(alert: string, listArr: string): void {
        try {
            this.loggerLocal[listArr] = this.loggerLocal[listArr].filter(r => r != alert);
        } catch (ex) {
            Includes.saveErrorLog(ex);
        }
    }
}
