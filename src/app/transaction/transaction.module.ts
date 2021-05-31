import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { TransactionRoutingModule } from './transaction-routing.module';
import { SaveComponent } from './save/save.component';
import { IonicModule } from '@ionic/angular';
import { SyncModule } from '../sync/sync.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    IndexComponent,
    SaveComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    FormsModule,
    SyncModule,
    TransactionRoutingModule
  ]
})
export class TransactionModule { }
