import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PayeesRoutingModule } from './payees.routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IndexComponent } from './index/index.component';
import { SaveComponent } from './save/save.component';


@NgModule({
  declarations: [
    IndexComponent,
    SaveComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PayeesRoutingModule,
    FontAwesomeModule
  ]
})
export class PayeesModule { }
