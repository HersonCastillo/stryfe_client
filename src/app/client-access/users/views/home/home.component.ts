import { Component, OnInit } from '@angular/core';
import { OrdenService } from '../../../../services/orden.service';
import { Orden } from '../../../../interfaces/orden';
import { MetodosPagoService } from '../../../../services/metodos-pago.service';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeUserComponent implements OnInit {
    constructor(
        private ordenProvider: OrdenService,
        private metodoProvider: MetodosPagoService
    ){}
    public ordenes: Orden[] = [];
    ngOnInit(){
        this.metodoProvider.listarUnique().subscribe(l => {
            if(l != null){
                this.ordenProvider.listar(true).subscribe(r => {
                    this.ordenes = r.filter(d => d.id_detalle_forma == l.id);
                });
            }
        });
    }
    getStatus(n: number): string{
        switch(n){
            case 1: return "Entregado";
            case 2: return "Guardado y procesando...";
            case 3: return "Enviada";
            case 4: return "Recibida";
            case 5: return "Extraviado";
            default: return "Indefinido";
        }
    }
    getFormaPago(val: number): string{
        switch(val){
            case 1: return "PayPal";
            case 2: return "Tarjeta de crédito/débito";
            default: return "Indefinido";
        }
    }
}
