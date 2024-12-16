import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.page.html',
  styleUrls: ['./menu-admin.page.scss'],
})
export class MenuAdminPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }



  funcionUsuarios() {
    this.router.navigate(['home/','administrar']);//con esto dejamos al usuario en la opcion Inicio del tab
  }

  funcionViajes() {
    this.router.navigate(['home/','administrar-viajes']);//con esto dejamos al usuario en la opcion Inicio del tab
  }
}
