import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/helpers/base.component';
import { Observable } from 'rxjs';
import { ModalController, PopoverController } from '@ionic/angular';
import { SaveComponent } from '../save/save.component';
import { Account } from '../models/account';
import { AccountState } from '../store/store';
import { Select } from '@ngxs/store';
import { StoreService } from 'src/app/store/store.service';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent extends BaseComponent implements OnInit {

  @Select(AccountState.getSortedData) accounts$: Observable<Account[]>;
  activeAccounts: Account[] = [];
  disabledAccounts: Account[] = [];

  constructor(
    private storeService: StoreService,
    public popoverController: PopoverController,
    private modal: ModalController
  ) {
    super();
  }

  ngOnInit() {
    this.storeService.getAccounts();
    this.accounts$.pipe(
      takeUntil(this.ngUnsubscribe),
      tap((data) => {
        if (data) {
          this.activeAccounts = data.filter(c => c.is_active);
          this.disabledAccounts = data.filter(c => !c.is_active);
        }
      })).subscribe();
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


}
