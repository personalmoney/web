import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuItem } from './models/menu-item';
import { SharedService } from './core/services/shared.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SqLiteService } from './core/services/sq-lite.service';
import { SchemaService } from './core/services/schema.service';
import { AuthService } from './services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  public appPages: MenuItem[] = [
    {
      title: 'Dashboard',
      url: 'dashboard',
      icon: 'home'
    },
    {
      title: 'Accounts',
      url: 'accounts',
      icon: 'university'
    },
    {
      title: 'Transactions',
      url: 'transactions',
      icon: 'exchange-alt'
    },
    {
      title: 'Entities',
      icon: 'building',
      url: 'entities',
    },
    {
      title: 'Reports',
      url: 'reports',
      icon: 'chart-pie'
    },

    {
      title: 'Settings',
      url: 'settings',
      icon: 'cog'
    },
    {
      title: 'About',
      url: 'about',
      icon: 'info-circle'
    }
  ];
  showMenu = false;
  userName = '';
  currentRoute: string = '';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private sharedService: SharedService,
    private sqLiteService: SqLiteService,
    private authService: AuthService,
    private schemaService: SchemaService,
    router: Router,
    private statusBar: StatusBar
  ) {
    this.initializeApp();

    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url.slice(1, event.url.length);
        if (this.currentRoute === 'login') {
          this.showMenu = false;
        }

      });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async ngOnInit() {
    this.getUserName();

    const info = await Device.getInfo();
    this.sharedService.isWeb = info.platform === 'web';
  }

  async getUserName() {
    this.userName = await this.authService.getUserName();
    if (this.userName === '') {
      setTimeout(() => {
        this.getUserName();
      }, 2000);
    } else {
      this.showMenu = true;
    }
  }

  async ngAfterViewInit() {
    await this.sqLiteService.initializePlugin();
    await this.sqLiteService.openDB();
    await this.schemaService.checkVersion();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
