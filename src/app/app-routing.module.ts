import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard'; // Asegúrate de que el nombre sea correcto

const routes: Routes = [
  {
    path: 'home',
    canActivate: [authGuard], // Aplica el guard aquí
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule),
  },
  {
    path: 'recuperar-contrasena',
    loadChildren: () => import('./pages/recuperar-contrasena/recuperar-contrasena.module').then(m => m.RecuperarContrasenaPageModule),
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then(m => m.InicioPageModule),
  },
  {
    path: 'menu-admin',
    loadChildren: () => import('./pages/menu-admin/menu-admin.module').then(m => m.MenuAdminPageModule),
  },
  {
    path: 'home/administrar',
    loadChildren: () => import('./pages/administrar/administrar.module').then(m => m.AdministrarPageModule),
  },
  {
    path: 'viajes',
    loadChildren: () => import('./pages/viajes/viajes.module').then(m => m.ViajesPageModule),
  },
  {
    path: 'home/administrar-viajes',
    loadChildren: () => import('./pages/administrar-viajes/administrar-viajes.module').then(m => m.AdministrarViajesPageModule),
  },
  {
    path: 'home/editar-viaje/:id',
    loadChildren: () => import('./pages/editar-viaje/editar-viaje.module').then(m => m.EditarViajePageModule),
  },
  {
    path: '**',
    loadChildren: () => import('./pages/not-found404/not-found404.module').then(m => m.NotFound404PageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
