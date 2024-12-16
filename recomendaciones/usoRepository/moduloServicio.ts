import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { LocalStorageRepository } from './repositories/local-storage-repository';
import { FirebaseRepository } from './repositories/firebase-repository';
import { UsuarioService } from './services/usuario.service';
import { UsuarioRepository } from './repositories/usuario-repository.interface';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    // tus componentes
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
  ],
  providers: [
    UsuarioService,
    { provide: UsuarioRepository, useClass: LocalStorageRepository } // o FirebaseRepository
    ,{ provide: UsuarioRepository, useClass: FirebaseRepository } // Cambiar la implementación
  ],
  bootstrap: [/* tu componente raíz */]
})
export class AppModule { }
