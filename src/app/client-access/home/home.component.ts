import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from 'src/app/interfaces/ifs';
import { Includes } from 'src/app/utils/Includes';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    constructor(
        private productoProvider: ProductoService
    ){}
    public productos: Producto[] = [];
    ngOnInit(){
        this.productoProvider.publicListar(false).subscribe(p => {
            this.productos = p;
        }, err => {
            Includes.saveErrorLog(err);
        });
    }
    getImage(imageName: string): any {
        return this.productoProvider.mostrarImagen(imageName);
    }
    agregarAlCarrito(prod: Producto): void{

    }
    agregarAListaDeseos(prod: Producto): void{
        if(Includes.guardarProductoEnListaDeseos(prod))
            Includes.alert('¡Perfecto!', 'Producto agregado a la lista de deseos', 'success');
        else 
            Includes.alert('Ocurrió algo mal', 'El producto no se puede agregar a la lista de deseos.', 'error');
    }
    quitarDeListaDeseos(prod: Producto): void{
        if(Includes.quitarProductoDeListaDeseos(prod))
            Includes.alert('¡Perfecto!', 'Producto quitado de la lista de deseos', 'success');
        else 
            Includes.alert('Ocurrió algo mal', 'El producto no se puede quitar de la lista de deseos.', 'error');
    }
    isExistLD(prod: Producto): boolean{
        return Includes.existeEnListaDeseos(prod);
    }
}
