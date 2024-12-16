import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdministrarViajesPageRoutingModule } from './administrar-viajes-routing.module';

import { AdministrarViajesPage } from './administrar-viajes.page';
import { QrCodeModule } from 'ng-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdministrarViajesPageRoutingModule,
    ReactiveFormsModule,
    QrCodeModule
  ],
  declarations: [AdministrarViajesPage]
})
export class AdministrarViajesPageModule {}
