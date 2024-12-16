// usuario.service.ts
import { Injectable } from '@angular/core';
import { UsuarioRepository } from './UsuarioRepository';
import { Usuario } from 'src/app/models/Usuario';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
    
    constructor(private usuarioRepository: UsuarioRepository) {}

    async addUsuario(usuario: Usuario): Promise<void> {
        await this.usuarioRepository.addUsuario(usuario);
    }

    async getUsuarios(): Promise<Usuario[]> {
        return this.usuarioRepository.getUsuarios();
    }

    async getUsuario(rut: string): Promise<Usuario | undefined> {
        return this.usuarioRepository.getUsuario(rut);
    }
}
