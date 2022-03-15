import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from '../about/about.component';
import { AuthGuard } from '../core/guards/auth.gaurd';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
    {
        path: '',
        component: IndexComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                canLoad: [AuthGuard]
            },
            { path: 'about', component: AboutComponent, canLoad: [AuthGuard] },
            {
                path: 'accounts',
                loadChildren: () => import('../accounts/accounts.module').then(m => m.AccountsModule),
                canLoad: [AuthGuard]
            },
            {
                path: 'settings',
                loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule),
                canLoad: [AuthGuard]
            },
            {
                path: 'folder/:id',
                loadChildren: () => import('../folder/folder.module').then(m => m.FolderPageModule),
                canLoad: [AuthGuard]
            },
            {
                path: 'entities',
                loadChildren: () => import('../entities/entities.module').then(m => m.EntitiesModule),
                canLoad: [AuthGuard]
            },
            {
                path: 'reports',
                loadChildren: () => import('../reports/reports.module').then(m => m.ReportsModule),
                canLoad: [AuthGuard]
            },
            {
                path: 'transactions',
                loadChildren: () => import('../transaction/transaction.module').then(m => m.TransactionModule),
                canLoad: [AuthGuard]
            }]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class TabsRoutingModule { }
