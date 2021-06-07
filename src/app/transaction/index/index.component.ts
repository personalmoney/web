import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/core/services/shared.service';
import { takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/core/helpers/base.component';
import { AlertController, ModalController, NavController, PopoverController } from '@ionic/angular';
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
import { SaveComponent } from '../save/save.component';

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
    private modal: ModalController,
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
    this.currentPage = this.currentPage + 1;
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
      .then(
        (response) => {
          const totalPages = Math.ceil(response.totalRecords / response.pageSize);
          this.totalPages = totalPages < 1 ? 1 : totalPages;

          this.transactions.push(...response.records);
          this.isLoading = false;
        });
  }

  async create() {
    const props = { accountId: this.selectedAccount.id };
    await this.showDialog(props);
  }

  private async showDialog(props) {
    const modalConfig = {
      component: SaveComponent,
      showBackdrop: true,
      backdropDismiss: false,
      animated: true,
      swipeToClose: true,
      componentProps: props
    };
    const dialog = await this.modal.create(modalConfig);
    await dialog.present();
    await dialog.onDidDismiss();
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
        events: [
          { label: 'Edit', action: () => { this.edit(transaction); } },
          { label: 'Duplicate', action: () => { this.duplicate(transaction); } },
          { label: 'Delete', action: () => { this.delete(transaction); } },
        ]
      }
    });
    return await popover.present();
  }

  async edit(transaction: TransactionView) {
    const props = { transactionId: transaction.id };
    await this.showDialog(props);
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

  async duplicate(transaction: TransactionView) {
    const props = { oldTransactionId: transaction.id };
    await this.showDialog(props);
  }
}
