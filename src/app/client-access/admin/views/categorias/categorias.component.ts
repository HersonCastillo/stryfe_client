import { Component, OnInit } from '@angular/core';
import { Includes } from '../../../../utils/Includes';
import { CategoriaService } from '../../../../services/categoria.service';
import { Categoria } from 'src/app/interfaces/categoria';

declare var $: any;
@Component({
    selector: 'app-categorias',
    templateUrl: './categorias.component.html',
    styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
    constructor(
        private categoriasProvider: CategoriaService
    ) { }
    public loggerLocal = {
        errors: [],
        warnings: [],
        success: []
    }
    public auxCategories: Array<Categoria> = [];
    public categorias: Array<Categoria> = [];
    public categoria: string = "";
    public searchCategory: string = "";
    public editCategoria: Categoria = {
        id: undefined,
        descripcion: ""
    };
    ngOnInit(){
        this.loadCategories(false);
    }
    loadCategories(reset: boolean){
        this.categoriasProvider.listar(reset).subscribe(r => {
            this.categorias = r;
        }, err => {
            this.loggerLocal.errors.push("No se pueden obtener las categorías del servidor.");
            Includes.saveErrorLog(err);
        });
    }
    addCategory(): void{
        $("#addCategory").modal('show');
    }
    newCategory(): void{
        if(Includes.validateText(this.categoria)){
            let categoria: Categoria = {
                id: undefined,
                descripcion: this.categoria
            };

            this.categoria = "";
            $("#addCategory").modal('hide');

            let alert: string = "Guardando categoría...";
            this.loggerLocal.warnings.push(alert);
            this.categoriasProvider.crear(categoria).subscribe(r => {
                this.removeAlert(alert, 'warnings');
                if(r.success){
                    this.loadCategories(true);
                    this.loggerLocal.success.push("Categoría guardada con éxito.");
                }
                else
                    if(r.error) this.loggerLocal.errors.push(r.error);
                    else this.loggerLocal.warnings.push("No se puede identificar el error al guardar.");
            }, err => {
                this.removeAlert(alert, 'warnings');
                this.loggerLocal.errors.push("No se puede guardar la categoría.");
                Includes.saveErrorLog(err);
            });
        } else Includes.alert("¡Ups!", "La categoría no es correcta.", "warning");
    }
    removeAlert(alert: string, listArr: string): void{
        try{
            this.loggerLocal[listArr] = this.loggerLocal[listArr].filter(r => r != alert);
        }catch(ex){
            Includes.saveErrorLog(ex);
        }
    }
    editarCategoriaModal(categoria: Categoria): void{
        this.editCategoria = categoria;
        $("#editCategory").modal('show');
    }
    editarCategoria(): void{
        if(Includes.validateText(this.editCategoria.descripcion)){
            this.categoria = "";
            $("#editCategory").modal('hide');

            let alert: string = "Guardando categoría...";
            this.loggerLocal.warnings.push(alert);
            this.categoriasProvider.modificar(this.editCategoria).subscribe(r => {
                this.removeAlert(alert, 'warnings');
                if(r.success){
                    this.loadCategories(true);
                    this.loggerLocal.success.push("Categoría modificada con éxito.");
                }
                else
                    if(r.error) this.loggerLocal.errors.push(r.error);
                    else this.loggerLocal.warnings.push("No se puede identificar el error al modificar.");
            }, err => {
                this.removeAlert(alert, 'warnings');
                this.loggerLocal.errors.push("No se puede modificar la categoría.");
                Includes.saveErrorLog(err);
            });
        } else Includes.alert("¡Ups!", "La categoría no es correcta.", "warning");
    }
    eliminarCategoria(categoria: Categoria): void{
        Includes.question("¡Espera un momento!", "¿Estás seguro de eliminar la categoría?", () => {
            let alert: string = "Eliminando categoría...";
            this.loggerLocal.warnings.push(alert);
            this.categoriasProvider.eliminar(categoria).subscribe(r => {
                this.removeAlert(alert, 'warnings');
                if(r.success){
                    this.loadCategories(true);
                    this.loggerLocal.success.push("Categoría eliminada con éxito.");
                }
                else
                    if(r.error) this.loggerLocal.errors.push(r.error);
                    else this.loggerLocal.warnings.push("No se puede identificar el error al eliminar.");
            }, err => {
                this.removeAlert(alert, 'warnings');
                this.loggerLocal.errors.push("No se puede eliminar la categoría.");
                Includes.saveErrorLog(err);
            });
        }, null, true);
    }
    search(event): void{
        if(this.auxCategories.length == 0)
            if(this.searchCategory.length == 1)
                this.auxCategories = this.categorias;
        if(this.auxCategories.length > 0)
            if(this.searchCategory.length == 0){
                this.categorias = this.auxCategories;
                this.auxCategories = [];
            }
        if(this.auxCategories.length == 0 && this.categorias.length == 0)
            this.loadCategories(false);
        if(event.target.value === "")
            this.loadCategories(false);
        this.categorias = this.categorias.filter(res => res.descripcion.toLowerCase().indexOf(this.searchCategory.toLowerCase().trim()) >= 0);
    }
}
