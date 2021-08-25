import { Component, OnInit } from '@angular/core';
import { AccountType } from '../entities/account-type/models/account-type';
import { BaseComponent } from '../core/helpers/base.component';
import { Account } from '../accounts/models/account';
import { SharedService } from '../core/services/shared.service';
import { combineLatest } from 'rxjs';
import { ModalController, NavController } from '@ionic/angular';
import { StoreService } from '../store/store.service';
import { Store } from '@ngxs/store';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { AccountState } from '../accounts/store/store';
import { AccountTypeState } from '../entities/account-type/store/store';
import { SaveComponent } from '../transaction/save/save.component';

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

  constructor(
    private router: NavController,
    private storeService: StoreService,
    private store: Store,
    private modal: ModalController,
    private spinner: SpinnerVisibilityService,
    public shared: SharedService
  ) {
    super();
  }

  ngOnInit() {
    this.storeService.getAccounts();
    this.storeService.getAccountTypes();

    const loader = [];
    loader.push(this.store.select(AccountState.getSortedData));
    loader.push(this.store.select(AccountTypeState.getSortedData));

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
    this.dashboardData = [];
    this.totalBalance = 0;
    this.accountTypes.map(c => {
      let currentAccounts;
      if (this.shared.isWeb) {
        currentAccounts = this.accounts.filter(d => d.account_type_id === c.id
          && d.exclude_from_dashboard === false
          && d.is_active === true);
      }
      else {
        currentAccounts = this.accounts.filter(d => d.account_type_local_id === c.local_id
          && d.exclude_from_dashboard === this.shared.falseValue);
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
      if (c.include_in_balance === false) {
        return;
      }
      this.totalBalance += c.balance;
    });
  }

  async create() {
    const modalConfig = {
      component: SaveComponent,
      showBackdrop: true,
      backdropDismiss: false,
      animated: true,
      swipeToClose: true,
    };
    const dialog = await this.modal.create(modalConfig);
    await dialog.present();
    await dialog.onDidDismiss();
  }

  showTrans(id: number) {
    this.router.navigateRoot(['/transactions/account/', id]);
  }
}
