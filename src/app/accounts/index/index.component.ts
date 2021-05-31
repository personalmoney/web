import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/helpers/base.component';
import { Observable } from 'rxjs';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { SaveComponent } from '../save/save.component';
import { Account } from '../models/account';
import { ActionsComponent } from 'src/app/core/components/actions/actions.component';
import { AccountState } from '../store/store';
import { Select, Store } from '@ngxs/store';
import { DeleteAccount } from '../store/actions';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent extends BaseComponent implements OnInit {

  @Select(AccountState.getData) accounts$: Observable<Account[]>;

  constructor(
    private store: Store,
    private alertController: AlertController,
    private storeService: StoreService,
    public popoverController: PopoverController,
    private modal: ModalController
  ) {
    super();
  }

  ngOnInit() {
    this.storeService.getAccounts();
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

  async edit(account: Account) {
    const modalConfig = {
      component: SaveComponent,
      showBackdrop: true,
      backdropDismiss: false,
      animated: true,
      swipeToClose: true,
      componentProps: {
        account
      }
    };
    await this.showDialog(modalConfig);
  }

  async delete(account: Account) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to delete ' + account.name + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: () => {
            this.store.dispatch(new DeleteAccount(account));
          }
        }
      ]
    });
    await alert.present();
  }

  async showOptions(event, account: Account) {
    const popover = await this.popoverController.create({
      component: ActionsComponent,
      event,
      translucent: true,
      componentProps: {
        editEvent: () => {
          this.edit(account);
        },
        deleteEvent: () => {
          this.delete(account);
        }
      }
    });
    return await popover.present();
  }
}
