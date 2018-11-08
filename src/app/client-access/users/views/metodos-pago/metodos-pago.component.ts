import { Component, OnInit } from '@angular/core';
import { MetodosPago } from '../../../../interfaces/metodos-pago';
import { MetodosPagoService } from '../../../../services/metodos-pago.service';
import { Includes } from '../../../../utils/Includes';
@Component({
    selector: 'app-metodos-pago',
    templateUrl: './metodos-pago.component.html',
    styleUrls: ['./metodos-pago.component.css']
})
export class MetodosPagoComponent implements OnInit {
    constructor(
        private metodosProvider: MetodosPagoService
    ) { }
    public metodo: MetodosPago = {
        correo: "",
        numero: "",
        id_forma: 0
    };
    public tarjeta = {
        numero: "",
        ccv: "",
        m: "",
        y: ""
    }
    public isNull: boolean = false;
    public isLoad: boolean = false;
    get isAllowedEmail(): boolean {
        try {
            return this.metodo.correo.length == 0;
        } catch (ex) {
            return true;
        }
    }
    get isAllowedCard(): boolean {
        try {
            return (
                this.tarjeta.numero.length == 0 ||
                this.tarjeta.ccv.length == 0 ||
                this.tarjeta.m.length == 0 ||
                this.tarjeta.y.length == 0
            );
        } catch (ex) {
            return true;
        }
    }
    get Tarjeta(): string {
        return `${this.tarjeta.numero}#${this.tarjeta.ccv}#${this.tarjeta.m}#${this.tarjeta.y}`;
    }
    changeMetodo(): void {
        if (this.isNull) {
            Includes.alert("...", "Debes agregar un método de pago primero.");
        } else {
            let numero = btoa(this.Tarjeta);
            this.metodosProvider.modificar({
                correo: this.metodo.correo,
                numero: numero,
                id_forma: this.metodo.id_forma,
                id: this.metodo.id
            }).subscribe(r => {
                this.isLoad = false;
                if (r.success) {
                    Includes.alert("¡Bien!", "Método cambiado", "success");
                    this.ngOnInit();
                } else {
                    if (r.error) Includes.alert("¡Error!", r.error);
                    else Includes.alert("¡Ups!", "No se puede cambiar el método.");
                }
            }, err => {
                this.isLoad = false;
                Includes.saveErrorLog(err);
                Includes.alert("!Error¡", "No se puede cambiar en el servidor.");
            });
        }
    }
    ngOnInit() {
        this.metodosProvider.misMetodos().subscribe(m => {
            if (m != null) {
                this.isNull = false;
                this.metodo = m;
                try {
                    let numero = atob(m.numero).split("#");
                    this.tarjeta.y = numero[3];
                    this.tarjeta.m = numero[2];
                    this.tarjeta.ccv = numero[1];
                    this.tarjeta.numero = numero[0];
                } catch (ex) { }
            } else this.isNull = true;
        });
    }
    savePaypal(): void {
        if (!this.isAllowedEmail) {
            let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi;
            if (regex.exec(this.metodo.correo)) {
                this.isLoad = true;
                let numero = btoa(this.Tarjeta);
                if (this.isNull) {
                    this.metodosProvider.crear({
                        correo: this.metodo.correo,
                        numero: numero,
                        id_forma: 1
                    }).subscribe(r => {
                        this.isLoad = false;
                        if (r.success) {
                            Includes.alert("¡Bien!", "Método guardado", "success");
                            this.ngOnInit();
                        } else {
                            if (r.error) Includes.alert("¡Error!", r.error);
                            else Includes.alert("¡Ups!", "No se puede guardar el método.");
                        }
                    }, err => {
                        this.isLoad = false;
                        Includes.saveErrorLog(err);
                        Includes.alert("!Error¡", "No se puede guardar en el servidor.");
                    });
                } else {
                    this.metodosProvider.modificar({
                        correo: this.metodo.correo,
                        numero: numero,
                        id_forma: this.metodo.id_forma,
                        id: this.metodo.id
                    }).subscribe(r => {
                        this.isLoad = false;
                        if (r.success) {
                            Includes.alert("¡Bien!", "Método guardado", "success");
                            this.ngOnInit();
                        } else {
                            if (r.error) Includes.alert("¡Error!", r.error);
                            else Includes.alert("¡Ups!", "No se puede guardar el método.");
                        }
                    }, err => {
                        this.isLoad = false;
                        Includes.saveErrorLog(err);
                        Includes.alert("!Error¡", "No se puede guardar en el servidor.");
                    });
                }
            } else Includes.alert("¡Ups!", "El correo electrónico no es válido.", "warning");
        }
    }
    saveCard(): void {
        let regex01 = /^[\d]{16}$/g;
        let regex02 = /^[\d]{3}$/g;
        if (regex01.exec(this.tarjeta.numero)) {
            if (regex02.exec(this.tarjeta.ccv)) {
                let valueDate = (() => {
                    let m = parseInt(this.tarjeta.m);
                    let y = parseInt(this.tarjeta.y);
                    if (m >= 1 && m <= 12) {
                        if (y >= 10 && y <= 35) return true;
                    }
                    return false;
                })();
                if (valueDate) {
                    this.isLoad = true;
                    let numero = btoa(this.Tarjeta);
                    if (this.isNull) {
                        this.metodosProvider.crear({
                            correo: this.metodo.correo,
                            numero: numero,
                            id_forma: 2
                        }).subscribe(r => {
                            this.isLoad = false;
                            if (r.success) {
                                Includes.alert("¡Bien!", "Método guardado", "success");
                                this.ngOnInit();
                            } else {
                                if (r.error) Includes.alert("¡Error!", r.error);
                                else Includes.alert("¡Ups!", "No se puede guardar el método.");
                            }
                        }, err => {
                            this.isLoad = false;
                            Includes.saveErrorLog(err);
                            Includes.alert("!Error¡", "No se puede guardar en el servidor.");
                        });
                    } else {
                        this.metodosProvider.modificar({
                            correo: this.metodo.correo,
                            numero: numero,
                            id_forma: this.metodo.id_forma,
                            id: this.metodo.id
                        }).subscribe(r => {
                            this.isLoad = false;
                            if (r.success) {
                                Includes.alert("¡Bien!", "Método guardado", "success");
                                this.ngOnInit();
                            } else {
                                if (r.error) Includes.alert("¡Error!", r.error);
                                else Includes.alert("¡Ups!", "No se puede guardar el método.");
                            }
                        }, err => {
                            this.isLoad = false;
                            Includes.saveErrorLog(err);
                            Includes.alert("!Error¡", "No se puede guardar en el servidor.");
                        });
                    }
                } else Includes.alert(null, "La fecha no es válida para una tarjeta de esta tienda");
            } else Includes.alert(null, "CCV no es válido");
        } else Includes.alert(null, "La tarjeta no es válida");
    }
}
