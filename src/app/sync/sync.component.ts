import { Component, Input } from '@angular/core';
import { AccountTypeService } from '../entities/account-type/service/account-type.service';
import { BaseComponent } from '../core/helpers/base.component';
import { TagService } from '../entities/tags/service/tag.service';
import { PayeeService } from '../entities/payees/service/payee.service';
import { CategoryService } from '../entities/categories/service/category.service';
import { SubCategoryService } from '../entities/categories/service/sub-category.service';
import { AccountService } from '../accounts/service/account.service';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss'],
})
export class SyncComponent extends BaseComponent {

  @Input()
  isWeb = false;
  isSyncing = false;

  constructor(
    private accountType: AccountTypeService,
    private category: CategoryService,
    private subCategory: SubCategoryService,
    private payee: PayeeService,
    private tag: TagService,
    private account: AccountService,
  ) {
    super();
  }

  async sync() {
    this.isSyncing = true;
    console.log('syncing the data');

    try {

      await this.accountType.syncData();
      await this.payee.syncData();
      await this.tag.syncData();
      await this.category.syncData();
      await this.subCategory.syncData();
      await this.account.syncData();

    } catch (error) {
      console.log('Error occured');
      console.log(error);
    }
    this.isSyncing = false;
  }
}
