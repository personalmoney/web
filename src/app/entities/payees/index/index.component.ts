import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/helpers/base.component';
import { Observable } from 'rxjs';
import { Payee } from '../models/payee';
import { AlertController, ModalController } from '@ionic/angular';
import { SaveComponent } from '../save/save.component';
import { Store, Select } from '@ngxs/store';
import { PayeeState } from '../store/store';
import { GetPayees, DeletePayee } from '../store/actions';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent extends BaseComponent implements OnInit {

  @Select(PayeeState.getData) payees$: Observable<Payee[]>;

  constructor(
    private store: Store,
    private alertController: AlertController,
    private storeService: StoreService,
    private modal: ModalController
  ) {
    super();
  }

  ngOnInit() {
    this.storeService.getPayees();
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
