// local-storage-repository.ts
import { Injectable } from '@angular/core';
import { UsuarioRepository } from './UsuarioRepository';
import { Usuario } from 'src/app/models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageRepository implements UsuarioRepository {
    
    private storageKey = 'usuarios';

    async addUsuario(usuario: Usuario): Promise<void> {
        const usuarios = await this.getUsuarios();
        usuarios.push(usuario);
        localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
    }

    async getUsuarios(): Promise<Usuario[]> {
        const usuariosRaw = localStorage.getItem(this.storageKey);
        return usuariosRaw ? JSON.parse(usuariosRaw) : [];
    }

    async getUsuario(rut: string): Promise<Usuario | undefined> {
        const usuarios = await this.getUsuarios();
        return usuarios.find(u => u.getRut() === rut);
    }
}
