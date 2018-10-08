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
    public staticLogger = {
        errors: [],
        warnings: [],
        success: []
    }
    public errors: Array<string> = [];

    public categorias: Array<Categoria> = [];
    public categoria: string = "";
    ngOnInit(){
        this.categoriasProvider.listarCategorias().subscribe(r => {
            this.errors = [];
            this.categorias = r;
        }, err => {
            this.errors.push("No se pueden obtener las categorías del servidor.");
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
            this.categoriasProvider.nuevaCategoria(categoria).subscribe(r => {
                if(r.success){
                    this.ngOnInit();
                } else {
                    console.error('bad');
                }
            }, err => {
                this.errors.push("No se puede guardar la categoría.");
                Includes.saveErrorLog(err);
            });
        } else Includes.alert("¡Ups!", "La categoría no es correcta.", "warning");
    }
}
