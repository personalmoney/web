import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: IndexComponent },
    { path: 'account-types', loadChildren: () => import('./account-type/account-type.module').then(c => c.AccountTypeModule) },
    { path: 'categories', loadChildren: () => import('./categories/categories.module').then(c => c.CategoriesModule) },
    { path: 'payees', loadChildren: () => import('./payees/payees.module').then(c => c.PayeesModule) },
    { path: 'tags', loadChildren: () => import('./tags/tags.module').then(c => c.TagsModule) },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EntitiesRoutingModule { }
