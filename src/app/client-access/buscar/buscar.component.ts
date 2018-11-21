import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
@Component({
    selector: 'app-buscar',
    templateUrl: './buscar.component.html',
    styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private productoProvider: ProductoService
    ){}
    ngOnInit(){
        this.route.params.subscribe(p => {
            let prod = p['producto'];
            this.productoProvider.buscar(prod).subscribe(r => {
                console.log(r)
            });
        });
    }

}
