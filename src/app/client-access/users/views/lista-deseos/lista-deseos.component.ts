import { Component, OnInit } from '@angular/core';
import { Producto } from '../../../../interfaces/producto';
import { Includes } from '../../../../utils/Includes';
@Component({
    selector: 'app-lista-deseos',
    templateUrl: './lista-deseos.component.html',
    styleUrls: ['./lista-deseos.component.css']
})
export class ListaDeseosComponent implements OnInit {
    constructor(
        private includes: Includes
    ){}
    public productos: Producto[];
    ngOnInit(){
        let lista = sessionStorage.getItem(Includes.NAMES.LISTA_DESEOS);
        if(lista && lista != null){

        } else this.productos = [];
    }
    
}
