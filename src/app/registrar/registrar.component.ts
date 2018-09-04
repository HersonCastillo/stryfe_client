import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
    selector: 'app-registrar',
    templateUrl: './registrar.component.html',
    styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {

    constructor() { }
    ngOnInit(){
        $("title").text("Registrarme en Stryfe");
    }

}
