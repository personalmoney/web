import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CategoriesRoutingModule } from './categories.routing.module';
import { IndexComponent } from './index/index.component';
import { SaveComponent } from './save/save.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';

@NgModule({
  declarations: [
    IndexComponent,
    SaveComponent,
    SubCategoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CategoriesRoutingModule,
    FontAwesomeModule
  ]
})
export class CategoriesModule { }
