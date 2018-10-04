import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../../../services/categoria.service';
@Component({
    selector: 'app-categorias',
    templateUrl: './categorias.component.html',
    styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
    constructor(
        private categorias: CategoriaService
    ) { }
    ngOnInit(){
        this.categorias.listarCategorias().subscribe(r => {
            console.log(r);
        }, err => {
            console.error(err);
        });
    }

}
