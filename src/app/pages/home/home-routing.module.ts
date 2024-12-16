import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { authGuard } from 'src/app/guards/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'reservas',
        loadChildren: () => import('../reservas/reservas.module').then(m => m.ReservasPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('../perfil/perfil.module').then(m => m.PerfilPageModule)
      },
      {
        path: 'viajes',
        loadChildren: () => import('../viajes/viajes.module').then(m => m.ViajesPageModule)
      },
      {
        path: 'menu-admin',
        loadChildren: () => import('../menu-admin/menu-admin.module').then(m => m.MenuAdminPageModule)
      },
      {
        path: 'inicio',
        loadChildren: () => import('../inicio/inicio.module').then(m => m.InicioPageModule)
      },
      {
        path: 'administrar',
        canActivate: [authGuard],
        loadChildren: () => import('../administrar/administrar.module').then(m => m.AdministrarPageModule),
      },
      {
        path: 'administrar-viajes',
        canActivate: [authGuard],
        loadChildren: () => import('../administrar-viajes/administrar-viajes.module').then(m => m.AdministrarViajesPageModule),
      },
      {
        path: 'editar-viaje/:id',
        canActivate: [authGuard],
        loadChildren: () => import('../editar-viaje/editar-viaje.module').then(m => m.EditarViajePageModule),
      },
      {
        path: '',
        redirectTo: '/home/inicio',  // Cambia esto a una ruta específica como /home/inicio
        pathMatch: 'full'
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}

