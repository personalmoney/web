import { Component, OnInit } from '@angular/core';
import { AccountType } from 'src/app/entities/account-type/models/account-type';
import { Observable } from 'rxjs';
import { ModalController, AlertController } from '@ionic/angular';
import { SaveComponent } from '../save/save.component';
import { BaseComponent } from 'src/app/core/helpers/base.component';
import { AccountTypeState } from '../store/store';
import { Select, Store } from '@ngxs/store';
import { DeleteAccountType } from '../store/actions';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-account-type',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent extends BaseComponent implements OnInit {

  @Select(AccountTypeState.getSortedData) accountTypes$: Observable<AccountType[]>;

  constructor(
    private alertController: AlertController,
    private store: Store,
    private storeService: StoreService,
    private modal: ModalController
  ) {
    super();
  }

  ngOnInit() {
    this.storeService.getAccountTypes();
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
  }

  async edit(accountType: AccountType) {
    const modalConfig = {
      component: SaveComponent,
      showBackdrop: true,
      backdropDismiss: false,
      animated: true,
      swipeToClose: true,
      componentProps: {
        accountType
      }
    };
    await this.showDialog(modalConfig);
  }

  async delete(accountType: AccountType) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to delete ' + accountType.name + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: () => {
            this.store.dispatch(new DeleteAccountType(accountType));
          }
        }
      ]
    });
    await alert.present();
  }
}
