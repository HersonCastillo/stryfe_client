import { Component, OnInit } from '@angular/core';
import { Carrito, Producto } from '../../../../interfaces/ifs';
import { Includes } from '../../../../utils/Includes';
import { CarritoService } from '../../../../services/carrito.service';
import { ProductoService } from '../../../../services/producto.service';
declare var $: any;
@Component({
    selector: 'app-carrito',
    templateUrl: './carrito.component.html',
    styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
    constructor(
        private carritoProvider: CarritoService,
        private productoProvider: ProductoService
    ){}
    public carritos: Carrito[] = [];
    public productos: Producto[] = [];
    public carrito: Array<any> = [];
    public precioAPagar: number = 0.0;
    public value: Carrito = {
        cantidad: 0,
        id_producto: null
    }
    ngOnInit(){
        this.carritoProvider.listar().subscribe(carrito => {
            this.carritos = carrito;
            this.productoProvider.listar(true).subscribe(producto => {
                this.productos = producto;
                producto.forEach(p => {
                    carrito.forEach(c => {
                        if(c.id_producto == p.id){
                            this.carrito.push({
                                producto: p,
                                carrito: c
                            });
                            this.precioAPagar += c.cantidad * p.precio;
                        }
                    });
                });
            }, errProducto => {
                Includes.saveErrorLog(errProducto);
                Includes.alert("¡Ups!", "No se puede obtener el carrito");
            });
        }, errCarrito => {
            Includes.saveErrorLog(errCarrito);
            Includes.alert("¡Ups!", "No se puede obtener el carrito");
        });
    }
    getImage(raw: string): any {
        return this.productoProvider.mostrarImagen(raw);
    }
    quitarLista(val: Carrito): void{
        Includes.question("¡Espera un momento!", "¿Estás seguro de que quieres eliminar este producto del carrito?", () => {
            this.carritoProvider.eliminar(val).subscribe(r => {
                this.carrito = [];
                this.precioAPagar = 0;
                this.ngOnInit();
                Includes.alert("¡Bien!", "Producto quitado de la lista", "success");
            }, err => {
                Includes.saveErrorLog(err);
                Includes.alert("Error", "No se puede conseguir el proceso", "error");
            });
        }, null, true);
    }
    editarCantidadModal(val: Carrito): void{
        this.value = val;
        $("#carritoModal").modal('show');
    }
    editarCantidad(): void{
        if(this.value.cantidad > 0){
            this.carritoProvider.modificar(this.value).subscribe(r => {
                $("#carritoModal").modal('hide');
                this.carrito = [];
                this.precioAPagar = 0;
                this.ngOnInit();
            }, err => {
                Includes.saveErrorLog(err);
                Includes.alert("¡Error!", "No se puede extraer la información del carrito.");
            });
        } else Includes.alert("¡Un momento!", "La cantidad no es válida.");
    }
}
