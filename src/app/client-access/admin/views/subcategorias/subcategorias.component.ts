import { Component, OnInit } from '@angular/core';
import { Includes } from '../../../../utils/Includes';
import { SubcategoriaService } from '../../../../services/subcategoria.service';
import { CategoriaService } from '../../../../services/categoria.service';
import { Subcategoria, Categoria } from 'src/app/interfaces/ifs';
declare var $: any;
@Component({
    selector: 'app-subcategorias',
    templateUrl: './subcategorias.component.html',
    styleUrls: ['./subcategorias.component.css']
})
export class SubcategoriasComponent implements OnInit {
    constructor(
        private subcategoriaProvider: SubcategoriaService,
        private categoriaProvider: CategoriaService
    ){}
    public loggerLocal = {
        errors: [],
        warnings: [],
        success: []
    }
    public paginator = {
        length: 0,
        perPage: 5,
        indexes: [],
        page: 0
    }
    getData(arr: Array<any>): Subcategoria[]{
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
    public auxSubcategories: Array<Subcategoria> = [];
    public subcategorias: Array<Subcategoria> = [];
    public categorias: Array<Categoria> = [];
    public subcategoria = {
        name: "",
        category_id: 0
    }
    public searchSubcategory: string = "";
    public editSubcategoria: Subcategoria = {
        id: undefined,
        descripcion: "",
        id_categoria: -1
    };
    ngOnInit(){
        this.categoriaProvider.listar(false).subscribe(c => {
            this.categorias = c;
            this.loadSubcategories(false);
        }, e => {
            this.loggerLocal.errors.push("No se pueden obtener las categorías del servidor.");
            Includes.saveErrorLog(e);
        });
    }
    loadSubcategories(reset: boolean){
        this.subcategoriaProvider.listar(reset).subscribe(r => {
            this.subcategorias = r;
            this.paginator.length = Math.ceil(r.length / this.paginator.perPage);
            this.paginator.indexes = [];
            for(let i = 0; i < this.paginator.length; i++) this.paginator.indexes.push(i + 1);
        }, err => {
            this.loggerLocal.errors.push("No se pueden obtener las subcategorías del servidor.");
            Includes.saveErrorLog(err);
        });
    }
    addSubcategory(): void{
        $("#addCategory").modal('show');
    }
    categoryName(subcategoria: Subcategoria): string{
        return this.categorias.find(r => r.id == subcategoria.id_categoria).descripcion;
    }
    newSubcategory(): void{
        if(Includes.validateText(this.subcategoria.name) && this.subcategoria.category_id > 0){
            let subcategoria: Subcategoria = {
                id: undefined,
                descripcion: this.subcategoria.name,
                id_categoria: this.subcategoria.category_id
            };

            this.subcategoria.name = "";
            $("#addCategory").modal('hide');

            let alert: string = "Guardando subcategoría...";
            this.loggerLocal.warnings.push(alert);
            this.subcategoriaProvider.crear(subcategoria).subscribe(r => {
                this.removeAlert(alert, 'warnings');
                if(r.success){
                    this.loadSubcategories(true);
                    this.loggerLocal.success.push("Subcategoría guardada con éxito.");
                }
                else
                    if(r.error) this.loggerLocal.errors.push(r.error);
                    else this.loggerLocal.warnings.push("No se puede identificar el error al guardar.");
            }, err => {
                this.removeAlert(alert, 'warnings');
                this.loggerLocal.errors.push("No se puede guardar la subcategoría.");
                Includes.saveErrorLog(err);
            });
        } else Includes.alert("¡Ups!", "La subcategoría no es correcta.", "warning");
    }
    removeAlert(alert: string, listArr: string): void{
        try{
            this.loggerLocal[listArr] = this.loggerLocal[listArr].filter(r => r != alert);
        }catch(ex){
            Includes.saveErrorLog(ex);
        }
    }
    editarSubcategoriaModal(subcategoria: Subcategoria): void{
        this.editSubcategoria = subcategoria;
        $("#editCategory").modal('show');
    }
    editarCategoria(): void{
        if(Includes.validateText(this.editSubcategoria.descripcion) && this.editSubcategoria.id_categoria > 0){
            this.subcategoria.name = "";
            $("#editCategory").modal('hide');

            let alert: string = "Guardando subcategoría...";
            this.loggerLocal.warnings.push(alert);
            this.subcategoriaProvider.modificar(this.editSubcategoria).subscribe(r => {
                this.removeAlert(alert, 'warnings');
                if(r.success){
                    this.loadSubcategories(true);
                    this.loggerLocal.success.push("Subcategoría modificada con éxito.");
                }
                else
                    if(r.error) this.loggerLocal.errors.push(r.error);
                    else this.loggerLocal.warnings.push("No se puede identificar el error al modificar.");
            }, err => {
                this.removeAlert(alert, 'warnings');
                this.loggerLocal.errors.push("No se puede modificar la subcategoría.");
                Includes.saveErrorLog(err);
            });
        } else Includes.alert("¡Ups!", "La subcategoría no es correcta.", "warning");
    }
    eliminarSubcategoria(subcategoria: Subcategoria): void{
        Includes.question("¡Espera un momento!", "¿Estás seguro de eliminar la subcategoría?", () => {
            let alert: string = "Eliminando subcategoría...";
            this.loggerLocal.warnings.push(alert);
            this.subcategoriaProvider.eliminar(subcategoria).subscribe(r => {
                this.removeAlert(alert, 'warnings');
                if(r.success){
                    this.paginator.page = 0;
                    this.loadSubcategories(true);
                    this.loggerLocal.success.push("Subcategoría eliminada con éxito.");
                }
                else
                    if(r.error) this.loggerLocal.errors.push(r.error);
                    else this.loggerLocal.warnings.push("No se puede identificar el error al eliminar.");
            }, err => {
                this.removeAlert(alert, 'warnings');
                this.loggerLocal.errors.push("No se puede eliminar la subcategoría.");
                Includes.saveErrorLog(err);
            });
        }, null, true);
    }
    search(event): void{
        this.paginator.page = 0;
        if(this.auxSubcategories.length == 0)
            if(this.searchSubcategory.length == 1)
                this.auxSubcategories = this.subcategorias;
        if(this.auxSubcategories.length > 0)
            if(this.searchSubcategory.length == 0){
                this.subcategorias = this.auxSubcategories;
                this.auxSubcategories = [];
            }
        if(this.auxSubcategories.length == 0 && this.subcategorias.length == 0)
            this.loadSubcategories(false);
        if(event.target.value === "")
            this.loadSubcategories(false);
        this.subcategorias = this.subcategorias.filter(res => res.descripcion.toLowerCase().indexOf(this.searchSubcategory.toLowerCase().trim()) >= 0);
    }
}
