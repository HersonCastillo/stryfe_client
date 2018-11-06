import { Observable } from "rxjs";
import { Respuesta } from './respuesta';
export interface CRUD<T> {
    crear(value: T): Observable<Respuesta>,
    modificar(value: T): Observable<Respuesta>,
    eliminar(value: T): Observable<Respuesta>,
    listar(reset: boolean): Observable<T[]>,
    obtener(value: T): Observable<T>
}
