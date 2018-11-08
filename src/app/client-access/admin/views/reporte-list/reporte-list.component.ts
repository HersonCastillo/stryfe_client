import { Component, OnInit } from '@angular/core';
import { Reporte, Producto } from '../../../../interfaces/ifs';
import { ReporteService } from '../../../../services/reporte.service';
import { ProductoService } from '../../../../services/producto.service';
import { Includes } from '../../../../utils/Includes';
@Component({
    selector: 'app-reporte-list',
    templateUrl: './reporte-list.component.html',
    styleUrls: ['./reporte-list.component.css']
})
export class ReporteListComponent implements OnInit {

    constructor(
        private reporteProvider: ReporteService,
        private productoProvider: ProductoService
    ) { }
    public reportes: Reporte[] = [];
    public productos: Producto[] = [];
    ngOnInit() {
        this.productoProvider.listar(true).subscribe(l => {
            this.productos = l;
            this.reporteProvider.listar().subscribe(r => {
                this.reportes = r;
            }, err => {
                Includes.saveErrorLog(err);
                Includes.alert("Error", "No se pueden listar los reportes", "error");
            });
        }, errl => {
            Includes.saveErrorLog(errl);
            Includes.alert("Error", "No se pueden listar los reportes", "error");
        });
    }
    getProducto(prodid: string): Producto{
        return this.productos.filter(r => r.id == prodid)[0];
    }
    quitar(reporte: Reporte): void{
        Includes.question("¡Espera!", "¿Seguro de quitar de la lista?", () => {
            this.reporteProvider.eliminar(reporte).subscribe(l => {
                if(l.success){
                    this.ngOnInit();
                    Includes.alert("¡Bien!", "Reporte quitado", "success");
                } else {
                    Includes.alert("¡Error!", l.error || "Reporte no quitado");
                }
            }, err => {
                Includes.saveErrorLog(err);
                Includes.alert("Error", "No se pueden eliminar los reportes", "error");
            });
        });
    }
    getImage(imageName: string): any {
        return this.productoProvider.mostrarImagen(imageName);
    }
}
