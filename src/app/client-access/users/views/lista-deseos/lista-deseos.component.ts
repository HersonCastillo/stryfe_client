import { Component, OnInit } from '@angular/core';
import { Producto } from '../../../../interfaces/producto';
import { Includes } from '../../../../utils/Includes';
import { ProductoService } from 'src/app/services/producto.service';
@Component({
    selector: 'app-lista-deseos',
    templateUrl: './lista-deseos.component.html',
    styleUrls: ['./lista-deseos.component.css']
})
export class ListaDeseosComponent implements OnInit {
    constructor(
        private productoProvider: ProductoService
    ){}
    public productos: Producto[];
    ngOnInit(){
        this.productos = Includes.obtenerListaDeseos();
    }
    getImage(raw: string): any {
        return this.productoProvider.mostrarImagen(raw);
    }
    quitLS(producto: Producto): void{
        if(Includes.existeEnListaDeseos(producto)){
            Includes.question("¡Un momento!", "¿Estás seguro de que quieres quitar este producto de tu lista de deseos?", () => {
                if(Includes.quitarProductoDeListaDeseos(producto)) Includes.alert("¡Bien hecho!", "El producto fue quitado de la lista", "success");
                else Includes.alert("¡Ups!", "Al parecer no se puede eliminar este producto", "error");
                this.ngOnInit();
            }, null, true);
        } else Includes.alert("¡Ups!", "El producto no existe en tu lista de deseos.");
    }
}
