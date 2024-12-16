import { Injectable } from '@angular/core';
import { Usuario } from '../models/Usuario';
import { Storage } from '@ionic/storage-angular';
import { UsuarioRepository } from '../repository/UsuarioRepository';
import { LocalStorageRepository } from '../repository/LocalStorageRepository';
import { FirebaseRepository } from '../repository/FirebaseRepository';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
    
    constructor(private usuarioRepository: FirebaseRepository) { // Inyección de la interfaz
      this.init();
    }

    async init() {
      // Inicializa si es necesario
    }

    public async createUsuario(usuario: Usuario): Promise<boolean> {
      return this.usuarioRepository.createUsuario(usuario);
    }

    public async getUsuario(rut: string): Promise<Usuario | undefined> {
      return this.usuarioRepository.getUsuario(rut);
    }

    public async getUsuarios(): Promise<Usuario[]> {
      return this.usuarioRepository.getUsuarios();
    }

    public async updateUsuario(rut: string, nuevoUsuario: Usuario): Promise<boolean> {
      return this.usuarioRepository.updateUsuario(rut, nuevoUsuario);
    }

    public async deleteUsuario(rut: string): Promise<boolean> {
      return this.usuarioRepository.deleteUsuario(rut);
    }

    public async login(correo: string, contrasena: string): Promise<boolean> {
      return this.usuarioRepository.login(correo,contrasena);
    }

    public async recuperarUsuario(correo: string): Promise<boolean> {
      return this.usuarioRepository.recuperarUsuario(correo);
    }
    
    
}
