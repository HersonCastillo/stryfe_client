import { Observable } from "rxjs";
import { Categoria, Descuento, Producto, Subcategoria, Usuario, Respuesta, Color, Talla, Carrito } from "./ifs";

export interface CRUD {
    crear(value: Categoria | Descuento | Producto | Subcategoria | Usuario | Color | Talla | Carrito): Observable<Respuesta>,
    modificar(value: Categoria | Descuento | Producto | Subcategoria | Usuario | Color | Talla | Carrito): Observable<Respuesta>,
    eliminar(value: Categoria | Descuento | Producto | Subcategoria | Usuario | Color | Talla | Carrito): Observable<Respuesta>,
    listar(reset: boolean): Observable<Categoria[] | Descuento[] | Producto[] | Subcategoria[] | Usuario[] | Color[] | Talla[] | Carrito[]>,
    obtener(value: Categoria | Descuento | Producto | Subcategoria | Usuario | Color | Talla | Carrito): Observable<Categoria | Descuento | Producto | Subcategoria | Usuario | Color | Talla | Carrito>
}
