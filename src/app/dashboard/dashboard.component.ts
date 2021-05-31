import { Component, OnInit } from '@angular/core';
import { AccountType } from '../entities/account-type/models/account-type';
import { BaseComponent } from '../core/helpers/base.component';
import { Account } from '../accounts/models/account';
import { SharedService } from '../core/services/shared.service';
import { combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { StoreService } from '../store/store.service';
import { Store } from '@ngxs/store';
import { SpinnerVisibilityService } from 'ng-http-loader';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends BaseComponent implements OnInit {

  accounts: Account[] = [];
  accountTypes: AccountType[] = [];
  totalBalance = 0;
  dashboardData: any[] = [];
  isWeb = false;

  constructor(
    private router: NavController,
    private storeService: StoreService,
    private store: Store,
    private spinner: SpinnerVisibilityService,
    private shared: SharedService
  ) {
    super();
    shared.isWeb
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(c => {
        this.isWeb = c;
      });
  }

  ngOnInit() {
    this.storeService.getAccounts();
    this.storeService.getAccountTypes();

    const loader = [];
    loader.push(this.store.select(c => c.accounts.data));
    loader.push(this.store.select(c => c.accountTypes.data));

    combineLatest(loader)
      .subscribe(([data1, data2]) => {
        if (data1 && data2) {
          this.accountTypes = data2 as AccountType[];
          this.accounts = data1 as Account[];
          this.mapData();
          this.spinner.hide();
        }
      });
  }

  mapData() {

    this.accountTypes.map(c => {
      let currentAccounts;
      if (this.isWeb) {
        currentAccounts = this.accounts.filter(d => d.accountTypeId === c.id
          && d.excludeFromDashboard === false
          && d.isActive === true);
      }
      else {
        currentAccounts = this.accounts.filter(d => d.accountTypeLocalId === c.local_id
          && d.excludeFromDashboard === this.shared.falseValue);
      }
      if (currentAccounts.length <= 0) {
        return;
      }
      let balance = 0;
      currentAccounts.map(e => balance += e.balance);
      const data = {
        name: c.name,
        icon: c.icon,
        currentAccounts,
        expanded: true,
        balance
      };
      this.dashboardData.push(data);
    });

    this.accounts.map(c => {
      if (c.includeInBalance === false) {
        return;
      }
      this.totalBalance += c.balance;
    });
  }

  create() {
    this.router.navigateForward(['transactions/save']);
  }

  showTrans(id: number) {
    this.router.navigateRoot(['/transactions/account/', id]);
  }
}
