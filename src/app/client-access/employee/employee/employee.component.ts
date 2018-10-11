import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../../services/socket.service';
@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
    constructor(
        private socket: SocketService
    ) {}
    private _socket: any;
    ngOnInit(){
        this._socket = this.socket.openConnection();
        console.log(this._socket);
    }
}
