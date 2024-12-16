import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViajesPageRoutingModule } from './viajes-routing.module';

import { ViajesPage } from './viajes.page';
import { QrCodeModule } from 'ng-qrcode';
import { BarcodeScanningModalComponentV1 } from './barcode-scanning-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViajesPageRoutingModule,
    QrCodeModule,
    ReactiveFormsModule
  ],
  declarations: [ViajesPage,BarcodeScanningModalComponentV1]
})
export class ViajesPageModule {}
