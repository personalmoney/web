import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { AccountState } from '../accounts/store/store';
import { AccountTypeState } from '../entities/account-type/store/store';
import { CategoryState } from '../entities/categories/store/category-state';
import { PayeeState } from '../entities/payees/store/store';
import { TagState } from '../entities/tags/store/store';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxsModule.forFeature([AccountState]),
    NgxsModule.forFeature([AccountTypeState]),
    NgxsModule.forFeature([CategoryState]),
    NgxsModule.forFeature([PayeeState]),
    NgxsModule.forFeature([TagState]),
  ]
})
export class StoreModule { }
