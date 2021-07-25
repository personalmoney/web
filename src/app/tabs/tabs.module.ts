import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { TabsRoutingModule } from './tabs-routing.module';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    TabsRoutingModule,
    CoreModule,
    FontAwesomeModule,
    IonicModule
  ]
})
export class TabsModule { }
