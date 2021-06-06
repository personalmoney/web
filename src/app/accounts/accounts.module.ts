import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';
import { AccountsRoutingModule } from './accounts.routing.module';
import { IndexComponent } from './index/index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SaveComponent } from './save/save.component';
import { AccountListComponent } from './index/account-list/account-list.component';

@NgModule({
  declarations: [
    IndexComponent,
    AccountListComponent,
    SaveComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    AccountsRoutingModule,
    FontAwesomeModule
  ]
})
export class AccountsModule { }
