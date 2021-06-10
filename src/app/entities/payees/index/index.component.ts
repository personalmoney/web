import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/core/helpers/base.component';
import { Observable } from 'rxjs';
import { Payee } from '../models/payee';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { SaveComponent } from '../save/save.component';
import { Store, Select } from '@ngxs/store';
import { PayeeState } from '../store/store';
import { DeletePayee } from '../store/actions';
import { StoreService } from 'src/app/store/store.service';
import { takeUntil, tap } from 'rxjs/operators';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent extends BaseComponent implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @Select(PayeeState.getSortedData) payees$: Observable<Payee[]>;
  payees: Payee[] = [];
  filteredPayees: Payee[] = [];
  displayedPayees: Payee[] = [];
  currentSearchTerm: string = '';

  constructor(
    private store: Store,
    private alertController: AlertController,
    private storeService: StoreService,
    private platform: Platform,
    private modal: ModalController
  ) {
    super();
  }

  async ngOnInit() {
    await this.platform.ready();
    this.height = this.platform.height();
    this.width = this.platform.width();

    this.storeService.getPayees();

    this.payees$.pipe(
      takeUntil(this.ngUnsubscribe),
      tap((data) => {
        if (data) {
          this.payees = data;
          this.doFilter();
        }
      })).subscribe();
  }

  loadMoreData($event) {
    const recordsCount = this.displayedPayees.length;
    if (recordsCount >= this.filteredPayees.length) {
      if ($event) {
        $event.target.disabled = true;
      }
      return;
    }
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false;
    }
    let requiredRecords = Math.ceil(this.height / 50);
    if (this.width > 768) {
      requiredRecords = Math.ceil(this.height / 25);
    }
    const nextRecords = this.filteredPayees.slice(recordsCount, recordsCount + requiredRecords);
    this.displayedPayees.push(...nextRecords);

    if ($event) {
      $event.target.complete();
    }
  }

  filterItems($event) {
    this.currentSearchTerm = $event.detail.value;
    this.doFilter();
  }

  private doFilter() {
    if (this.currentSearchTerm && this.currentSearchTerm.trim() !== '') {
      this.currentSearchTerm = this.currentSearchTerm.toLowerCase();
      this.filteredPayees = this.payees.filter((item) => {
        return (item.name.toLowerCase().indexOf(this.currentSearchTerm) > -1);
      });
    } else {
      this.filteredPayees = this.payees;
    }
    this.displayedPayees = [];
    this.loadMoreData(null);
  }

  async create() {
    const modalConfig = {
      component: SaveComponent,
      showBackdrop: true,
      backdropDismiss: false,
      animated: true,
      swipeToClose: true
    };
    await this.showDialog(modalConfig);
  }

  private async showDialog(modalConfig) {
    const dialog = await this.modal.create(modalConfig);
    await dialog.present();
    await dialog.onDidDismiss();
  }

  async edit(payee: Payee) {
    const modalConfig = {
      component: SaveComponent,
      showBackdrop: true,
      backdropDismiss: false,
      animated: true,
      swipeToClose: true,
      componentProps: {
        payee
      }
    };
    await this.showDialog(modalConfig);
  }

  async delete(payee: Payee) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to delete ' + payee.name + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: () => {
            this.store.dispatch(new DeletePayee(payee));
          }
        }
      ]
    });
    await alert.present();
  }

}
