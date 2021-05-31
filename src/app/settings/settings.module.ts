import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SettingsRoutingModule } from './settings.routing.module';

@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
