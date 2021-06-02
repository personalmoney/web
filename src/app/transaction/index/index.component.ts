import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/core/services/shared.service';
import { takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/core/helpers/base.component';
import { AlertController, NavController, PopoverController } from '@ionic/angular';
import { TransactionView } from '../models/transaction-view';
import { TransactionService } from '../service/transaction.service';
import { TransactionSearch } from '../models/transaction-Search';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Account } from 'src/app/accounts/models/account';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/store/store.service';
import { ActionsComponent } from 'src/app/core/components/actions/actions.component';
import { AccountState } from 'src/app/accounts/store/store';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent extends BaseComponent implements OnInit {

  isWeb = false;
  currentPage = 1;
  pageSize = 100;
  totalPages = 0;
  transactions: TransactionView[] = [];
  selectedAccount: Account;
  selectedAccountId: number;
  accounts: Observable<Account[]>;
  isLoading = false;
  balance = 0;

  constructor(
    shared: SharedService,
    private store: Store,
    private router: NavController,
    private activeRoute: ActivatedRoute,
    private alertController: AlertController,
    private storeService: StoreService,
    public popoverController: PopoverController,
    private service: TransactionService
  ) {
    super();
    shared.isWeb
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(c => {
        this.isWeb = c;
      });
  }

  async ngOnInit() {
    this.storeService.getAccounts();
    this.accounts = this.store.select(AccountState.getSortedData)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(data => {

          this.activeRoute.paramMap
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((data2) => {
              const accountId = +data2.get('accountId');
              if (accountId && data) {
                const account = data.find(c => c.id === accountId);
                this.selectedAccount = account;
                this.loadInitialData();
              }
              else if (data) {
                this.selectedAccount = data[0];
                this.loadInitialData();
              }
            });
        }));
  }

  loadInitialData() {
    if (this.isLoading === true) {
      return;
    }
    this.selectedAccountId = this.selectedAccount.id;
    this.balance = this.selectedAccount.balance;
    this.isLoading = true;
    this.transactions = [];
    this.currentPage = 1;
    let request: TransactionSearch = {
      pageSize: this.pageSize,
      account_id: this.selectedAccount.id,
      currentPage: this.currentPage
    };
    this.getData(request);
  }

  loadData(event) {
    if (this.currentPage >= this.totalPages) {
      event.target.disabled = true;
      return;
    }
    const request: TransactionSearch = {
      pageSize: this.pageSize,
      account_id: this.selectedAccount.id,
      currentPage: this.currentPage
    };
    this.getData(request);

    if (event) {
      event.target.complete();
    }
  }

  private getData(request: TransactionSearch) {

    this.service.getTransactions(request)
      .pipe(
        tap((response) => {
          const totalPages = Math.floor(response.totalRecords / response.pageSize);
          this.totalPages = totalPages < 1 ? 1 : totalPages;
          this.currentPage = response.currentPage + 1;
          this.transactions.push(...response.records);
          this.isLoading = false;
        }),
        takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  async create() {
    this.router.navigateForward(['transactions/save/account', this.selectedAccount.id]);
  }

  accountChange($event) {
    this.router.navigateRoot(['/transactions/account/', $event.target.value]);

  }

  async showOptions(event, transaction: TransactionView) {
    const popover = await this.popoverController.create({
      component: ActionsComponent,
      event,
      translucent: true,
      componentProps: {
        editEvent: () => {
          this.edit(transaction);
        },
        deleteEvent: () => {
          this.delete(transaction);
        }
      }
    });
    return await popover.present();
  }

  edit(transaction: TransactionView) {
    this.router.navigateForward(['transactions/edit', transaction.id]);
  }

  async delete(transaction: TransactionView) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: `Are you sure you want to delete transaction with amount ${transaction.amount} ?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: () => {
            this.service.delete(transaction)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(data => {
                this.storeService.getAccounts(true);
                this.loadInitialData();
              });
          }
        }
      ]
    });
    await alert.present();
  }
}
