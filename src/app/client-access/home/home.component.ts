import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto, Carrito, Descuento } from 'src/app/interfaces/ifs';
import { Includes } from '../../utils/Includes';
import { CarritoService } from '../../services/carrito.service';
import { DescuentoService } from '../../services/descuento.service';
import { Router } from '@angular/router';
declare var $: any;
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    constructor(
        private productoProvider: ProductoService,
        private carritoProvider: CarritoService,
        private descuentoProvider: DescuentoService,
        private router: Router
    ) { }
    public sessionAllow: boolean = false;
    public carrito: Carrito[] = [];
    public productos: Producto[] = [];
    public loadingCarrito: boolean = false;
    public value: Carrito = {
        cantidad: 1,
        id_producto: null,
        id_cliente: undefined,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    public descuentos: Descuento[] = [];
    public isAdmin: boolean = false;
    public searchInput: string = "";
    isInCarrito(prod: Producto): boolean {
        if (this.sessionAllow) {
            return this.carrito.filter(r => r.id_producto == prod.id).length > 0;
        }
        return false;
    }
    ngOnInit() {
        if (localStorage.getItem('type')) {
            this.isAdmin = false; //Delete this process
        }
        this.sessionAllow = localStorage.getItem('token') != null;
        this.productoProvider.publicListar(false).subscribe(p => {
            this.productos = p;
            this.descuentoProvider.listarPublic().subscribe(d => {
                this.descuentos = d;
            }, errd => {
                Includes.saveErrorLog(errd);
                Includes.alert('...', 'No se pueden listar los descuentos');
            });
        }, err => {
            Includes.saveErrorLog(err);
        });
        this.getCarrito();
    }
    getCarrito(): void {
        if (this.sessionAllow) {
            this.carritoProvider.listar().subscribe(r => {
                this.carrito = r;
            }, err => {
                Includes.saveErrorLog(err);
            });
        }
    }
    getImage(imageName: string): any {
        return this.productoProvider.mostrarImagen(imageName);
    }
    guardarAlCarrito(): void {
        if (this.value.cantidad > 0) {
            this.loadingCarrito = true;
            this.carritoProvider.crear(this.value).subscribe(r => {
                this.loadingCarrito = false;
                if (r.success) {
                    $("#carritoModal").modal('hide');
                    Includes.alert("OK", "Producto agregado", "success");
                    this.getCarrito();
                    this.value.cantidad = 0;
                    this.value.id_cliente = undefined;
                    this.value.id_producto = null;
                } else {
                    if (r.error) Includes.alert("¡Error!", r.error, "error");
                    else Includes.alert("!Ups¡", "No se puede guardar este producto.", "warning");
                }
            }, err => {
                this.loadingCarrito = false;
                Includes.saveErrorLog(err);
                Includes.alert("¡Algo malo ocurrió!", "No se puede agregar el producto a tu carrito de compras", "error");
            });
        } else Includes.alert("!Ups¡", "La cantidad no es válida", "warning");
    }
    agregarAlCarrito(prod: Producto): void {
        if (this.sessionAllow) {
            this.value.id_producto = prod.id;
            $("#carritoModal").modal('show');
        } else Includes.alert("¡Ups!", "Necesitas iniciar sesión para generar tu carrito.");
    }
    agregarAListaDeseos(prod: Producto): void {
        if (Includes.guardarProductoEnListaDeseos(prod))
            Includes.alert('¡Perfecto!', 'Producto agregado a la lista de deseos', 'success');
        else
            Includes.alert('Ocurrió algo mal', 'El producto no se puede agregar a la lista de deseos.', 'error');
    }
    quitarDeListaDeseos(prod: Producto): void {
        if (Includes.quitarProductoDeListaDeseos(prod))
            Includes.alert('¡Perfecto!', 'Producto quitado de la lista de deseos', 'success');
        else
            Includes.alert('Ocurrió algo mal', 'El producto no se puede quitar de la lista de deseos.', 'error');
    }
    isExistLD(prod: Producto): boolean {
        return Includes.existeEnListaDeseos(prod);
    }
    reduce(str: string): string {
        try {
            if (str && str.length <= 10) return str;
            else return str.slice(0, 7).concat("...");
        } catch (ex) {
            return "";
        }
    }
    discountIsAvailable(prod: Producto): boolean {
        try {
            let now = new Date();
            let descuento: Descuento = this.descuentos.filter(d => d.id_prod == prod.id)[0];
            let i = new Date(descuento.fech_in);
            let f = new Date(descuento.fech_fin);
            i.setDate(i.getDate() - 1);
            now.setDate(now.getDate() - 1);
            return now >= i && now <= f;
        } catch (ex) {
            return false;
        }
    }
    getDiscount(prod: Producto): Descuento {
        return this.descuentos.filter(d => d.id_prod == prod.id)[0];
    }
    attrDiscount(m: any, d: any): number{
        m = parseFloat(m);
        d = parseFloat(d);
        return d > m ? m : m - d;
    }
    searchBox(): void{
        this.router.navigate(['/buscar', this.searchInput]);
    }
}
