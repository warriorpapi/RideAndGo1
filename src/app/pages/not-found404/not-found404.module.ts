import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotFound404PageRoutingModule } from './not-found404-routing.module';

import { NotFound404Page } from './not-found404.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotFound404PageRoutingModule
  ],
  declarations: [NotFound404Page]
})
export class NotFound404PageModule {}
