import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SaveComponent } from './save/save.component';
import { IndexComponent } from './index/index.component';
import { AccountTypeRoutingModule } from './account-type.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
    declarations: [
        SaveComponent,
        IndexComponent
    ],
    imports: [
        CommonModule,
        IonicSelectableModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        AccountTypeRoutingModule,
        FontAwesomeModule
    ]
})
export class AccountTypeModule { }
