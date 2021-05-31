import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconPickerComponent } from './components/icon-picker/icon-picker.component';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActionsComponent } from './components/actions/actions.component';
import { StoreModule } from '../store/store.module';


@NgModule({
  declarations: [
    IconPickerComponent,
    ActionsComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    StoreModule,
    IonicModule
  ],
})
export class CoreModule { }
