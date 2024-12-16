// firebase-repository.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from 'src/app/models/Usuario';
import { UsuarioRepository } from 'src/app/repository/UsuarioRepository';


@Injectable({
  providedIn: 'root'
})
export class FirebaseRepository implements UsuarioRepository {
    constructor(private firestore: AngularFirestore) {}

    async createUsuario(usuario: Usuario): Promise<boolean> {
      try {
        await this.firestore.collection('usuarios').doc(usuario.getRut()).set({ ...usuario });
        return true;
      } catch (error) {
        console.error("Error creating user:", error);
        return false;
      }
    }
  
    async getUsuario(rut: string): Promise<Usuario | undefined> {
      const doc = await this.firestore.collection('usuarios').doc(rut).get().toPromise();
      return doc.exists ? new Usuario(/* Map the document data to Usuario */) : undefined;
    }
  
    async getUsuarios(): Promise<Usuario[]> {
      const snapshot = await this.firestore.collection('usuarios').get().toPromise();
      return snapshot.docs.map(doc => new Usuario(/* Map the document data to Usuario */));
    }
  
    async updateUsuario(rut: string, nuevoUsuario: Usuario): Promise<boolean> {
      try {
        await this.firestore.collection('usuarios').doc(rut).update({ ...nuevoUsuario });
        return true;
      } catch (error) {
        console.error("Error updating user:", error);
        return false;
      }
    }
  
    async deleteUsuario(rut: string): Promise<boolean> {
      try {
        await this.firestore.collection('usuarios').doc(rut).delete();
        return true;
      } catch (error) {
        console.error("Error deleting user:", error);
        return false;
      }
    }
  
    async login(correo: string, contrasena: string): Promise<boolean> {
      // Implementar lógica de inicio de sesión utilizando Firebase Auth
    }
  
    async recuperarUsuario(correo: string): Promise<Usuario | undefined> {
      // Implementar lógica para recuperar usuario
    }
}
