// local-storage-repository.ts
import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario';
import { UsuarioRepository } from './UsuarioRepository';
import { Storage } from '@ionic/storage';
import { Vehiculo } from '../models/Vehiculo';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageRepository implements UsuarioRepository {
    

    constructor(private storage: Storage) { 
      this.init();
    }
  
    async init() {
      await this.storage.create();
      const usuariosRaw: any[] = await this.storage.get('usuarios') || [];

      const usuarios = [
        // Usuarios con vehículos
        new Usuario("1990-01-01", "12345678-9", "admin", "admin", "1234!", "1234!", "admin@gmail.com", new Vehiculo("XY 12 ZW", "Ford", "Fiesta", "Azul", 4, "12345678-9")),
        new Usuario("1985-05-15", "98765432-1", "usuario", "usuario1", "Passw0rd!", "Passw0rd!", "user1@duocuc.cl", new Vehiculo("RS 34 TU", "Kia", "Rio", "Blanco", 4, "98765432-1")),
        new Usuario("2000-07-20", "65432109-8", "usuario", "usuario4", "Passw0rd!", "Passw0rd!", "user4@duocuc.cl", new Vehiculo("AB 56 CD", "Kia", "Rio", "Gris", 4, "65432109-8")),
        new Usuario("2000-07-20", "23432139-8", "usuario", "usuario5", "Passw0rd!", "Passw0rd!", "user5@duocuc.cl", new Vehiculo("EF 78 GH", "Hyundai", "Accent", "Rojo", 4, "23432139-8")),
        
        // Usuarios sin vehículos
        new Usuario("1992-12-12", "87654321-0", "usuario", "usuario2", "Passw0rd!", "Passw0rd!", "user2@duocuc.cl", undefined), // Sin vehículo
        new Usuario("1995-03-03", "76543210-9", "usuario", "usuario3", "Passw0rd!", "Passw0rd!", "user3@duocuc.cl", undefined)  // Sin vehículo
    ];

    for (const usuario of usuarios) {
        await this.createUsuario(usuario);
    }



      if (usuariosRaw.length === 0) {
  
        //usuarios.forEach((usuario)=>this.createUsuario(usuario));
      }
    }
    
  
    //aquí vamos a crear toda nuestra lógica de programación
    //DAO:
  
    private async crearUsuarios(): Promise<Usuario[]> {
      const usuariosRaw: any[] = (await this.storage.get('usuarios')) || [];
      return this.mapToUsuarios(usuariosRaw);
  }
  
  private mapToUsuarios(usuariosRaw: any[]): Usuario[] {
      return usuariosRaw.map(usu => new Usuario(
          usu.fecha_nacimiento,
          usu.rut,
          usu.tipo_usuario,
          usu.usuario,
          usu.contrasena,
          usu.contrasena_conf,
          usu.email,
          usu.vehiculo
      ));
  }
  
  public async createUsuario(usuario: Usuario): Promise<boolean> {
      const usuarios: Usuario[] = await this.crearUsuarios();
  
      if (usuarios.find((usu) => usu.getRut() === usuario.getRut()  || usu.getEmail()==usuario.getEmail()) != undefined) {
          return false;
      }
  
      usuarios.push(usuario);
      await this.storage.set('usuarios', usuarios);
      return true;
  }
  
  
  
    public async getUsuario(rut: string): Promise<Usuario | undefined> {
      //const usuarios: Usuario[] = (await this.storage.get('usuarios')) || [];
      const usuarios: Usuario[] = await this.crearUsuarios();
  
      return usuarios.find((usu) => usu.getRut() === rut);
    }
  
    public async getUsuarios(): Promise<Usuario[]> {
      //return (await this.storage.get('usuarios')) || [];
      return this.crearUsuarios();
    }
  
    public async updateUsuario(rut: string, nuevoUsuario: Usuario): Promise<boolean> {
      //const usuarios: Usuario[] = (await this.storage.get('usuarios')) || [];
      const usuarios: Usuario[] = await this.crearUsuarios();
      const indice = usuarios.findIndex((usu) => usu.getRut() === rut);
      if (indice === -1) {
        return false;
      }
  
      usuarios[indice] = nuevoUsuario;
      await this.storage.set('usuarios', usuarios);
      return true;
    }
  
    public async deleteUsuario(rut: string): Promise<boolean> {
      //const usuarios: Usuario[] = (await this.storage.get('usuarios')) || [];
      const usuarios: Usuario[] = await this.crearUsuarios();

      const indice = usuarios.findIndex((usu) => usu.getRut() === rut);
      if (indice === -1) {
        return false;
      }
      usuarios.splice(indice, 1);
      await this.storage.set('usuarios', usuarios);
      return true;
    }
  
    public async login(correo: string, contrasena: string): Promise<boolean> {
      const usuarios: Usuario[] = await this.crearUsuarios();
      //return usuarios.find((elemento) => elemento.email === correo && elemento.contrasena === contrasena);
      const usuario = usuarios.find((elemento) => elemento.getEmail() === correo && elemento.getContrasena() === contrasena);
      if (usuario) {
        localStorage.clear();
        localStorage.setItem('rol', usuario.getTipoUsuario()); 
        localStorage.setItem('idUsuario', usuario.getRut()); 
        return true;
      }
      return false;
  
    
    }
  
    public async recuperarUsuario(correo: string): Promise<boolean> {
      const usuarios: Usuario[] = (await this.storage.get('usuarios')) || [];
      
      // Si los usuarios son instancias de Usuario
      //const existe = usuarios.find((usuario) => usuario instanceof Usuario && usuario.getEmail() === correo);
    
      // Si los usuarios son objetos simples
       const existe = usuarios.find((usuario) => usuario.email === correo);
    
      return !!existe; // Devuelve true si existe, false si no
    }
    
  
  
}