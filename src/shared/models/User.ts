export interface User{
    clave:string;
    correo: string;
    idUsuario?: number;
    nombreCompleto: string;
    rol: string;
    token?: string;
}