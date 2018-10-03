export interface Producto {
    id: string,
    descripcion: string,
    img: string,
    precio: number,
    cantidad: number,
    id_talla: number,
    id_color: number,
    id_subcategoria_prod: number,
    id_rubro: number,
    id_estado_prod: number,
    stock_existente: number,
    stock_minimo: number
}
