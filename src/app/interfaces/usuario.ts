export interface Usuario {
    apellido: string
    correo: string
    direccion?: string
    dui?: string,
    fecha_nac?: Date
    genero?: number
    id?: number
    id_tipo_usuario?: number
    img?: string
    nombre: string
    password: string,
    telefono?: string
    token?: string
    verificado?: number
}
