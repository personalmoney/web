import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuItem } from './models/menu-item';
import { environment } from 'src/environments/environment';
import { SharedService } from './core/services/shared.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Meta } from '@angular/platform-browser';
import { SqLiteService } from './core/services/sq-lite.service';
import { SchemaService } from './core/services/schema.service';
import { AuthService } from './services/auth.service';
import { NavigationEnd, Router } from '@angular/router';

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
      url: 'folder/Reports',
      icon: 'chart-pie'
    },

    {
      title: 'Settings',
      url: 'settings',
      icon: 'cog'
    },
    {
      title: 'About',
      url: 'folder/About',
      icon: 'info-circle'
    }
  ];
  showMenu = true;
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
      });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

    });
  }

  ngOnInit() {
    this.sharedService.showMenu$
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.showMenu = result;
      });
    this.getUserName();
  }

  async getUserName() {
    this.userName = await this.authService.getUserName();
    if (this.userName === '') {
      setTimeout(() => {
        this.getUserName();
      }, 2000);
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
