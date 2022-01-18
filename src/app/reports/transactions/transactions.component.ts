import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { ActionsComponent } from 'src/app/core/components/actions/actions.component';
import { BaseComponent } from 'src/app/core/helpers/base.component';
import { StoreService } from 'src/app/store/store.service';
import { TransactionView } from 'src/app/transaction/models/transaction-view';
import { SaveComponent } from 'src/app/transaction/save/save.component';
import { TransactionService } from 'src/app/transaction/service/transaction.service';
import { TransactionFilter } from '../modals/transaction-filter';
import { ReportService } from '../services/report.service';
import { FiltersComponent } from './filters/filters.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent extends BaseComponent implements OnInit {

  transactions: TransactionView[] = [];
  isLoading = false;
  filters: TransactionFilter;
  totalPages = 0;
  totalRecords = 0;
  currentRecords = 0;

  constructor(
    private reports: ReportService,
    private service: TransactionService,
    private alertController: AlertController,
    private storeService: StoreService,
    private modal: ModalController,
    public popoverController: PopoverController,
  ) {
    super();
  }

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    if (this.isLoading === true) {
      return;
    }
    this.filters = {
      currentPage: 1,
      pageSize: 99,
    };
    this.isLoading = true;
    this.transactions = [];
    this.getData(this.filters);
  }

  loadData(event) {
    if (this.filters.currentPage >= this.totalPages) {
      event.target.disabled = true;
      return;
    }
    this.filters.currentPage = this.filters.currentPage + 1;
    this.getData(this.filters);

    if (event) {
      event.target.complete();
    }
  }

  private getData(request: TransactionFilter) {
    this.reports.getTransactions(request)
      .then(
        (response) => {
          const totalPages = Math.ceil(response.totalRecords / request.pageSize);
          this.totalPages = totalPages < 1 ? 1 : totalPages;
          this.totalRecords = response.totalRecords;

          this.transactions.push(...response.records);
          this.currentRecords = this.transactions.length;

          this.isLoading = false;
        });
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
    const props = { transaction: transaction };
    await this.showDialog(props, SaveComponent);
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
              .then(data => {
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
    const props = { oldTransaction: transaction };
    await this.showDialog(props, SaveComponent);
  }

  private async showDialog(props, component: any) {
    const modalConfig = {
      component: component,
      showBackdrop: true,
      backdropDismiss: false,
      animated: true,
      swipeToClose: true,
      componentProps: props
    };
    const dialog = await this.modal.create(modalConfig);
    await dialog.present();
    return await dialog.onDidDismiss();
  }

  async showFilters() {
    const props = { filters: this.filters };
    const result = await this.showDialog(props, FiltersComponent);

    if (result && result.data && result.data === true) {
      this.filters.currentPage = 1;
      this.transactions = [];
      this.isLoading = true;
      this.getData(this.filters);
    }
  }

}
