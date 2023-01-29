import { NgModule, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { environment } from 'src/environments/environment';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CoreModule } from './core/core.module';
import { NgxsModule } from '@ngxs/store';
import { SyncModule } from './sync/sync.module';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { TransactionModule } from './transaction/transaction.module';
import { AboutComponent } from './about/about.component';
import { WINDOW_PROVIDERS } from './services/window.providers';
import { LogoutComponent } from './logout/logout.component';

@NgModule({
  declarations: [AppComponent, DashboardComponent, AboutComponent, LogoutComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    TransactionModule,
    CoreModule,
    SyncModule,
    NgxsModule.forRoot([], {
      developmentMode: !environment.production
    }),
    NgHttpLoaderModule.forRoot(),
    FontAwesomeModule
  ],
  providers: [
    WINDOW_PROVIDERS,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'INR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, fab);
  }
}
