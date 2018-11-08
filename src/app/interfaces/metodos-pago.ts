export interface MetodosPago {
    id?: number,
    numero: string,
    correo: string,
    id_cliente?: number,
    id_forma?: number,
    createdAt?: Date,
    updatedAt?: Date
}
