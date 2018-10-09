import { Observable } from "rxjs";
import { Categoria, Descuento, Producto, Subcategoria, Usuario, Respuesta } from "./ifs";

export interface CRUD {
    crear(value: Categoria | Descuento | Producto | Subcategoria | Usuario): Observable<Respuesta>,
    modificar(value: Categoria | Descuento | Producto | Subcategoria | Usuario): Observable<Respuesta>,
    eliminar(value: Categoria | Descuento | Producto | Subcategoria | Usuario): Observable<Respuesta>,
    listar(reset: boolean): Observable<Categoria[] | Descuento[] | Producto[] | Subcategoria[] | Usuario[]>,
    obtener(value: Categoria | Descuento | Producto | Subcategoria | Usuario): Observable<Categoria | Descuento | Producto | Subcategoria | Usuario>
}
