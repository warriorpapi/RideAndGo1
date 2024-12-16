// usuario-repository.interface.ts
import { Usuario } from '../models/Usuario';

export interface UsuarioRepository {
    createUsuario(usuario: Usuario): Promise<boolean>;
    getUsuario(rut: string): Promise<Usuario | undefined>;
    getUsuarios(): Promise<Usuario[]>;
    updateUsuario(rut: string, nuevoUsuario: Usuario): Promise<boolean>;
    deleteUsuario(rut: string): Promise<boolean>;
    login(correo: string, contrasena: string): Promise<boolean>;
    recuperarUsuario(correo: string): Promise<boolean>

}
