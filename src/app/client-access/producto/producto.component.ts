import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../interfaces/ifs';
import { Includes } from '../../utils/Includes';
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
        private productoProvider: ProductoService
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
        stock_minimo: 0
    }
    public azar: Producto[] = [];
    ngOnInit(){
        this.route.params.subscribe(p => {
            let id = p['id'];
            this.producto.id = id;
            this.productoProvider.obtenerPublic(this.producto).subscribe(p => {
                this.producto = p;
                this.productoProvider.random().subscribe(r => {
                    //this.azar = r.filter(d => d.id != p.id);
                });
            }, e => {
                Includes.saveErrorLog(e);
                Includes.alert("¡Ups!", "No se encontró este producto");
                this.router.navigate(['/error']);
            });
        });
    }
    getImage(imageName: string): any {
        return this.productoProvider.mostrarImagen(imageName);
    }
}
