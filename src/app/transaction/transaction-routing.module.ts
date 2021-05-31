import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { SaveComponent } from './save/save.component';

const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: IndexComponent },
    { path: 'account/:accountId', component: IndexComponent },
    { path: 'save', component: SaveComponent },
    { path: 'edit/:id', component: SaveComponent },
    { path: 'save/account/:accountId', component: SaveComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TransactionRoutingModule { }
