export interface User{
    clave:string;
    correo: string;
    idUsuario?: number;
    nombreCompleto: string;
    rol: string;
    active: boolean;
    confirmarClave?: string;
    token?: string;
}