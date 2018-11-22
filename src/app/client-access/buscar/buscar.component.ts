import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../interfaces/producto';
@Component({
    selector: 'app-buscar',
    templateUrl: './buscar.component.html',
    styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private productoProvider: ProductoService,
        private router: Router
    ){}
    public productos: Producto[] = [];
    public filter = {
        min: 0,
        max: 10000,
        input: "",
        dateAfter: Date
    }
    ngOnInit(){
        this.route.params.subscribe(p => {
            let prod = p['producto'];
            this.filter.input = prod;
            this.productoProvider.buscar(prod).subscribe(r => {
                this.productos = r;
            });
        });
    }
    searchBox(): void{
        if(this.filter.input.trim().length > 0) this.router.navigate(['/buscar', this.filter.input.trim()]);
        else this.router.navigate(['/home']);
    }
    reduce(str: string): string {
        try {
            if (str && str.length <= 10) return str;
            else return str.slice(0, 7).concat("...");
        } catch (ex) {
            return "";
        }
    }
    getImage(imageName: string): any {
        return this.productoProvider.mostrarImagen(imageName);
    }
    changeMin(e: any): void{
        console.log(e)
    }
    changeMax(e: any): void{
        console.log(e)
    }
    isAllow(prod: Producto): boolean {
        try{
            return prod.precio <= this.filter.max && prod.precio >= this.filter.min;
        }catch(ex){
            return false;
        }
    }
}
