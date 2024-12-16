import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from 'src/app/models/Usuario';
import { UsuarioRepository } from 'src/app/repository/UsuarioRepository';
import { Observable } from 'rxjs';
import { Vehiculo } from '../models/Vehiculo';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseRepository implements UsuarioRepository {

  private usuariosCollection = this.firestore.collection('usuarios'); // Colección en Firestore

  constructor(private firestore: AngularFirestore,private authService:AuthService) {

    //this.insertarAdmin();
  }



  // Crear un nuevo usuario
  async createUsuario(usuario: Usuario): Promise<boolean> {
    try {
      const usuarioData: any = {
        fecha_nacimiento: usuario.getFechaNacimiento(),
        rut: usuario.getRut(),
        tipo_usuario: usuario.getTipoUsuario(),
        usuario: usuario.getUsuario(),
        contrasena: usuario.getContrasena(),
        contrasena_conf: usuario.getContrasenaConf(),
        email: usuario.getEmail(),
      };
       
      var respuesta= await this.authService.signUp(usuario.getEmail(),usuario.getContrasena());

      if(respuesta){
        console.log("Cuenta creada con exito");
      }

      if (usuario.getVehiculo()) {
        usuarioData.vehiculo = usuario.getVehiculo()?.toPlainObject();  
      }

      await this.usuariosCollection.doc(usuario.getRut()).set(usuarioData);


      return true;
    } catch (error) {
      console.error("Error al crear usuario:", error);
      return false;
    }
  }

  private async dtUsuario(usuario: Usuario){
    try {
      const usuarioData: any = {
        fecha_nacimiento: usuario.getFechaNacimiento(),
        rut: usuario.getRut(),
        tipo_usuario: usuario.getTipoUsuario(),
        usuario: usuario.getUsuario(),
        contrasena: usuario.getContrasena(),
        contrasena_conf: usuario.getContrasenaConf(),
        email: usuario.getEmail(),
      };

      if (usuario.getVehiculo()) {
        usuarioData.vehiculo = usuario.getVehiculo()?.toPlainObject();  
      }

      await this.usuariosCollection.doc(usuario.getRut()).set(usuarioData);


      return true;
    } catch (error) {
      console.error("Error al update usuario:", error);
      return false;
    }
  }



  private async insertarAdmin(){
    try {
    var admin= new Usuario("1990-01-01", "12345678-9", "admin", "admin", "123456¡", "123456¡", "admin@gmail.com")
      this.createUsuario(admin);

    } catch (error) {
      console.error("Error al insertar admin:", error);
    }
  }

  // Obtener un usuario por RUT
  async getUsuario(rut: string): Promise<Usuario | undefined> {
    try {
      const doc = await this.usuariosCollection.doc(rut).get().toPromise();
    
      if (doc) {
        const data = doc.data() as { // Aquí hacemos la afirmación de tipo
          fecha_nacimiento: string;
          rut: string;
          tipo_usuario: string;
          usuario: string;
          contrasena: string;
          contrasena_conf: string;
          email: string;
          vehiculo: any;
        };

        return new Usuario(
          data.fecha_nacimiento,
          data.rut,
          data.tipo_usuario,
          data.usuario,
          data.contrasena,
          data.contrasena_conf,
          data.email,
          data.vehiculo 
        );
      } else {
        return undefined;
    
    } 
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      return undefined;
    }
  }

  // Obtener todos los usuarios
  async getUsuarios(): Promise<Usuario[]> {
    try {
      const snapshot = await this.usuariosCollection.get().toPromise();
      if (snapshot) {
        return snapshot.docs.map(doc => {
          const data = doc.data() as { // Aquí hacemos la afirmación de tipo
            fecha_nacimiento: string;
            rut: string;
            tipo_usuario: string;
            usuario: string;
            contrasena: string;
            contrasena_conf: string;
            email: string;
            vehiculo: any; // Asumiendo que vehiculo es un objeto, puedes ajustar el tipo si es necesario
          };
  
          // Retorna el nuevo objeto Usuario con los datos mapeados
          return new Usuario(
            data.fecha_nacimiento,
            data.rut,
            data.tipo_usuario,
            data.usuario,
            data.contrasena,
            data.contrasena_conf,
            data.email,
            data.vehiculo // Aquí deberías mapear el vehículo correctamente si es necesario
          );
        });
      }
      return [];
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      return [];
    }
  }
  

  // Actualizar un usuario
  async updateUsuario(rut: string, nuevoUsuario: Usuario): Promise<boolean> {
    try {

      this.dtUsuario(nuevoUsuario);

      /*await this.usuariosCollection.doc(rut).update({
        fecha_nacimiento: nuevoUsuario.getFechaNacimiento(),
        rut: nuevoUsuario.getRut(),
        tipo_usuario: nuevoUsuario.getTipoUsuario(),
        usuario: nuevoUsuario.getUsuario(),
        contrasena: nuevoUsuario.getContrasena(),
        contrasena_conf: nuevoUsuario.getContrasenaConf(),
        email: nuevoUsuario.getEmail(),
        vehiculo: nuevoUsuario.getVehiculo() // Actualiza el vehículo si lo tiene
      });*/

      return true;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      return false;
    }
  }

  // Eliminar un usuario
  async deleteUsuario(rut: string): Promise<boolean> {
    try {
      await this.usuariosCollection.doc(rut).delete();
      return true;
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      return false;
    }
  }

  // Login del usuario
  async login(correo: string, contrasena: string): Promise<boolean> {
    try {
      // Buscar al usuario en Firestore
      
      
      const usuarios = await this.getUsuarios();
      const usuario = usuarios.find(user => user.getEmail() === correo);
      var usuarioAuth=await this.authService.login(correo,contrasena);

      if (usuarioAuth&&usuario) {
        localStorage.clear();
        localStorage.setItem('rol', usuario.getTipoUsuario());
        localStorage.setItem('idUsuario', usuario.getRut());
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error en el login:", error);
      return false;
    }
  }

  // Recuperar usuario por correo
  async recuperarUsuario(correo: string): Promise<boolean> {
    try {
      const usuarios = await this.getUsuarios();
      const existe = usuarios.find(user => user.getEmail() === correo);
      return !!existe; // Devuelve true si existe, false si no
    } catch (error) {
      console.error("Error al recuperar usuario:", error);
      return false;
    }
  }
}
