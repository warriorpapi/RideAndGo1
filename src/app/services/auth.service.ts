import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore, private router: Router) { }

  async registerUser(email: string, password: string, role: string = 'user') {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const userId = userCredential.user?.uid;
      if (userId) {
        await this.firestore.collection('users').doc(userId).set({
          email: email,
          role: role // Se define el rol del usuario
        });
      }
      return userCredential;
    } catch (error) {
      console.error('Error registrando usuario:', error);
      throw error;
    }
  }
  
  // Método para registrar un usuario
  signUp(email: string, password: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  // Método para iniciar sesión
  login(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Método para cerrar sesión
  logout(): Promise<void> {
    return this.afAuth.signOut();
  }


  resetPassword(email:string){
    this.afAuth.sendPasswordResetEmail(email);
    
  }

  getCurrentUser() {
    return this.afAuth.authState;
  }

  getUserData(userId: string) {
    return this.firestore.collection('users').doc(userId).valueChanges();
  }

}
