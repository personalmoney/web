import { Component, Input } from '@angular/core';
import { AlertController, PopoverController, ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { ActionsComponent } from 'src/app/core/components/actions/actions.component';
import { SaveComponent } from 'src/app/accounts/save/save.component';
import { Account } from '../../models/account';
import { DeleteAccount } from '../../store/actions';
import { IAction } from 'src/app/core/models/actions';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent {

  showRecords = true;

  @Input()
  accounts: Account[];

  @Input()
  title: string;

  constructor(private store: Store,
    private alertController: AlertController,
    public popoverController: PopoverController,
    private router: NavController,
    private modal: ModalController
  ) { }

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
        events: [
          { label: 'Edit', action: () => { this.edit(account); } },
          { label: 'Delete', action: () => { this.delete(account); } },
          { label: 'View Transactions', action: () => { this.router.navigateRoot(['/transactions/account/', account.id]); } }
        ]
      }
    });
    return await popover.present();
  }

}
