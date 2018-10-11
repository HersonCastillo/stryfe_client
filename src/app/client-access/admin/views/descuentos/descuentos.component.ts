import { Component, OnInit } from '@angular/core';
import { Includes } from '../../../../utils/Includes';
import { DescuentoService } from '../../../../services/descuento.service';
import { Descuento } from 'src/app/interfaces/descuento';

declare var $: any;
@Component({
    selector: 'app-descuentos',
    templateUrl: './descuentos.component.html',
    styleUrls: ['./descuentos.component.css']
})
export class DescuentosComponent implements OnInit {
    constructor() { }
    ngOnInit() {}
}
