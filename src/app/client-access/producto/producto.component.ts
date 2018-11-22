import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { ProductoService } from '../../services/producto.service';
import { DescuentoService } from '../../services/descuento.service';
import { Producto, Carrito, Descuento } from '../../interfaces/ifs';
import { Includes } from '../../utils/Includes';
declare var $: any;
@Component({
    selector: 'app-producto',
    templateUrl: './producto.component.html',
    styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private carritoProvider: CarritoService,
        private productoProvider: ProductoService,
        private descuentoProvider: DescuentoService
    ) { }
    public producto: Producto = {
        cantidad: 0,
        descripcion: "",
        id: undefined,
        id_color: undefined,
        id_estado_prod: undefined,
        id_rubro: undefined,
        id_subcategoria_prod: undefined,
        id_talla: undefined,
        img: "",
        img_aux: "",
        nombre: "",
        precio: 0,
        stock_existente: 0,
        stock_minimo: 0,
        genero_prodc: 0
    }
    public sessionAllow: boolean = false;
    public isAdmin: boolean = false;
    public carrito: Carrito[] = [];
    public value: Carrito = {
        cantidad: 1,
        id_producto: null,
        id_cliente: undefined,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    public descuentos: Descuento[] = [];
    public loadingCarrito: boolean = false;
    public now: Date = new Date();
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
        this.route.params.subscribe(p => {
            let id = p['id'];
            this.producto.id = id;
            this.productoProvider.obtenerPublic(this.producto).subscribe(p => {
                this.producto = p;
                this.descuentoProvider.listarPublic().subscribe(d => {
                    this.descuentos = d;
                }, errd => {
                    Includes.saveErrorLog(errd);
                    Includes.alert('...', 'No se pueden listar los descuentos');
                });
                this.carritoProvider.listar().subscribe(c => {
                    this.carrito = c;
                });
            }, e => {
                Includes.saveErrorLog(e);
                Includes.alert("¡Ups!", "No se encontró este producto");
                this.router.navigate(['/error']);
            });
        });
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
    attrDiscount(m: any, d: any): number {
        m = parseFloat(m);
        d = parseFloat(d);
        return d > m ? m : m - d;
    }
    promotionsEnd(d: Descuento): number {
        try{
            let f = new Date(d.fech_fin);
            let dayFinish = f.getDate() + 1;
            let nowDay = this.now.getDate() + 1;
            return Math.abs(dayFinish - nowDay) + 1;
        }catch(ex){
            return 1;
        }
    }
}
