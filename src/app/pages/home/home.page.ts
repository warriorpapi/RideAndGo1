import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Usuario } from 'src/app/models/Usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  isAdmin: boolean;

  public mensajeBienuti:String | undefined;

  public usuario: Usuario | null = null; // Inicialmente nulo

  rut:string="";

  constructor(private router: Router,private navController: NavController,private usuarioService: UsuarioService) {
    const rol = localStorage.getItem('rol');
    this.isAdmin = rol === 'admin';

  }

  /**
   * home
 :void  */
  public home():void {
    this.router.navigate(['/home']);

  }

  async ngOnInit() {
    const rutCokie = localStorage.getItem('idUsuario');
    if (rutCokie) {
      this.rut = rutCokie; 
      const datosUsuario = await this.usuarioService.getUsuario(rutCokie);
      
      if (datosUsuario) {
        this.usuario = datosUsuario; 
        this.mensajeBienuti=" Welcom Back: "+this.usuario.getUsuario();

      } else {
        console.log('Usuario no encontrado');
      }
   
    }

  }


  logout(){
    localStorage.removeItem('rol');
    localStorage.removeItem('idUsuario');
    this.navController.navigateRoot('/login');
  }

}
