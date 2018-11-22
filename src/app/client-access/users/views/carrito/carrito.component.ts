import { Component, OnInit } from '@angular/core';
import { Carrito, Producto, Usuario, MetodosPago, Orden, Descuento } from '../../../../interfaces/ifs';
import { Includes } from '../../../../utils/Includes';
import { CarritoService } from '../../../../services/carrito.service';
import { ProductoService } from '../../../../services/producto.service';
import { OrdenService } from '../../../../services/orden.service';
import { AdministradorService } from '../../../../services/administrador.service';
import { MetodosPagoService } from '../../../../services/metodos-pago.service';
import { DescuentoService } from '../../../../services/descuento.service';
declare var $: any;
@Component({
    selector: 'app-carrito',
    templateUrl: './carrito.component.html',
    styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
    constructor(
        private carritoProvider: CarritoService,
        private productoProvider: ProductoService,
        private usuarioProvider: AdministradorService,
        private ordenProvider: OrdenService,
        private metodoProvider: MetodosPagoService,
        private descuentoProvider: DescuentoService
    ){}
    public descuentos: Descuento[] = [];
    public carritos: Carrito[] = [];
    public productos: Producto[] = [];
    public carrito: Array<any> = [];
    public precioAPagar: number = 0.0;
    public value: Carrito = {
        cantidad: 0,
        id_producto: null
    }
    public orden: Orden[] = [];
    public usuario: Usuario;
    public metodo: MetodosPago;
    public errors: string[] = [];
    public canShop: boolean = false;
    public isLoad: boolean = false;
    public idCompra: number = <number>(() => {
        return Math.round(Math.random() * 1e20);
    })();
    public direccionAux: string = "";
    ngOnInit(){
        this.carritoProvider.listar().subscribe(carrito => {
            this.carritos = carrito;
            if(carrito.length > 0){
                this.usuarioProvider.listar(true).subscribe(u => {
                    this.usuario = u.filter(r => r.correo == Includes.getEmail())[0];
                    if(this.validateUser(this.usuario)){
                        this.metodoProvider.listarUnique().subscribe(m => {
                            this.metodo = m;
                            if(this.metodo != null){
                                this.canShop = true;
                            } else {
                                this.canShop = false;
                                Includes.alert('¡Ups!', 'Debes poseer al menos un método de pago válido.');
                                this.errors.push('Debes poseer al menos un método de pago válido en Métodos de Pago > Métodos de pago por defecto.');
                            }
                        });
                    } else{
                        Includes.alert('¡Ups!', 'Debes completar tu información personal primero.');
                        this.errors.push(`Debes completar tu información personal primero en Configuración > Información del perfil`);
                        this.canShop = false;
                    }
                });
                this.productoProvider.listar(true).subscribe(producto => {
                    this.productos = producto;
                    this.descuentoProvider.listarPublic().subscribe(d => {
                        this.descuentos = d;
                        producto.forEach(p => {
                            carrito.forEach(c => {
                                if(c.id_producto == p.id){
                                    this.carrito.push({
                                        producto: p,
                                        carrito: c
                                    });
                                    let precio = p.precio;
                                    if(this.discountIsAvailable(p)){
                                        precio = this.attrDiscount(precio, this.getDiscount(p).monto);
                                    }
                                    this.precioAPagar += c.cantidad * precio;
                                }
                            });
                        });
                    }, errd => {
                        Includes.saveErrorLog(errd);
                        Includes.alert('...', 'No se pueden listar los descuentos');
                    });
                }, errProducto => {
                    Includes.saveErrorLog(errProducto);
                    Includes.alert("¡Ups!", "No se puede obtener el carrito");
                });
            }
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
    validateUser(user: Usuario): boolean{
        try{
            return user.direccion != null && user.telefono != null && user.genero > 0 && user.dui != null;
        }catch(ex){
            return false;
        }
    }
    pagarModal(): void{
        $("#pagarModal").modal('show');
    }
    pagar(): void{
        Includes.question('¡Espera un momento!', '¿Estás seguro de que quieres realizar ya la compra?', () => {
            this.isLoad = true;
            this.ordenProvider.crear({
                token_verif: this.idCompra.toString(),
                direccion_aux: this.direccionAux.trim(),
                id_detalle_forma: this.metodo.id,
                id_estado: 2,
                monto_total: this.precioAPagar
            }).subscribe(r => {
                if(r.success){
                    this.carritoProvider.limpiarCarrito().subscribe(l => {
                        this.isLoad = false;
                        if(l.success){
                            Includes.alert("¡Bien!", "Gracias por tu compra, en unos momentos recibiras la factura en tu correo con más información sobre tu(s) productos.", "success");
                            this.carrito = [];
                            this.ngOnInit();
                            $("#pagarModal").modal('hide');
                        } else {
                            Includes.alert('Error', r.error || r.code || "Error al limpiar carrito.", 'error');
                        }
                    }, errl => {
                        this.isLoad = false;
                        Includes.alert('Error', "Error en el servicio de limpieza.", 'error');
                        Includes.saveErrorLog(errl);
                    });
                } else {
                    this.isLoad = false;
                    Includes.alert('Error', r.error || r.code || "Error al crear la compra.", 'error');
                }
            }, err => {
                this.isLoad = false;
                Includes.alert('Error', "Error en el servicio de compra.", 'error');
                Includes.saveErrorLog(err);
            });
        }, null, true);
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
}
