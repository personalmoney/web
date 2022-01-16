import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { takeUntil } from 'rxjs/operators';
import { Account } from 'src/app/accounts/models/account';
import { AccountState } from 'src/app/accounts/store/store';
import { BaseForm } from 'src/app/core/helpers/base-form';
import { TransactionType } from 'src/app/core/helpers/utils';
import { StoreService } from 'src/app/store/store.service';
import { TransactionFilter } from '../../modals/transaction-filter';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent extends BaseForm implements OnInit {

  accounts: Account[] = [];
  types: any[] = [];
  @Input()
  filters: TransactionFilter;

  constructor(
    private store: Store,
    private modal: ModalController,
    private fb: FormBuilder,
    private storeService: StoreService,
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();
    this.storeService.getAccounts();
    this.store.select(AccountState.getSortedData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.accounts = data;
        if (data) {
          this.accounts = data;
        }
        this.patchForm();
      });

  }


  initForm() {
    this.types = [{ name: TransactionType.Withdraw }, { name: TransactionType.Deposit }, { name: TransactionType.Transfer }];
    this.form = this.fb.group({
      accountIds: [''],
      transactionTypes: [''],
      fromDate: [''],
      toDate: [''],
      fromAmount: [''],
      toAmount: ['']
    });
  }

  patchForm() {
    if (this.filters.accountIds) {
      this.form.patchValue({ accountIds: this.accounts.filter(c => this.filters.accountIds.includes(c.id)) });
    }
    if (this.filters.transactionTypes) {
      this.form.patchValue({ transactionTypes: this.types.filter(c => this.filters.transactionTypes.includes(c.name)) });
    }
    this.form.patchValue({ fromDate: this.filters.fromDate });
    this.form.patchValue({ toDate: this.filters.toDate });
    this.form.patchValue({ fromAmount: this.filters.fromAmount });
    this.form.patchValue({ toAmount: this.filters.toAmount });
  }

  formatData(data: any[]) {
    return data.map(record => record.name).join(', ');
  }

  apply() {
    this.filters.accountIds = [];
    if (this.form.controls.accountIds.value) {
      this.filters.accountIds = this.form.controls.accountIds.value.map(c => c.id);
    }
    this.filters.transactionTypes = [];
    if (this.form.controls.transactionTypes.value) {
      this.filters.transactionTypes = this.form.controls.transactionTypes.value.map(c => c.name);
    }
    this.filters.fromDate = this.form.controls.fromDate.value;
    this.filters.toDate = this.form.controls.toDate.value;
    this.filters.fromAmount = this.form.controls.fromAmount.value;
    this.filters.toAmount = this.form.controls.toAmount.value;

    this.close(true);
  }

  close(isSuccess: boolean = false) {
    this.modal.dismiss(isSuccess, 'click');
  }

}
