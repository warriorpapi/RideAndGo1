// usuario-repository.interface.ts

import { Usuario } from "src/app/models/Usuario";


export interface UsuarioRepository {
    addUsuario(usuario: Usuario): Promise<void>;
    getUsuarios(): Promise<Usuario[]>;
    getUsuario(rut: string): Promise<Usuario | undefined>;
    // Agrega otros métodos según sea necesario
}
