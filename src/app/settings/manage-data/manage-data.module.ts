import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { ManageDataRoutingModule } from './manage-data.routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { IonicModule } from '@ionic/angular';
import { ImportService } from './services/import.service';
import { ExportService } from './services/export.service';
import { DataViewComponent } from './data-view/data-view.component';


@NgModule({
  declarations: [
    IndexComponent,
    DataViewComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    IonicModule,
    ManageDataRoutingModule
  ],
  providers: [
    ImportService,
    ExportService
  ]
})
export class ManageDataModule { }
