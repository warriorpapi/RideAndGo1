import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuAdminPage } from './menu-admin.page';

const routes: Routes = [
  {
    path: 'administrar',
    loadChildren: () => import('../administrar/administrar.module').then(m => m.AdministrarPageModule)
  },
  {
    path: 'administrarViajes',
    loadChildren: () => import('../administrar-viajes/administrar-viajes.module').then(m => m.AdministrarViajesPageModule)
  },
  {
    path: '',
    component: MenuAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuAdminPageRoutingModule {}
