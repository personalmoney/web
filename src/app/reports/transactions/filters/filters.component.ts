import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { takeUntil } from 'rxjs/operators';
import { Account } from 'src/app/accounts/models/account';
import { AccountState } from 'src/app/accounts/store/store';
import { BaseForm } from 'src/app/core/helpers/base-form';
import { TransactionType } from 'src/app/core/helpers/utils';
import { Category } from 'src/app/entities/categories/models/category';
import { SubCategory } from 'src/app/entities/categories/models/sub-category';
import { CategoryState } from 'src/app/entities/categories/store/category-state';
import { Payee } from 'src/app/entities/payees/models/payee';
import { PayeeState } from 'src/app/entities/payees/store/store';
import { StoreService } from 'src/app/store/store.service';
import { TransactionFilter } from '../../modals/transaction-filter';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent extends BaseForm implements OnInit {

  accounts: Account[] = [];
  payees: Payee[] = [];
  types: any[] = [];
  @Input()
  filters: TransactionFilter;
  subCategories: SubCategory[] = [];

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
    this.patchForm();

    this.storeService.getAccounts();
    this.store.select(AccountState.getSortedData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (data) {
          this.accounts = data;
        }
        this.patchAccounts();
      });

    this.storeService.getPayees();
    this.store.select(PayeeState.getSortedData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (data) {
          this.payees = data;
        }
        this.patchPayees();
      });

    this.storeService.getCategories();
    this.store.select(CategoryState.getSortedData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (data) {
          this.subCategories = [];
          data.forEach(c => {
            const result = c.sub_categories.map(d => Object.assign({}, d, { category_name: c.name }));
            this.subCategories.push(...result);
          });
        }
        this.patchCategories();
      });;
  }


  initForm() {
    this.types = [{ name: TransactionType.Withdraw }, { name: TransactionType.Deposit }, { name: TransactionType.Transfer }];
    this.form = this.fb.group({
      accountIds: [''],
      transactionTypes: [''],
      fromDate: [''],
      toDate: [''],
      fromAmount: [''],
      toAmount: [''],
      notes: [''],
      subCategoryIds: [],
      payeeIds: []
    });
  }

  patchForm() {

    if (this.filters.transactionTypes) {
      this.form.patchValue({ transactionTypes: this.types.filter(c => this.filters.transactionTypes.includes(c.name)) });
    }
    this.form.patchValue({ fromDate: this.filters.fromDate });
    this.form.patchValue({ toDate: this.filters.toDate });
    this.form.patchValue({ fromAmount: this.filters.fromAmount });
    this.form.patchValue({ toAmount: this.filters.toAmount });
    this.form.patchValue({ notes: this.filters.notes });
  }

  patchAccounts() {
    if (this.filters.accountIds) {
      this.form.patchValue({ accountIds: this.accounts.filter(c => this.filters.accountIds.includes(c.id)) });
    }
  }

  patchCategories() {
    if (this.filters.subCategoryIds) {
      this.form.patchValue({ subCategoryIds: this.subCategories.filter(c => this.filters.subCategoryIds.includes(c.id)) });
    }
  }

  patchPayees() {
    if (this.filters.payeeIds) {
      this.form.patchValue({ payeeIds: this.payees.filter(c => this.filters.payeeIds.includes(c.id)) });
    }
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
    this.filters.notes = this.form.controls.notes.value;

    this.filters.subCategoryIds = [];
    if (this.form.controls.subCategoryIds.value) {
      this.filters.subCategoryIds = this.form.controls.subCategoryIds.value.map(c => c.id);
    }

    this.filters.payeeIds = [];
    if (this.form.controls.payeeIds.value) {
      this.filters.payeeIds = this.form.controls.payeeIds.value.map(c => c.id);
    }
    this.close(true);
  }

  clear() {
    this.form.reset();
  }

  close(isSuccess: boolean = false) {
    this.modal.dismiss(isSuccess, 'click');
  }

}
