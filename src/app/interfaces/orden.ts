export interface Orden {
    id?: number,
    monto_total: number,
    direccion_aux?: number,
    token_verif?: string,
    id_estado: number,
    id_detalle_forma: number,
    createdAt?: Date,
    updatedAt?: Date
}
