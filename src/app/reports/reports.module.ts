import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TransactionsComponent } from './transactions/transactions.component';
import { FiltersComponent } from './transactions/filters/filters.component';
import { IonicSelectableModule } from 'ionic-selectable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    IndexComponent,
    TransactionsComponent,
    FiltersComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
