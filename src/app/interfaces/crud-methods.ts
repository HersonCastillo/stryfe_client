import { Observable } from "rxjs";
import { Categoria, Descuento, Producto, Subcategoria, Usuario, Respuesta, Color, Talla } from "./ifs";

export interface CRUD {
    crear(value: Categoria | Descuento | Producto | Subcategoria | Usuario | Color | Talla): Observable<Respuesta>,
    modificar(value: Categoria | Descuento | Producto | Subcategoria | Usuario | Color | Talla): Observable<Respuesta>,
    eliminar(value: Categoria | Descuento | Producto | Subcategoria | Usuario | Color | Talla): Observable<Respuesta>,
    listar(reset: boolean): Observable<Categoria[] | Descuento[] | Producto[] | Subcategoria[] | Usuario[] | Color[] | Talla[]>,
    obtener(value: Categoria | Descuento | Producto | Subcategoria | Usuario | Color | Talla): Observable<Categoria | Descuento | Producto | Subcategoria | Usuario | Color | Talla>
}
