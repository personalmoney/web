import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntitiesRoutingModule } from './entities.routing.module';
import { IonicModule } from '@ionic/angular';
import { IndexComponent } from './index/index.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    IndexComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    EntitiesRoutingModule,
    FontAwesomeModule
  ]
})
export class EntitiesModule { }
