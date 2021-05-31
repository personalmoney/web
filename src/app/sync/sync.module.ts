import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyncComponent } from './sync.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    SyncComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    SyncComponent
  ]
})
export class SyncModule { }
