import { Component, OnInit } from '@angular/core';
import { AdministradorService } from '../../../../services/administrador.service';
@Component({
    selector: 'app-configuracion',
    templateUrl: './configuracion.component.html',
    styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
    constructor(
        private administradorProvider: AdministradorService
    ) {}
    ngOnInit(){}
}
